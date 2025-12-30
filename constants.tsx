
import { HealthStatus, Tenant } from './types';

export const ERROR_TAXONOMY = {
  COMPUTE: {
    HIGH_CPU: { 
      code: 'CMP-101', 
      msg: 'CPU Threshold Breach', 
      cause: 'Sustained high load on application pool or background processing jobs.',
      res: 'Vertical scaling (increase SKU) or Horizontal scaling (add instances). Check for memory leaks.' 
    },
    HIGH_MEM: { 
      code: 'CMP-102', 
      msg: 'Memory Exhaustion', 
      cause: 'Application leak or insufficient allocation for workload peak.',
      res: 'Enable memory paging, restart services, or upgrade to a High-Memory VM SKU.' 
    },
  },
  STORAGE: {
    LOW_DISK: { 
      code: 'STG-201', 
      msg: 'Disk Capacity Warning', 
      cause: 'Log file accumulation or unplanned data growth in /temp directories.',
      res: 'Cleanup transaction logs, expand managed disk size, or implement auto-grow policies.' 
    },
  },
  NETWORK: {
    VPN_DOWN: { 
      code: 'NET-301', 
      msg: 'VPN Gateway Unavailable', 
      cause: 'IKE Phase 1/2 mismatch or peer gateway is unreachable.',
      res: 'Verify Local Network Gateway IP and Shared Key. Reset Gateway in Azure Portal if stuck.' 
    },
    FW_HEALTH: { 
      code: 'NET-302', 
      msg: 'Firewall Resource Error', 
      cause: 'Failed health probe on internal backend listener.',
      res: 'Check Application Gateway health probes and backend pools.' 
    },
  },
  GOVERNANCE: {
    COST_SPIKE: { 
      code: 'GOV-401', 
      msg: 'Daily Cost Spike Detected', 
      cause: 'Unexpected scale-out event or new resource deployment (e.g. Cognitive Services).',
      res: 'Review Activity Logs for "Write" operations by users and set up budget alerts.' 
    },
    RES_UNHEALTHY: { 
      code: 'GOV-402', 
      msg: 'Resource Health Event', 
      cause: 'Azure Platform hardware failure or planned maintenance.',
      res: 'None (Platform Managed). Monitor for "Resolved" status or failover to secondary region.' 
    }
  }
};

// Start with an empty array for production-ready fresh onboarding.
export const MOCK_TENANTS: Tenant[] = [];

export const SOP_REQUIREMENTS = [
  { id: 'cpu', label: 'CPU Utilization < 80%', category: 'Compute' },
  { id: 'mem', label: 'Memory Utilization < 80%', category: 'Compute' },
  { id: 'disk', label: 'Disk Free Space > 20%', category: 'Storage' },
  { id: 'alerts', label: 'Alerts (Last 24h)', category: 'Network' },
  { id: 'backup', label: 'Backup Success', category: 'Protection' },
  { id: 'vpn', label: 'VPN Availability', category: 'Network' },
  { id: 'cost', label: 'Daily Cost Trend', category: 'Governance' },
  { id: 'reshealth', label: 'Azure Resource Health', category: 'Governance' },
];

export const SCORING_THRESHOLDS = {
  cpu: { warning: 75, critical: 90 },
  mem: { warning: 80, critical: 92 },
  disk: { warning: 15, critical: 5 },
};
