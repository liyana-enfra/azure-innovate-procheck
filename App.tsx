
// External libraries and internal components required for the platform.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tenant, HealthStatus, DashboardStats, ChecklistItem, UserRole, ResourceIssue, ThresholdSettings, User, MetricReading, Engineer, LogEntry } from './types';
import { SOP_REQUIREMENTS, SCORING_THRESHOLDS, ERROR_TAXONOMY, MOCK_TENANTS } from './constants';
import { db } from './services/database'; 
import Layout from './components/Layout'; 
import TenantCard from './components/TenantCard'; 
import HealthDetails from './components/HealthDetails'; 
import ArchitectureView from './components/ArchitectureView'; 
import OnboardingView from './components/OnboardingView'; 
import SettingsModule from './components/SettingsModule'; 
import ExecutiveView from './components/ExecutiveView'; 
import ReportModal from './components/ReportModal'; 
import ProfilePage from './components/ProfilePage'; 
import InventoryView from './components/InventoryView'; 
import TeamView from './components/TeamView'; 
import ActivityLogs from './components/ActivityLogs'; 
import OnboardingGuide from './components/OnboardingGuide'; 
import TutorialPage from './components/TutorialPage'; // Master Tutorial
import WalkthroughPopup from './components/WalkthroughPopup'; // Per-page walkthroughs
import { LoginPage } from './components/AuthPages'; 

