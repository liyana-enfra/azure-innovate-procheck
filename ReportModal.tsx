
import React, { useState, useEffect } from 'react';
import { Tenant, HealthStatus } from '../types';

interface Props {
  tenants: Tenant[];
  onClose: () => void;
}

const ReportModal: React.FC<Props> = ({ tenants, onClose }) => {
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>(tenants.map(t => t.id));
  const [subject, setSubject] = useState(`[ACTION REQUIRED] Azure Operations Summary - ${new Date().toLocaleDateString()}`);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedTenants = tenants.filter(t => selectedTenantIds.includes(t.id));

  useEffect(() => {
    if (selectedTenants.length === 0) {
      setMessage("Please select at least one tenant to generate a report.");
      return;
    }

    const criticalCount = selectedTenants.filter(t => t.status === HealthStatus.CRITICAL).length;
    const warningCount = selectedTenants.filter(t => t.status === HealthStatus.WARNING).length;
    
    let insightDraft = `Dear Operational Stakeholders,\n\nOur ProCheck platform has concluded today's automated health check across ${selectedTenants.length} environment(s).\n\n`;
    insightDraft += `STATUS OVERVIEW:\n`;
    insightDraft += `• Healthy Environments: ${selectedTenants.filter(t => t.status === HealthStatus.HEALTHY).length}\n`;
    insightDraft += `• Critical Actions: ${criticalCount}\n`;
    insightDraft += `• Active Warnings: ${warningCount}\n\n`;
    
    insightDraft += `PARTICIPATING TENANTS:\n`;
    selectedTenants.forEach(t => {
      insightDraft += `• ${t.name} (${t.status})\n`;
    });
    
    insightDraft += `\nKEY INSIGHTS FOR YOUR TEAM:\n`;
    if (criticalCount > 0) {
      insightDraft += `⚠️ IMMEDIATE ACTION: We have identified critical threshold breaches in ${criticalCount} subscription(s). Our engineers are prioritizing remediation.\n`;
    } else {
      insightDraft += `✅ STABLE: All core production resources in the selected batch are operating within agreed-upon performance baselines.\n`;
    }
    
    insightDraft += `\nATTACHED REPORTS:\n- Daily_Health_Audit_Batch.xlsx (Consolidated Data)\n- Executive_Strategic_Summary.pdf\n\nSincerely,\nMSP Cloud Operations ProCheck`;
    
    setMessage(insightDraft);
  }, [selectedTenantIds, tenants]);

  const handleSend = () => {
    if (selectedTenantIds.length === 0) return;
    setIsSending(true);
    setTimeout(() => {
      alert(`Reports successfully dispatched for ${selectedTenantIds.length} tenants.`);
      onClose();
    }, 2000);
  };

  const toggleTenant = (id: string) => {
    setSelectedTenantIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-6xl shadow-2xl overflow-hidden animate-in zoom-in-95 h-[90vh] flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="text-2xl font-black">Multi-Tenant Dispatcher</h2>
            <p className="text-sm text-slate-500 font-medium">Engine: Operational Reporting v4.0</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Tenant Selection Sidebar */}
          <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-100 overflow-y-auto p-6 space-y-4">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Select Target Tenants</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedTenantIds(tenants.map(t => t.id))}
                className="w-full py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg"
              >
                Select All
              </button>
              {tenants.map(t => (
                <label key={t.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-all">
                  <input 
                    type="checkbox" 
                    checked={selectedTenantIds.includes(t.id)} 
                    onChange={() => toggleTenant(t.id)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{t.name}</p>
                    <p className={`text-[9px] font-black uppercase ${t.status === HealthStatus.HEALTHY ? 'text-emerald-500' : 'text-rose-500'}`}>{t.status}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Main Draft Area */}
          <div className="flex-1 overflow-y-auto p-8 grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Email Subject Line</label>
                <input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-1">Interactive Email Body (Draft)</label>
                <textarea 
                  rows={12}
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed font-medium text-slate-700 h-full min-h-[300px]"
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
                <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-6">Dispatch Manifest</h4>
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between">
                    <span>Recipients:</span>
                    <span className="font-bold">{selectedTenantIds.length} Groups</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span className="font-bold text-amber-300">High (Operational)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Analysis:</span>
                    <span className="font-bold text-emerald-300">Included</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attachments (Batch Compiled)</h4>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4 group hover:border-emerald-200 transition-all cursor-pointer">
                   <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black">XLS</div>
                   <div className="flex-1">
                     <p className="text-xs font-black text-slate-800">Batch_Health_Audit.xlsx</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">Ready • Consolidated Inventory</p>
                   </div>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 shrink-0">
           <button onClick={onClose} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-sm">Cancel</button>
           <button 
            onClick={handleSend}
            disabled={isSending || selectedTenantIds.length === 0}
            className={`px-12 py-4 text-white rounded-2xl font-black shadow-2xl transition-all active:scale-95 flex items-center gap-3 ${selectedTenantIds.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 shadow-indigo-600/30 hover:bg-indigo-700'}`}
           >
             {isSending ? (
               <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Dispatched...</>
             ) : (
               'Dispatch Multi-Tenant Audit'
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
