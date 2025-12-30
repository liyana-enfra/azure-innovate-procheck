
// This file acts as the CORE DATABASE interface. 
// In production, the "get" and "save" methods should be replaced with fetch() calls to your Azure Functions API.

import { Tenant, User, LogEntry, ThresholdSettings, Engineer } from '../types';

const IS_PROD = false; // Toggle this to true when your Azure Functions are deployed
const API_BASE = '/api';

const DB_KEYS = {
  TENANTS: 'sentinel_v4_tenants',     
  LOGS: 'sentinel_v4_logs',           
  USER: 'sentinel_v4_session',        
  SETTINGS: 'sentinel_v4_settings',   
  ENGINEERS: 'sentinel_v4_engineers',
  GUIDE_SEEN: 'sentinel_v4_guide_seen',
  TUTORIALS_SEEN: 'sentinel_v4_tutorials_seen' 
};

export const db = {
  getTenants: async (): Promise<Tenant[]> => {
    if (IS_PROD) {
      const res = await fetch(`${API_BASE}/tenants`);
      return res.json();
    }
    return JSON.parse(localStorage.getItem(DB_KEYS.TENANTS) || '[]');
  },

  saveTenants: async (tenants: Tenant[]) => {
    if (IS_PROD) {
      await fetch(`${API_BASE}/tenants`, { method: 'POST', body: JSON.stringify(tenants) });
    }
    localStorage.setItem(DB_KEYS.TENANTS, JSON.stringify(tenants));
  },

  getEngineers: (): Engineer[] => JSON.parse(localStorage.getItem(DB_KEYS.ENGINEERS) || '[]'),
  saveEngineers: (engineers: Engineer[]) => localStorage.setItem(DB_KEYS.ENGINEERS, JSON.stringify(engineers)),

  getLogs: (): LogEntry[] => JSON.parse(localStorage.getItem(DB_KEYS.LOGS) || '[]'),
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const logs = db.getLogs();
    const newLog: LogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify(logs.slice(0, 1000)));
    return newLog;
  },

  getSettings: (): ThresholdSettings | null => JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || 'null'),
  saveSettings: (settings: ThresholdSettings) => localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings)),

  getSession: (): User | null => JSON.parse(localStorage.getItem(DB_KEYS.USER) || 'null'),
  setSession: (user: User | null) => localStorage.setItem(DB_KEYS.USER, JSON.stringify(user)),

  getGuideStatus: (): boolean => localStorage.getItem(DB_KEYS.GUIDE_SEEN) === 'true',
  setGuideStatus: (seen: boolean) => localStorage.setItem(DB_KEYS.GUIDE_SEEN, seen ? 'true' : 'false'),

  getTutorialsSeen: (): string[] => JSON.parse(localStorage.getItem(DB_KEYS.TUTORIALS_SEEN) || '[]'),
  setTutorialSeen: (page: string) => {
    const seen = db.getTutorialsSeen();
    if (!seen.includes(page)) {
      seen.push(page);
      localStorage.setItem(DB_KEYS.TUTORIALS_SEEN, JSON.stringify(seen));
    }
  }
};
