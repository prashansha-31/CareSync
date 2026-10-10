import { DistrictCapacity } from '../types';
import { STANDARD_DISTRICTS } from '../data/mockHealthcareCapacity';
import { hospitalService } from './hospitalService';

export const monitoringService = {
  async getDistrictCapacities(): Promise<DistrictCapacity[]> {
    const hospitals = await hospitalService.getHospitals();
    const approved = hospitals.filter((h) => h.status === 'Approved');

    return STANDARD_DISTRICTS.map((district) => {
      const districtHospitals = approved.filter((h) => h.district === district);
      const totalHospitals = districtHospitals.length;
      const totalBeds = districtHospitals.reduce((acc, h) => acc + h.totalBeds, 0);
      const availableBeds = districtHospitals.reduce((acc, h) => acc + h.availableBeds, 0);
      const occupiedBeds = totalBeds - availableBeds;
      const icuTotal = districtHospitals.reduce((acc, h) => acc + h.icuBeds, 0);
      const icuAvailable = districtHospitals.reduce((acc, h) => acc + h.availableIcuBeds, 0);
      const icuOccupied = icuTotal - icuAvailable;
      const ventilatorTotal = districtHospitals.reduce((acc, h) => acc + h.ventilators, 0);
      const ventilatorAvailable = districtHospitals.reduce((acc, h) => acc + h.availableVentilators, 0);

      const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
      let emergencyStatus: 'Normal' | 'Elevated' | 'High' | 'Critical' = 'Normal';
      if (occupancyRate > 90) emergencyStatus = 'Critical';
      else if (occupancyRate > 80) emergencyStatus = 'High';
      else if (occupancyRate > 65) emergencyStatus = 'Elevated';

      return {
        district,
        totalHospitals,
        totalBeds,
        occupiedBeds,
        availableBeds,
        icuTotal,
        icuOccupied,
        icuAvailable,
        ventilatorTotal,
        ventilatorAvailable,
        emergencyStatus,
        reportedAt: totalHospitals > 0 ? 'Live Telemetry' : 'No Data',
      };
    });
  },

  async getRegistrationTrends() {
    const hospitals = await hospitalService.getHospitals();
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    return months.map((month) => {
      // Return real applications count
      const apps = hospitals.filter((h) => {
        const m = new Date(h.appliedDate).toLocaleString('en-US', { month: 'short' });
        return m === month;
      });
      return {
        month,
        applications: apps.length,
        approved: apps.filter((h) => h.status === 'Approved').length,
        rejected: apps.filter((h) => h.status === 'Rejected').length,
      };
    });
  },

  async getBedCapacityTrends() {
    const capacities = await this.getDistrictCapacities();
    const totalAvail = capacities.reduce((acc, d) => acc + d.availableBeds, 0);
    const icuAvail = capacities.reduce((acc, d) => acc + d.icuAvailable, 0);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      day,
      totalAvailable: totalAvail,
      icuAvailable: icuAvail,
      emergencyCases: 0,
    }));
  },

  subscribe(callback: (data: DistrictCapacity[]) => void): () => void {
    return hospitalService.subscribe(async () => {
      const caps = await monitoringService.getDistrictCapacities();
      callback(caps);
    });
  },
};
