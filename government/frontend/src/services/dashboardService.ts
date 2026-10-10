import { DashboardStats } from '../types';
import { hospitalService } from './hospitalService';
import { complaintService } from './complaintService';
import { announcementService } from './announcementService';

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const hospitals = await hospitalService.getHospitals();
    const complaints = await complaintService.getComplaints();
    const announcements = await announcementService.getAnnouncements();

    const totalRegisteredHospitals = hospitals.filter((h) => h.status === 'Approved').length;
    const hospitalsAwaitingApproval = hospitals.filter((h) => h.status === 'Pending').length;
    
    const approvedHospitals = hospitals.filter((h) => h.status === 'Approved');
    const reportedAvailableBeds = approvedHospitals.reduce((acc, h) => acc + h.availableBeds, 0);
    const totalBedsCapacity = approvedHospitals.reduce((acc, h) => acc + h.totalBeds, 0);

    const openComplaints = complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length;
    const urgentComplaints = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Resolved').length;

    const activeAnnouncements = announcements.filter((a) => a.status === 'Published').length;

    const bedOccupancyRate = totalBedsCapacity > 0
      ? Math.round(((totalBedsCapacity - reportedAvailableBeds) / totalBedsCapacity) * 100)
      : 0;

    return {
      totalRegisteredHospitals,
      hospitalsAwaitingApproval,
      reportedAvailableBeds,
      totalBedsCapacity,
      openComplaints,
      urgentComplaints,
      activeAnnouncements,
      bedOccupancyRate,
    };
  },
};