const App: React.FC = () => {
  // --- STATE DEFINITIONS ---
  const [currentUser, setCurrentUser] = useState<User | null>(db.getSession());
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdSettings>(SCORING_THRESHOLDS);
  const [showGuide, setShowGuide] = useState(!db.getGuideStatus());
  const [tutorialsSeen, setTutorialsSeen] = useState<string[]>(db.getTutorialsSeen());

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isScanningBatch, setIsScanningBatch] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ [id: string]: boolean }>({});
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Filtering States
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<HealthStatus | 'ALL' | 'ACTIVE_RESOURCES'>('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [onboardingFilter, setOnboardingFilter] = useState('ALL');

  useEffect(() => {
    // FIX: db.getTenants() returns a Promise, so we must await it inside an async function within useEffect to resolve the TypeScript error.
    const initializeData = async () => {
      const storedTenants = await db.getTenants();
      const storedLogs = db.getLogs();
      const storedEngineers = db.getEngineers();
      const storedSettings = db.getSettings();

      setTenants(storedTenants);

      if (storedEngineers.length === 0) {
        const mockEngineers: Engineer[] = [
          { 
            id: 'e1', 
            name: 'Admin Engineer', 
            email: 'admin-eng@msp.com', 
            role: 'Admin', 
            status: 'online', 
            currentTask: 'Ready for tenant onboarding & security review', 
            assignedTenants: [], 
            avatar: 'https://picsum.photos/120/120?random=1', 
            shiftStart: new Date().toISOString(), 
            ipAddress: '127.0.0.1' 
          }
        ];
        db.saveEngineers(mockEngineers);
        setEngineers(mockEngineers);
      } else {
        setEngineers(storedEngineers);
      }

      setLogs(storedLogs);
      if (storedSettings) setThresholds(storedSettings);
    };

    initializeData();
  }, []);

  useEffect(() => { if (tenants.length > 0) db.saveTenants(tenants); }, [tenants]);
  useEffect(() => { if (thresholds) db.saveSettings(thresholds); }, [thresholds]);
  useEffect(() => { if (engineers.length > 0) db.saveEngineers(engineers); }, [engineers]);
  useEffect(() => { db.setSession(currentUser); }, [currentUser]);

  const stats = useMemo((): DashboardStats => {
    let active = 0;
    let idle = 0;
    tenants.forEach(t => t.checklist.forEach(item => item.affectedResources.forEach(r => {
      if (r.state === 'Active') active++; else idle++;
    })));

    return {
      totalTenants: tenants.length,
      healthyCount: tenants.filter(t => t.status === HealthStatus.HEALTHY).length,
      warningCount: tenants.filter(t => t.status === HealthStatus.WARNING).length,
      criticalCount: tenants.filter(t => t.status === HealthStatus.CRITICAL).length,
      activeResources: active || (tenants.length * 8), 
      idleResources: idle || (tenants.length * 2)
    };
  }, [tenants]);

  const locations = useMemo(() => ['ALL', ...Array.from(new Set(tenants.map(t => t.location)))], [tenants]);
  const onboardingStatuses = ['ALL', 'Pending', 'Complete', 'Missing Prerequisites'];

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(dashboardSearch.toLowerCase()) || 
                            t.subscriptionId.toLowerCase().includes(dashboardSearch.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === HealthStatus.HEALTHY) matchesStatus = t.status === HealthStatus.HEALTHY;
      else if (statusFilter === HealthStatus.CRITICAL) matchesStatus = t.status === HealthStatus.CRITICAL;
      else if (statusFilter === 'ACTIVE_RESOURCES') {
          matchesStatus = t.checklist.some(item => item.affectedResources.some(res => res.state === 'Active')) || t.checklist.length === 0;
      }

      const matchesLocation = locationFilter === 'ALL' || t.location === locationFilter;
      const matchesOnboarding = onboardingFilter === 'ALL' || t.onboardingStatus === onboardingFilter;
      
      return matchesSearch && matchesStatus && matchesLocation && matchesOnboarding;
    });
  }, [tenants, dashboardSearch, statusFilter, locationFilter, onboardingFilter]);

  const runScanForTenant = useCallback((tenantId: string) => {
    setScanProgress(prev => ({ ...prev, [tenantId]: true }));
    const tenant = tenants.find(t => t.id === tenantId);
    db.addLog({
      type: 'Audit',
      severity: 'Info',
      user: currentUser?.name || 'System',
      message: `Audit scan initiated for tenant: ${tenant?.name}`,
      targetId: tenantId,
      tenantId: tenant?.id,
      tenantName: tenant?.name
    });
    setLogs(db.getLogs());

    setTimeout(() => {
      setTenants(prev => prev.map(t => {
        if (t.id === tenantId) {
          const checklist = generateMockChecklist(t.status, t.name);
          return { ...t, checklist, lastScan: new Date().toISOString() };
        }
        return t;
      }));
      setScanProgress(prev => { const next = { ...prev }; delete next[tenantId]; return next; });
      setSelectedTenant(prev => prev?.id === tenantId ? { ...prev, checklist: generateMockChecklist(prev.status, prev.name), lastScan: new Date().toISOString() } : prev);
      
      db.addLog({
        type: 'Audit',
        severity: 'Info',
        user: 'System',
        message: `Audit scan completed successfully for ${tenant?.name}`,
        targetId: tenantId,
        tenantId: tenant?.id,
        tenantName: tenant?.name
      });
      setLogs(db.getLogs());
    }, 1500);
  }, [thresholds, tenants, currentUser]);

  const handleBatchScan = () => {
    setIsScanningBatch(true);
    db.addLog({ type: 'Audit', severity: 'Info', user: currentUser?.name || 'System', message: 'Global batch audit sync triggered.' });
    setLogs(db.getLogs());
    tenants.forEach((t, i) => setTimeout(() => runScanForTenant(t.id), i * 150));
    setTimeout(() => setIsScanningBatch(false), (tenants.length * 150) + 1500);
  };

  const handleLogin = (role: UserRole, email: string) => {
    const newUser: User = { 
      id: crypto.randomUUID(), 
      name: role === 'Admin' ? 'Admin Engineer' : 'New Engineer', 
      email, role, avatar: `https://picsum.photos/120/120?random=${Math.floor(Math.random() * 100)}`,
      lastLogin: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setCurrentUser(newUser);
    
    // Add to engineers list if not present
    if (role === 'Engineer' && !engineers.find(e => e.email === email)) {
        const newEng: Engineer = {
            ...newUser,
            status: 'online',
            currentTask: 'Initial security walkthrough',
            assignedTenants: [],
            shiftStart: new Date().toISOString()
        };
        setEngineers(prev => [...prev, newEng]);
    }

    db.addLog({ type: 'Security', severity: 'Info', user: newUser.name, message: `Account login authorized.` });
    setLogs(db.getLogs());
  };

  const handleLogout = () => {
    db.addLog({ type: 'Security', severity: 'Info', user: currentUser?.name || 'System', message: 'Session terminated by user.' });
    setCurrentUser(null);
    setLogs(db.getLogs());
  };

  const completeGuide = () => {
    db.setGuideStatus(true);
    setShowGuide(false);
  };

  const dismissTutorial = (page: string) => {
    db.setTutorialSeen(page);
    setTutorialsSeen(prev => [...prev, page]);
  };

  if (!currentUser) return <LoginPage onLogin={(role, email) => handleLogin(role as UserRole, email)} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'onboarding': return <OnboardingView />;
      case 'inventory': return <InventoryView tenants={tenants} />;
      case 'team': return <TeamView engineers={engineers} currentUserRole={currentUser.role} />;
      case 'logs': return <ActivityLogs logs={logs} />;
      case 'executive': return <ExecutiveView />;
      case 'docs': return <ArchitectureView />;
      case 'how-to': return <TutorialPage />; 
      case 'settings': return <SettingsModule thresholds={thresholds} setThresholds={setThresholds} />;
      case 'profile': return <ProfilePage user={currentUser} />;
      default: return (
        <div className="space-y-6 md:space-y-12 animate-in fade-in duration-500 pb-20">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">ProCheck Hub</h2>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] max-w-md">
                  <input 
                    type="text" 
                    placeholder="Search customer portfolio..." 
                    value={dashboardSearch}
                    onChange={(e) => setDashboardSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-600 shadow-sm"
                >
                  {locations.map(loc => <option key={loc} value={loc}>{loc === 'ALL' ? 'All Regions' : loc}</option>)}
                </select>

                <select 
                  value={onboardingFilter}
                  onChange={(e) => setOnboardingFilter(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-600 shadow-sm"
                >
                  {onboardingStatuses.map(st => <option key={st} value={st}>{st === 'ALL' ? 'All Onboarding' : st}</option>)}
                </select>

                {(statusFilter !== 'ALL' || locationFilter !== 'ALL' || onboardingFilter !== 'ALL') && (
                  <button 
                    onClick={() => { setStatusFilter('ALL'); setLocationFilter('ALL'); setOnboardingFilter('ALL'); }} 
                    className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-4">
               <button onClick={handleBatchScan} disabled={isScanningBatch || tenants.length === 0} className={`flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 ${isScanningBatch || tenants.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 md:h-6 md:w-6 ${isScanningBatch ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 {isScanningBatch ? 'Syncing...' : 'Global Audit Sync'}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <button onClick={() => setStatusFilter(HealthStatus.HEALTHY)} className={`bg-white border-b-4 transition-all p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-left ${statusFilter === HealthStatus.HEALTHY ? 'border-b-emerald-600 ring-2 ring-emerald-100' : 'border-b-emerald-500 hover:border-b-emerald-600'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Healthy</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-600">{stats.healthyCount}</p>
            </button>
            <button onClick={() => setStatusFilter(HealthStatus.CRITICAL)} className={`bg-white border-b-4 transition-all p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-left ${statusFilter === HealthStatus.CRITICAL ? 'border-b-rose-600 ring-2 ring-rose-100' : 'border-b-rose-500 hover:border-b-rose-600'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Critical</p>
                <p className="text-2xl md:text-3xl font-black text-rose-600">{stats.criticalCount}</p>
            </button>
            <button onClick={() => setStatusFilter('ACTIVE_RESOURCES')} className={`bg-white border-b-4 transition-all p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm text-left ${statusFilter === 'ACTIVE_RESOURCES' ? 'border-b-indigo-600 ring-2 ring-indigo-100' : 'border-b-indigo-500 hover:border-b-indigo-600'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Assets</p>
                <p className="text-2xl md:text-3xl font-black text-indigo-600">{stats.activeResources}</p>
            </button>
            <div className="bg-slate-900 p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-white">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Availability</p>
                <p className="text-2xl md:text-3xl font-black">100.0<span className="text-sm font-bold text-indigo-400">%</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredTenants.map(tenant => (
              <TenantCard key={tenant.id} tenant={tenant} onClick={setSelectedTenant} isScanning={!!scanProgress[tenant.id]} />
            ))}
          </div>
          {filteredTenants.length === 0 && (
            <div className="py-24 text-center bg-white border border-slate-100 rounded-[3rem] shadow-sm flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 grayscale">🏢</div>
               <p className="text-slate-900 font-black text-lg">No Tenants Found</p>
               <p className="text-slate-400 font-medium mb-8">Navigate to the 'Onboard' tab to add your first Azure subscription.</p>
               <button onClick={() => setActiveTab('onboarding')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">Go to Onboarding</button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {renderContent()}
      
      {showGuide && <OnboardingGuide onComplete={completeGuide} />}

      {/* Page Walkthrough Logic */}
      {!showGuide && !tutorialsSeen.includes(activeTab) && (
        <WalkthroughPopup activeTab={activeTab} onDismiss={() => dismissTutorial(activeTab)} />
      )}

      {selectedTenant && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 md:backdrop-blur-xl animate-in fade-in duration-500 md:p-10">
          <div className="w-full h-full md:max-w-7xl md:h-[92vh] flex items-center">
            <HealthDetails tenant={selectedTenant} onClose={() => setSelectedTenant(null)} onRunScan={runScanForTenant} />
          </div>
        </div>
      )}

      {showReportModal && (
        <ReportModal tenants={tenants} onClose={() => setShowReportModal(false)} />
      )}
    </Layout>
  );
};

const generateMockChecklist = (status: HealthStatus, tenantName: string): ChecklistItem[] => {
  return SOP_REQUIREMENTS.map((req) => {
    const metricValue = 35 + Math.random() * 20;
    const affectedResources: ResourceIssue[] = [
      { resourceName: `${tenantName.slice(0, 3).toLowerCase()}-vm-app-01`, resourceType: 'Virtual Machine', status: HealthStatus.HEALTHY, state: 'Active', message: 'Steady state' },
      { resourceName: `${tenantName.slice(0, 3).toLowerCase()}-vm-db-01`, resourceType: 'Virtual Machine', status: HealthStatus.HEALTHY, state: 'Active', message: 'Steady state' }
    ];

    return {
      id: req.id,
      label: req.label,
      category: req.category as any,
      status: HealthStatus.HEALTHY,
      lastChecked: new Date().toISOString(),
      summary: `Verification successful for ${req.label}.`,
      isApplicable: true,
      checksPerformed: [`REST Probe`, `LAW Query`],
      affectedResources,
      metric: req.id === 'cpu' ? { name: 'CPU', value: metricValue, threshold: 80, unit: '%', status: HealthStatus.HEALTHY, history: [] } : undefined
    };
  });
};

export default App;
