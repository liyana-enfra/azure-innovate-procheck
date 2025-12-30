
import React from 'react';
import { Engineer, UserRole } from '../types';

interface Props {
  engineers: Engineer[];
  currentUserRole: UserRole;
}

const TeamView: React.FC<Props> = ({ engineers, currentUserRole }) => {
  const isAdmin = currentUserRole === 'Admin';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Engineer Fleet Readiness</h2>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Global Shift Monitoring</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 font-black text-xs uppercase">
             {engineers.filter(e => e.status === 'online').length} Online
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engineers.map((eng) => (
          <div key={eng.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-10 -mt-10 rounded-full group-hover:bg-indigo-50 transition-colors`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <img src={eng.avatar} className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-white shadow-lg" />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${eng.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{eng.name}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{eng.role}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Operation</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700">{eng.currentTask}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned</p>
                    <p className="text-sm font-black text-slate-900">{eng.assignedTenants.length} Tenants</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p className={`text-sm font-black uppercase ${eng.status === 'online' ? 'text-emerald-500' : 'text-slate-400'}`}>{eng.status}</p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-3 animate-in fade-in duration-300">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Admin Metadata</p>
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-400">IP Access:</span>
                      <span className="text-slate-700 font-mono">{eng.ipAddress || 'Not Tracked'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-400">Shift Started:</span>
                      <span className="text-slate-700">{eng.shiftStart ? new Date(eng.shiftStart).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
