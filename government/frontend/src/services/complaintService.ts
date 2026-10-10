import { Complaint, ComplaintStatus } from '../types';
import { INITIAL_COMPLAINTS } from '../data/mockComplaints';
import { getStoredData, setStoredData, subscribeToDataKey } from './storageHelper';
import { staffService } from './staffService';

const STORAGE_KEY = 'caresync_gov_complaints';

export const complaintService = {
  async getComplaints(): Promise<Complaint[]> {
    return getStoredData<Complaint[]>(STORAGE_KEY, INITIAL_COMPLAINTS);
  },

  async getComplaintById(id: string): Promise<Complaint | undefined> {
    const list = await this.getComplaints();
    return list.find((c) => c.id === id);
  },

  async createComplaint(data: Omit<Complaint, 'id' | 'submittedDate' | 'history'>): Promise<Complaint> {
    const list = await this.getComplaints();
    const newId = `CMP-${new Date().getFullYear()}-${String(list.length + 1).padStart(5, '0')}`;
    const now = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newComplaint: Complaint = {
      ...data,
      id: newId,
      submittedDate: now,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: now,
          action: 'Complaint Registered',
          actor: 'Citizen / Ombudsman Desk',
        },
      ],
    };
    const updated = [newComplaint, ...list];
    setStoredData(STORAGE_KEY, updated);
    return newComplaint;
  },

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    notes?: string,
    actorName = 'Dr. Ananya Sen (Regulator)'
  ): Promise<Complaint> {
    const list = await this.getComplaints();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Complaint ${id} not found.`);

    const now = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const target = list[index];
    const newHistoryItem = {
      id: `h-${Date.now()}`,
      timestamp: now,
      action: `Status updated to ${status}`,
      actor: actorName,
      notes: notes || undefined,
    };

    const updated: Complaint = {
      ...target,
      status,
      resolutionNotes: notes || target.resolutionNotes,
      resolvedDate: status === 'Resolved' ? now : target.resolvedDate,
      history: [...target.history, newHistoryItem],
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    await staffService.logActivity(
      'COMPLAINT_STATUS_UPDATED',
      `${updated.id} (${updated.hospitalName})`,
      `Complaint status changed to ${status}. Notes: ${notes || 'No extra notes provided.'}`,
      actorName,
      'Senior Healthcare Regulator'
    );

    return updated;
  },

  async assignToStaff(
    id: string,
    staffName: string,
    actorName = 'Meenakshi Sundaram (Grievance Officer)'
  ): Promise<Complaint> {
    const list = await this.getComplaints();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Complaint ${id} not found.`);

    const now = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const target = list[index];
    const newHistoryItem = {
      id: `h-${Date.now()}`,
      timestamp: now,
      action: `Assigned case to ${staffName}`,
      actor: actorName,
    };

    const updated: Complaint = {
      ...target,
      assignedTo: staffName,
      status: target.status === 'Open' ? 'In Progress' : target.status,
      history: [...target.history, newHistoryItem],
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    await staffService.logActivity(
      'COMPLAINT_ASSIGNED',
      `${updated.id} (${updated.hospitalName})`,
      `Investigation reassigned to ${staffName}.`,
      actorName,
      'Grievance Redressal Officer'
    );

    return updated;
  },

  async addResolutionNotes(
    id: string,
    notes: string,
    _actorName = 'Dr. Rameshwar Varma (CMO)'
  ): Promise<Complaint> {
    const list = await this.getComplaints();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Complaint ${id} not found.`);

    const target = list[index];
    const updated: Complaint = {
      ...target,
      resolutionNotes: notes,
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);
    return updated;
  },

  async resetData(): Promise<void> {
    setStoredData(STORAGE_KEY, INITIAL_COMPLAINTS);
  },

  subscribe(callback: (complaints: Complaint[]) => void): () => void {
    return subscribeToDataKey(STORAGE_KEY, callback);
  },
};
