import { Hospital, HospitalStatus } from '../types';
import { INITIAL_HOSPITALS } from '../data/mockHospitals';
import { getStoredData, setStoredData, subscribeToDataKey } from './storageHelper';
import { staffService } from './staffService';

const STORAGE_KEY = 'caresync_gov_hospitals';

export const hospitalService = {
  async getHospitals(): Promise<Hospital[]> {
    return getStoredData<Hospital[]>(STORAGE_KEY, INITIAL_HOSPITALS);
  },

  async getHospitalById(id: string): Promise<Hospital | undefined> {
    const list = await this.getHospitals();
    return list.find((h) => h.id === id);
  },

  async registerHospital(
    data: Omit<Hospital, 'id' | 'appliedDate' | 'status' | 'documents'> & {
      status?: HospitalStatus;
      documents?: Hospital['documents'];
    }
  ): Promise<Hospital> {
    const list = await this.getHospitals();
    const newId = `HSP-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`;
    const newHospital: Hospital = {
      ...data,
      id: newId,
      status: data.status || 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      documents: data.documents || [
        { name: 'Fire Safety NOC.pdf', type: 'PDF', size: '1.8 MB', verified: true },
        { name: 'Clinical Establishments Registration.pdf', type: 'PDF', size: '2.1 MB', verified: true },
      ],
    };
    const updated = [newHospital, ...list];
    setStoredData(STORAGE_KEY, updated);
    return newHospital;
  },

  async approveHospital(id: string, reviewerName = 'Dr. Rameshwar Varma (CMO)'): Promise<Hospital> {
    const list = await this.getHospitals();
    const index = list.findIndex((h) => h.id === id);
    if (index === -1) throw new Error(`Hospital with ID ${id} not found.`);

    const today = new Date().toISOString().split('T')[0];
    const updated: Hospital = {
      ...list[index],
      status: 'Approved',
      reviewedDate: today,
      reviewedBy: reviewerName,
      rejectionReason: undefined,
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    // Audit log
    await staffService.logActivity(
      'HOSPITAL_APPROVED',
      `${updated.id} (${updated.name})`,
      `Approved license registration under Clinical Standards mandate.`,
      reviewerName,
      'Chief Medical Officer'
    );

    return updated;
  },

  async rejectHospital(id: string, reason: string, reviewerName = 'Dr. Rameshwar Varma (CMO)'): Promise<Hospital> {
    const list = await this.getHospitals();
    const index = list.findIndex((h) => h.id === id);
    if (index === -1) throw new Error(`Hospital with ID ${id} not found.`);

    const today = new Date().toISOString().split('T')[0];
    const updated: Hospital = {
      ...list[index],
      status: 'Rejected',
      reviewedDate: today,
      reviewedBy: reviewerName,
      rejectionReason: reason,
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    // Audit log
    await staffService.logActivity(
      'HOSPITAL_REJECTED',
      `${updated.id} (${updated.name})`,
      `Application rejected. Reason: ${reason}`,
      reviewerName,
      'Chief Medical Officer'
    );

    return updated;
  },

  async suspendHospital(id: string, reason: string, reviewerName = 'Dr. Vikram Malhotra (Inspector)'): Promise<Hospital> {
    const list = await this.getHospitals();
    const index = list.findIndex((h) => h.id === id);
    if (index === -1) throw new Error(`Hospital with ID ${id} not found.`);

    const today = new Date().toISOString().split('T')[0];
    const updated: Hospital = {
      ...list[index],
      status: 'Suspended',
      reviewedDate: today,
      reviewedBy: reviewerName,
      suspensionReason: reason,
      availableBeds: 0,
      availableIcuBeds: 0,
      availableVentilators: 0,
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    // Audit log
    await staffService.logActivity(
      'HOSPITAL_SUSPENDED',
      `${updated.id} (${updated.name})`,
      `Hospital license suspended. Order: ${reason}`,
      reviewerName,
      'District Health Inspector'
    );

    return updated;
  },

  async updateHospitalStatus(id: string, status: HospitalStatus, reason?: string): Promise<Hospital> {
    if (status === 'Approved') return this.approveHospital(id);
    if (status === 'Rejected') return this.rejectHospital(id, reason || 'Non-compliance with required parameters');
    if (status === 'Suspended') return this.suspendHospital(id, reason || 'Administrative sanction enforced');

    const list = await this.getHospitals();
    const index = list.findIndex((h) => h.id === id);
    if (index === -1) throw new Error(`Hospital with ID ${id} not found.`);

    list[index] = { ...list[index], status: 'Pending' };
    setStoredData(STORAGE_KEY, list);
    return list[index];
  },

  async resetData(): Promise<void> {
    setStoredData(STORAGE_KEY, INITIAL_HOSPITALS);
  },

  subscribe(callback: (hospitals: Hospital[]) => void): () => void {
    return subscribeToDataKey(STORAGE_KEY, callback);
  },
};
