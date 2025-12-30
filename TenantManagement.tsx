
import React, { useState } from 'react';
import { Tenant } from '../types';

interface Props {
  tenants: Tenant[];
  onAdd: (t: Partial<Tenant>) => void;
  onDelete: (id: string) => void;
}

const TenantManagement: React.FC<Props> = ({ tenants, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', subId: '', tId: '', cId: '' });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Tenant Portfolio</h2>
          <p className="text-sm text-slate-500">Manage customer Azure subscriptions and read-only credentials.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add New Tenant
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subscription ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Onboarding</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-800">{t.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{t.location}</p>
                </td>
                <td className="px-6 py-5 font-mono text-sm text-slate-600">{t.subscriptionId}</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${t.onboardingStatus === 'Complete' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {t.onboardingStatus}
                  </span>
                </td>
                <td className="px-6 py-5 text-right space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 font-bold text-sm">Edit</button>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-rose-600 hover:text-rose-800 font-bold text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black">Onboard New Tenant</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-4">
              <input className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Tenant Name (e.g. Acme Corp)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Subscription ID" value={formData.subId} onChange={e => setFormData({...formData, subId: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Client ID (SPN)" value={formData.cId} onChange={e => setFormData({...formData, cId: e.target.value})} />
                <input className="w-full px-4 py-3 bg-slate-50 border rounded-xl" type="password" placeholder="Client Secret" />
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-[11px] text-blue-700 leading-relaxed border border-blue-100">
                <strong>Read-Only Enforcement:</strong> By submitting, you certify that the provided SPN has only the "Reader" role assigned. Sentinel will validate permissions before active scanning.
              </div>
              <button 
                onClick={() => { onAdd({ ...formData, onboardingStatus: 'Pending', id: Math.random().toString() } as any); setIsAdding(false); }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg mt-4"
              >
                Validate & Register Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
