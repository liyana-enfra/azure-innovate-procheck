
import React, { useState, useEffect, useMemo } from 'react';
import { Tenant, HealthStatus, ChecklistItem, ResourceIssue } from '../types';
import { getHealthSummary } from '../services/geminiService';
import ComponentDrillDown from './ComponentDrillDown';

interface HealthDetailsProps {
  tenant: Tenant;
  onClose: () => void;
  onRunScan: (tenantId: string) => void;
}

const HealthDetails: React.FC<HealthDetailsProps> = ({ tenant, onClose, onRunScan }) => {
  const [aiSummary, setAiSummary] = useState<string>('Synthesizing operational context...');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [activeTab, setActiveTab] = useState<'checklist' | 'resources'>('checklist');
  const [innerSearch, setInnerSearch] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setIsSummarizing(true);
      const summary = await getHealthSummary(tenant);
      setAiSummary(summary);
      setIsSummarizing(false);
    };
    fetchSummary();
  }, [tenant]);

  // Aggregate resources for this tenant
  const tenantResources = useMemo(() => {
    const resources: ResourceIssue[] = [];
    tenant.checklist.forEach(item => {
      item.affectedResources.forEach(res => {
        // Avoid duplicates if same resource is in multiple checklist items
        if (!resources.find(r => r.resourceName === res.resourceName)) {
          resources.push(res);
        }
      });
    });
    return resources;
  }, [tenant]);

  const filteredChecklist = useMemo(() => {
    return tenant.checklist.filter(item => 
      item.label.toLowerCase().includes(innerSearch.toLowerCase()) || 
      item.category.toLowerCase().includes(innerSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(innerSearch.toLowerCase())
    );
  }, [tenant.checklist, innerSearch]);

  const filteredResources = useMemo(() => {
    return tenantResources.filter(res => 
      res.resourceName.toLowerCase().includes(innerSearch.toLowerCase()) || 
      res.resourceType.toLowerCase().includes(innerSearch.toLowerCase())
    );
  }, [tenantResources, innerSearch]);

  const stats = useMemo(() => {
    const total = tenantResources.length;
    const healthy = tenantResources.filter(r => r.status === HealthStatus.HEALTHY).length;
    const active = tenantResources.filter(r => r.state === 'Active').length;
    return {
      healthyPct: total ? Math.round((healthy / total) * 100) : 0,
      activePct: total ? Math.round((active / total) * 100) : 0,
      total
    };
  }, [tenantResources]);

  return (
    <div className="bg-white md:rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full w-full max-h-[100vh] md:max-h-[92vh]">
      {/* Header */}
      {!selectedItem ? (
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h2 className="text-xl md:text-3xl font-black text-slate-900 truncate max-w-[250px] md:max-w-none">{tenant.name}</h2>
               <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase border shrink-0 ${tenant.status === HealthStatus.HEALTHY ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{tenant.status}</span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium tracking-tight">Secure Operational Review • <span className="font-mono text-[10px] md:text-xs">{tenant.subscriptionId}</span></p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={innerSearch}
                onChange={(e) => setInnerSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button onClick={() => onRunScan(tenant.id)} className="px-4 md:px-6 py-3 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all font-bold text-xs md:text-base flex items-center justify-center gap-2 shadow-xl active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Sync
            </button>
            <button onClick={onClose} className="p-3 md:p-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl md:rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      ) : null}

      {/* Tab Switcher */}
      {!selectedItem && (
        <div className="px-6 md:px-8 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex gap-8">
            <button 
              onClick={() => { setActiveTab('checklist'); setInnerSearch(''); }}
              className={`py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'checklist' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Health Checklist
            </button>
            <button 
              onClick={() => { setActiveTab('resources'); setInnerSearch(''); }}
              className={`py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'resources' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Resource Inventory
            </button>
          </div>
        </div>
      )}

      <div className="p-4 md:p-8 overflow-y-auto flex-1">
        {selectedItem ? (
          <ComponentDrillDown item={selectedItem} onBack={() => setSelectedItem(null)} />
        ) : activeTab === 'checklist' ? (
          <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* AI Insight Bar */}
            {!innerSearch && (
              <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group shrink-0">
                <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-blue-500/10 blur-[60px] md:blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl backdrop-blur-xl flex items-center justify-center text-blue-300 border border-white/10 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xl md:text-2xl mb-2 md:mb-3 flex items-center gap-3">
                      Operational AI
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] uppercase font-black border border-emerald-500/30">Active Analysis</span>
                    </h3>
                    <p className={`text-slate-300 text-sm md:text-lg leading-relaxed max-w-3xl ${isSummarizing ? 'animate-pulse' : ''}`}>
                      {aiSummary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Component Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredChecklist.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="text-left bg-white border border-slate-100 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 hover:shadow-2xl hover:border-indigo-200 transition-all group relative overflow-hidden active:scale-[0.98]"
                >
                  <div className={`absolute top-0 left-0 w-1 md:w-1.5 h-full ${item.status === HealthStatus.HEALTHY ? 'bg-emerald-500' : item.status === HealthStatus.WARNING ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                  
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-base md:text-xl shadow-inner transition-transform group-hover:scale-110 ${item.status === HealthStatus.HEALTHY ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {item.status === HealthStatus.HEALTHY ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-black text-slate-900 text-base md:text-lg mb-1 md:mb-2 group-hover:text-indigo-600 transition-colors truncate">{item.label}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 md:mb-4">{item.category}</p>
                  
                  <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-slate-50">
                    <span className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase">Audit Details →</span>
                    <span className={`text-[9px] md:text-[10px] font-black uppercase ${item.status === HealthStatus.HEALTHY ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.status}
                    </span>
                  </div>
                </button>
              ))}
              {filteredChecklist.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 font-bold">No checklist items match "{innerSearch}"</div>
              )}
            </div>
          </div>
        ) : (
          /* Resource Inventory Tab */
          <div className="space-y-8 animate-in fade-in duration-500">
            {!innerSearch && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                {/* Healthy Distribution Chart */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-emerald-500 transition-all duration-1000" strokeDasharray={`${stats.healthyPct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-slate-800">{stats.healthyPct}%</div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resource Health</h4>
                    <p className="text-xl font-black text-slate-900">{tenantResources.filter(r => r.status === HealthStatus.HEALTHY).length} / {stats.total} Validated</p>
                  </div>
                </div>

                {/* Power State Chart */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-indigo-500 transition-all duration-1000" strokeDasharray={`${stats.activePct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-slate-800">{stats.activePct}%</div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Power State</h4>
                    <p className="text-xl font-black text-slate-900">{tenantResources.filter(r => r.state === 'Active').length} Live Assets</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resource Table */}
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Asset Name</th>
                      <th className="px-8 py-5">Type</th>
                      <th className="px-8 py-5">Power State</th>
                      <th className="px-8 py-5 text-right">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResources.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-4 font-bold text-slate-800">{res.resourceName}</td>
                        <td className="px-8 py-4 text-xs text-slate-500 font-bold uppercase tracking-tight">{res.resourceType}</td>
                        <td className="px-8 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${res.state === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${res.state === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            {res.state}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase border ${res.status === HealthStatus.HEALTHY ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredResources.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic font-bold">
                          No resources match your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {!selectedItem ? (
        <div className="p-4 md:p-8 border-t border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 pb-20 md:pb-8">
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => <img key={i} src={`https://picsum.photos/40/40?random=${i+10}`} className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl border-2 md:border-4 border-white shadow-sm" />)}
             </div>
             <div className="hidden sm:block">
                <p className="text-[10px] font-black text-slate-900 uppercase">Audit Context Verified</p>
                <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Read-Only Enforced</p>
             </div>
          </div>
          <div className="flex gap-2 md:gap-4 w-full md:w-auto">
             <button className="flex-1 md:flex-none px-4 md:px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl md:rounded-2xl font-black text-xs hover:bg-slate-100 transition-all active:scale-95">XLS Report</button>
             <button className="flex-1 md:flex-none px-4 md:px-10 py-3 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all active:scale-95">Dispatch Audit</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HealthDetails;
