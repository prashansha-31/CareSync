import { Announcement, AnnouncementStatus } from '../types';
import { INITIAL_ANNOUNCEMENTS } from '../data/mockAnnouncements';
import { getStoredData, setStoredData, subscribeToDataKey } from './storageHelper';
import { staffService } from './staffService';

const STORAGE_KEY = 'caresync_gov_announcements';

export const announcementService = {
  async getAnnouncements(): Promise<Announcement[]> {
    return getStoredData<Announcement[]>(STORAGE_KEY, INITIAL_ANNOUNCEMENTS);
  },

  async getAnnouncementById(id: string): Promise<Announcement | undefined> {
    const list = await this.getAnnouncements();
    return list.find((a) => a.id === id);
  },

  async createAnnouncement(
    data: Omit<Announcement, 'id' | 'createdDate'>
  ): Promise<Announcement> {
    const list = await this.getAnnouncements();
    const newId = `ANN-2024-${String(list.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newAnnouncement: Announcement = {
      ...data,
      id: newId,
      createdDate: now,
      publishedDate: data.status === 'Published' ? now : undefined,
    };

    const updatedList = [newAnnouncement, ...list];
    setStoredData(STORAGE_KEY, updatedList);

    if (data.status === 'Published') {
      await staffService.logActivity(
        'ANNOUNCEMENT_PUBLISHED',
        `${newAnnouncement.id} (${newAnnouncement.title.slice(0, 30)}...)`,
        `Public health advisory created and published.`,
        data.author,
        'Government Authority'
      );
    }

    return newAnnouncement;
  },

  async updateAnnouncement(
    id: string,
    updates: Partial<Announcement>
  ): Promise<Announcement> {
    const list = await this.getAnnouncements();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Announcement ${id} not found.`);

    const current = list[index];
    const updated: Announcement = {
      ...current,
      ...updates,
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);
    return updated;
  },

  async setStatus(
    id: string,
    status: AnnouncementStatus,
    actor = 'Dr. Rameshwar Varma (CMO)'
  ): Promise<Announcement> {
    const list = await this.getAnnouncements();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Announcement ${id} not found.`);

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const target = list[index];

    const updated: Announcement = {
      ...target,
      status,
      publishedDate: status === 'Published' ? (target.publishedDate || now) : target.publishedDate,
    };

    list[index] = updated;
    setStoredData(STORAGE_KEY, list);

    if (status === 'Published') {
      await staffService.logActivity(
        'ANNOUNCEMENT_PUBLISHED',
        `${updated.id} (${updated.title.slice(0, 30)}...)`,
        `Advisory moved from Draft to Published status.`,
        actor,
        'Chief Medical Officer'
      );
    } else if (status === 'Archived') {
      await staffService.logActivity(
        'ANNOUNCEMENT_ARCHIVED',
        `${updated.id} (${updated.title.slice(0, 30)}...)`,
        `Advisory decommissioned and moved to official archives.`,
        actor,
        'Chief Medical Officer'
      );
    }

    return updated;
  },

  async resetData(): Promise<void> {
    setStoredData(STORAGE_KEY, INITIAL_ANNOUNCEMENTS);
  },

  subscribe(callback: (announcements: Announcement[]) => void): () => void {
    return subscribeToDataKey(STORAGE_KEY, callback);
  },
};
