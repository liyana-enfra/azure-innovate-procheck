
import React from 'react';
import { Tenant, HealthStatus } from '../types';

interface TenantCardProps {
  tenant: Tenant;
  onClick: (tenant: Tenant) => void;
  isScanning: boolean;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant, onClick, isScanning }) => {
  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case HealthStatus.WARNING: return 'bg-amber-50 text-amber-700 border-amber-200';
      case HealthStatus.CRITICAL: return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIndicatorColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return 'bg-emerald-500';
      case HealthStatus.WARNING: return 'bg-amber-500';
      case HealthStatus.CRITICAL: return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div 
      onClick={() => onClick(tenant)}
      className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${getIndicatorColor(tenant.status)}`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{tenant.name}</h3>
          <p className="text-xs text-slate-400 font-mono mt-1">{tenant.subscriptionId}</p>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(tenant.status)}`}>
          {tenant.status}
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Location</span>
          <span className="font-medium">{tenant.location}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Last Checked</span>
          <span className="font-medium">{new Date(tenant.lastScan).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
        <span className="text-xs text-blue-600 font-semibold group-hover:underline">View Checklist</span>
        {isScanning && (
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantCard;
