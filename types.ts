
export enum HealthStatus {
  HEALTHY = 'Healthy',
  WARNING = 'Warning',
  CRITICAL = 'Critical',
  UNKNOWN = 'Unknown',
  NA = 'N/A',
  DISABLED = 'Disabled by Policy'
}

export type UserRole = 'Admin' | 'Engineer' | 'Reader';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
  ipAddress?: string;
}

export interface Engineer extends User {
  status: 'online' | 'offline';
  currentTask: string;
  assignedTenants: string[];
  shiftStart?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'System' | 'Audit' | 'Security' | 'Tenant';
  severity: 'Info' | 'Warning' | 'Error';
  user: string;
  message: string;
  targetId?: string; // ID of tenant or resource
  tenantId?: string;
  tenantName?: string;
  metadata?: any;
}

export interface ThresholdSettings {
  cpu: { warning: number; critical: number };
  mem: { warning: number; critical: number };
  disk: { warning: number; critical: number };
}

export interface MetricReading {
  timestamp: string;
  value: number;
  status: 'Active' | 'Idle' | 'Maintenance';
}

export interface MetricValue {
  name: string;
  value: number;
  threshold: number;
  unit: string;
  status: HealthStatus;
  history: MetricReading[]; 
}

export interface ResourceIssue {
  resourceName: string;
  resourceType: string;
  status: HealthStatus;
  state: 'Active' | 'Idle';
  message: string;
  errorCode?: string;
  cause?: string;
  resolution?: string;
  tenantName?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'Compute' | 'Storage' | 'Network' | 'Protection' | 'Governance';
  status: HealthStatus;
  lastChecked: string;
  summary: string;
  checksPerformed: string[];
  affectedResources: ResourceIssue[];
  errorCode?: string;
  cause?: string;
  recommendation?: string;
  resolution?: string;
  metric?: MetricValue;
  isApplicable: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  subscriptionId: string;
  clientId?: string;
  tenantId?: string;
  location: string;
  status: HealthStatus;
  lastScan: string;
  checklist: ChecklistItem[];
  onboardingStatus: 'Pending' | 'Complete' | 'Missing Prerequisites';
  engineerNotes?: string;
}

export interface DashboardStats {
  totalTenants: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  activeResources: number;
  idleResources: number;
}
