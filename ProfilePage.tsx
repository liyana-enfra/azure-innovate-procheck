
import React from 'react';
import { User } from '../types';

interface Props {
  user: User;
}

const ProfilePage: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-indigo-600 to-indigo-900 relative">
          <div className="absolute -bottom-16 left-12">
            <img src={user.avatar || `https://picsum.photos/120/120?random=10`} className="w-32 h-32 rounded-[2rem] border-8 border-white shadow-xl" alt="Profile" />
          </div>
        </div>
        
        <div className="pt-20 p-12 space-y-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900">{user.name}</h2>
            <p className="text-lg text-slate-500 font-medium">{user.email}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Role Authorization</h3>
              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                  {user.role}
                </div>
                <p className="text-xs text-slate-500 font-bold">System Global Control Enabled</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Security Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Active Session Verified</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
             <h3 className="text-xl font-black text-slate-800">Assigned Responsibilities</h3>
             <div className="flex flex-wrap gap-2">
               {['Acme Corp', 'Global Logistics', 'Fintech', 'HealthTech'].map(tenant => (
                 <span key={tenant} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                   {tenant}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
