
import React, { useMemo, useState } from 'react';
import { Tenant, HealthStatus, ResourceIssue } from '../types';

interface Props {
  tenants: Tenant[];
}

const InventoryView: React.FC<Props> = ({ tenants }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const allResources = useMemo(() => {
    const list: ResourceIssue[] = [];
    tenants.forEach(t => {
      t.checklist.forEach(item => {
        item.affectedResources.forEach(res => {
          list.push({ ...res, tenantName: t.name });
        });
      });
    });
    return list;
  }, [tenants]);

  const filteredResources = useMemo(() => {
    return allResources.filter(res => {
      const matchesSearch = res.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.tenantName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || res.resourceType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allResources, searchQuery, typeFilter]);

  const resourceTypes = useMemo(() => {
    const types = new Set<string>();
    allResources.forEach(r => types.add(r.resourceType));
    return ['All', ...Array.from(types)];
  }, [allResources]);

  const stats = useMemo(() => {
    const healthy = allResources.filter(r => r.status === HealthStatus.HEALTHY).length;
    const active = allResources.filter(r => r.state === 'Active').length;
    const total = allResources.length;
    return {
      healthyPct: total ? Math.round((healthy / total) * 100) : 0,
      activePct: total ? Math.round((active / total) * 100) : 0,
      total,
      unhealthy: total - healthy
    };
  }, [allResources]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness Chart 1 */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-emerald-500 transition-all duration-1000" strokeDasharray={`${stats.healthyPct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-slate-800">{stats.healthyPct}%</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resource Health</h4>
            <p className="text-2xl font-black text-slate-900">{stats.total} Total</p>
            <p className="text-xs font-bold text-emerald-600 uppercase">Audit Ready</p>
          </div>
        </div>

        {/* Readiness Chart 2 */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-indigo-500 transition-all duration-1000" strokeDasharray={`${stats.activePct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-slate-800">{stats.activePct}%</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Power State</h4>
            <p className="text-2xl font-black text-slate-900">Live Compute</p>
            <p className="text-xs font-bold text-indigo-600 uppercase">Active Running</p>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Readiness Flaws</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-300">Unhealthy Resources</span>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs font-black">{stats.unhealthy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-300">Maintenance Mode</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-black">2</span>
              </div>
            </div>
        </div>
      </div>

      {/* Resource Readiness Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <h3 className="text-xl font-black text-slate-900">Global Resource Readiness Matrix</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search assets or tenants..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700"
            >
              {resourceTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-8 py-5">Resource Name</th>
                <th className="px-8 py-5">Provider/Type</th>
                <th className="px-8 py-5">Tenant Context</th>
                <th className="px-8 py-5 text-center">Power State</th>
                <th className="px-8 py-5 text-right">Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredResources.map((res, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-5 font-bold text-slate-800">{res.resourceName}</td>
                  <td className="px-8 py-5 text-xs text-slate-500 uppercase tracking-tight">{res.resourceType}</td>
                  <td className="px-8 py-5 text-sm text-indigo-600 font-black">{res.tenantName}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${res.state === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${res.state === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {res.state}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase border ${res.status === HealthStatus.HEALTHY ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredResources.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold italic">
            No resources match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryView;
