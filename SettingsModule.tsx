
import React, { useState } from 'react';
import { ThresholdSettings } from '../types';

interface Props {
  thresholds: ThresholdSettings;
  setThresholds: (t: ThresholdSettings) => void;
}

const SettingsModule: React.FC<Props> = ({ thresholds, setThresholds }) => {
  const [smtpConfig, setSmtpConfig] = useState({
    server: 'smtp.azure.com',
    port: '587',
    sender: 'sentinel-noreply@msp.com',
    username: 'azure-auth-id',
    useTls: true
  });

  const updateThreshold = (key: keyof ThresholdSettings, subkey: 'warning' | 'critical', value: number) => {
    setThresholds({
      ...thresholds,
      [key]: { ...thresholds[key], [subkey]: value }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Health Logic Section */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-200">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zm0-10V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zm12 10v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zm0-10V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
             </div>
             Global Health Logic
          </h3>
          <div className="space-y-10">
            {Object.entries(thresholds).map(([key, val]) => (
              <div key={key} className="space-y-4">
                <div className="flex justify-between items-end">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{key} Utilization Rules</h4>
                  <div className="flex gap-4">
                    <span className="text-[10px] font-bold text-amber-500">Warning: {val.warning}%</span>
                    <span className="text-[10px] font-bold text-rose-500">Critical: {val.critical}%</span>
                  </div>
                </div>
                <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500"><span>Warning Level</span><span>{val.warning}%</span></div>
                    <input 
                      type="range" min="10" max="90" value={val.warning}
                      onChange={(e) => updateThreshold(key as any, 'warning', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-amber-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500"><span>Critical Level</span><span>{val.critical}%</span></div>
                    <input 
                      type="range" min="10" max="99" value={val.critical}
                      onChange={(e) => updateThreshold(key as any, 'critical', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-rose-500" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-[11px] text-emerald-700 leading-relaxed font-bold">
            NOTE: Threshold changes apply immediately to new scans. Historical data remains locked to ensure audit integrity.
          </div>
        </div>

        {/* Email & Policies Section */}
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </div>
               Email Configuration
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SMTP Server</label>
                <input 
                  type="text" value={smtpConfig.server} 
                  onChange={e => setSmtpConfig({...smtpConfig, server: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Port</label>
                <input 
                  type="text" value={smtpConfig.port} 
                  onChange={e => setSmtpConfig({...smtpConfig, port: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700" 
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sender Email</label>
                <input 
                  type="email" value={smtpConfig.sender} 
                  onChange={e => setSmtpConfig({...smtpConfig, sender: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700" 
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SMTP Username</label>
                <input 
                  type="text" value={smtpConfig.username} 
                  onChange={e => setSmtpConfig({...smtpConfig, username: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700" 
                />
              </div>
            </div>
            
            <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95">
              Save SMTP Credentials
            </button>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl text-white">
            <h3 className="text-2xl font-black mb-6">Dispatch Policies</h3>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-bold">Morning Operations Digest</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Schedule: 08:00 Local</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative flex items-center px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div></div>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-bold">Executive PDF Reports</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Trigger: Weekly (Sun)</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative flex items-center px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
