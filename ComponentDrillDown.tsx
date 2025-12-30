
import React from 'react';
import { ChecklistItem, HealthStatus } from '../types';

interface Props {
  item: ChecklistItem;
  onBack: () => void;
}

const ComponentDrillDown: React.FC<Props> = ({ item, onBack }) => {
  const getStatusColor = (status: HealthStatus | string) => {
    switch (status) {
      case HealthStatus.HEALTHY: case 'Active': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case HealthStatus.WARNING: case 'Maintenance': return 'text-amber-500 bg-amber-50 border-amber-100';
      case HealthStatus.CRITICAL: return 'text-rose-500 bg-rose-50 border-rose-100';
      case 'Idle': return 'text-slate-400 bg-slate-50 border-slate-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <button onClick={onBack} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h3 className="text-2xl font-black text-slate-900">{item.label}</h3>
          <p className="text-sm text-slate-500 font-medium">Diagnostic Report & Remediation Path</p>
        </div>
        <div className={`ml-auto px-6 py-2 rounded-2xl border text-xs font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
          {item.status}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 pb-12 space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
              <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Executive Summary</h4>
              <p className="text-slate-700 leading-relaxed font-semibold text-lg">{item.summary}</p>
              
              {item.status !== HealthStatus.HEALTHY && (
                <div className="mt-8 grid md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Root Cause Analysis</h5>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.cause || 'No root cause identified.'}</p>
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Remediation Steps</h5>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.resolution || 'Investigation required by L2 Support.'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Table Reading */}
            {item.metric && (
              <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Historical Telemetry Metrics</h4>
                <div className="overflow-hidden border border-slate-100 rounded-[2rem]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Observation Window</th>
                        <th className="px-8 py-5">Metric Reading</th>
                        <th className="px-8 py-5">System State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {item.metric.history.map((reading, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-4 text-slate-500">{new Date(reading.timestamp).toLocaleString()}</td>
                          <td className="px-8 py-4 font-bold text-slate-800">{reading.value.toFixed(2)}{item.metric?.unit}</td>
                          <td className="px-8 py-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusColor(reading.status)}`}>
                              {reading.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
               <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-8">Technical Diagnostics</h4>
               <div className="space-y-6 relative z-10">
                 <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Error Correlation ID</p>
                   <p className="font-mono text-blue-300 font-black text-lg">{item.errorCode || 'OK-000'}</p>
                 </div>
                 <div className="space-y-2">
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Actions Logged</p>
                   {item.checksPerformed.map((check, i) => (
                     <div key={i} className="flex gap-3 text-xs text-slate-300 items-start">
                       <span className="text-emerald-400">✓</span>
                       <span>{check}</span>
                     </div>
                   ))}
                 </div>
               </div>
               <button className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                 Dispatch Remediation Ticket
               </button>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Inventory State</h4>
              <div className="space-y-4">
                {item.affectedResources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${res.state === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'} ${res.state === 'Active' ? 'animate-pulse' : ''}`}></div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{res.resourceName}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase">{res.resourceType} • {res.state}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDrillDown;
