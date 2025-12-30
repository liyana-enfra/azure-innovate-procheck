
import React from 'react';
import { UserRole } from '../types';

const AdminSettings: React.FC = () => {
  const users = [
    { name: 'Sarah Architect', email: 'sarah@msp.com', role: 'Admin' as UserRole, tenants: 'All' },
    { name: 'Mike Engineer', email: 'mike@msp.com', role: 'Contributor' as UserRole, tenants: '6 Tenants' },
    { name: 'Client Auditor', email: 'audit@customer.com', role: 'Reader' as UserRole, tenants: 'Acme Corp' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
               User Management & RBAC
            </h2>
            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Access Scope</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${user.role === 'Admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{user.tenants}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 font-bold text-xs hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-6 text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Invite New User
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Platform Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Automatic Secret Rotation</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative flex items-center px-1"><div className="w-3.5 h-3.5 bg-white rounded-full ml-auto"></div></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">IP Whitelisting (MSP Office)</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative flex items-center px-1"><div className="w-3.5 h-3.5 bg-white rounded-full ml-auto"></div></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Strict Read-Only Enforcement</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative flex items-center px-1"><div className="w-3.5 h-3.5 bg-white rounded-full ml-auto"></div></div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800 text-[10px] text-slate-500 italic">
              Changes to security settings require multi-admin approval.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
