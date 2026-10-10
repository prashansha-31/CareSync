import { StaffMember, ActivityLog } from '../types';
import { INITIAL_STAFF_MEMBERS } from '../data/mockStaff';
import { INITIAL_ACTIVITY_LOGS } from '../data/mockActivityLogs';
import { getStoredData, setStoredData, subscribeToDataKey } from './storageHelper';

const STAFF_KEY = 'caresync_gov_staff';
const LOGS_KEY = 'caresync_gov_activity_logs';

export const staffService = {
  async getStaffMembers(): Promise<StaffMember[]> {
    return getStoredData<StaffMember[]>(STAFF_KEY, INITIAL_STAFF_MEMBERS);
  },

  async addStaffMember(data: Omit<StaffMember, 'id' | 'joinedDate'>): Promise<StaffMember> {
    const list = await this.getStaffMembers();
    const newStaff: StaffMember = {
      ...data,
      id: `STF-${String(list.length + 1).padStart(3, '0')}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    const updated = [...list, newStaff];
    setStoredData(STAFF_KEY, updated);
    return newStaff;
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    return getStoredData<ActivityLog[]>(LOGS_KEY, INITIAL_ACTIVITY_LOGS);
  },

  async logActivity(
    actionType: ActivityLog['actionType'],
    relatedRecord: string,
    details: string,
    actor = 'Administrative Officer',
    actorRole = 'Admin'
  ): Promise<ActivityLog> {
    const logs = await this.getActivityLogs();
    const newLog: ActivityLog = {
      id: `LOG-2024-${Date.now().toString().slice(-4)}`,
      actionType,
      actor,
      actorRole,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' IST',
      relatedRecord,
      details,
      ipAddress: '10.14.80.22 (GovNet Secure Node)',
    };

    const updated = [newLog, ...logs];
    setStoredData(LOGS_KEY, updated);
    return newLog;
  },

  subscribeLogs(callback: (logs: ActivityLog[]) => void): () => void {
    return subscribeToDataKey(LOGS_KEY, callback);
  },

  subscribeStaff(callback: (staff: StaffMember[]) => void): () => void {
    return subscribeToDataKey(STAFF_KEY, callback);
  },
};
