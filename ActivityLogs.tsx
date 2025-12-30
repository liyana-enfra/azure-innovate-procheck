
import React, { useMemo, useState } from 'react';
import { LogEntry } from '../types';

interface Props {
  logs: LogEntry[];
}

const ActivityLogs: React.FC<Props> = ({ logs }) => {
  const [filter, setFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    if (filter === 'All') return logs;
    return logs.filter(l => l.severity === filter || l.type === filter);
  }, [logs, filter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Operations Audit Trail</h2>
          <p className="text-slate-500 font-bold text-sm">Immutable tracking for all platform activities.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Info', 'Warning', 'Error', 'Security'].map(btn => (
            <button 
              key={btn} 
              onClick={() => setFilter(btn)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === btn ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="relative">
          {/* Vertical line for the timeline */}
          <div className="absolute left-6 md:left-10 top-0 bottom-0 w-0.5 bg-slate-100"></div>

          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative pl-14 md:pl-24 pr-4 md:pr-8 py-6 md:py-8 hover:bg-slate-50/50 transition-all group">
                {/* Timeline Dot */}
                <div className={`absolute left-[19px] md:left-[34px] top-1/2 -translate-y-1/2 w-3 md:w-3.5 h-3 md:h-3.5 rounded-full ring-4 ring-white z-10 ${
                  log.severity === 'Error' ? 'bg-rose-500' : 
                  log.severity === 'Warning' ? 'bg-amber-500' : 'bg-indigo-500'
                }`}></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${
                        log.type === 'Security' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        log.type === 'Audit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {log.type}
                      </span>
                      <p className="text-xs font-black text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-slate-800 font-bold leading-relaxed break-words">{log.message}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tight">Initiated by: {log.user}</p>
                  </div>
                  
                  <div className="md:text-right shrink-0">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-bold italic">
                No logs found for the selected filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
