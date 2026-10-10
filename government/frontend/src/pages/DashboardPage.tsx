import React, { useState, useEffect } from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { RegistrationChart } from '../components/dashboard/RegistrationChart';
import { StatusBreakdownChart } from '../components/dashboard/StatusBreakdownChart';
import { DistrictOverview } from '../components/dashboard/DistrictOverview';
import { RecentApplicationsTable } from '../components/dashboard/RecentApplicationsTable';
import { RecentComplaintsList } from '../components/dashboard/RecentComplaintsList';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';

import { dashboardService } from '../services/dashboardService';
import { hospitalService } from '../services/hospitalService';
import { complaintService } from '../services/complaintService';
import { monitoringService } from '../services/monitoringService';
import { staffService } from '../services/staffService';

import {
  DashboardStats,
  Hospital,
  Complaint,
  DistrictCapacity,
  ActivityLog,
} from '../types';
import { ShieldCheck, RefreshCw, Building, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [districts, setDistricts] = useState<DistrictCapacity[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const loadAllData = async () => {
    try {
      const [s, h, c, d, l] = await Promise.all([
        dashboardService.getDashboardStats(),
        hospitalService.getHospitals(),
        complaintService.getComplaints(),
        monitoringService.getDistrictCapacities(),
        staffService.getActivityLogs(),
      ]);
      setStats(s);
      setHospitals(h);
      setComplaints(c);
      setDistricts(d);
      setLogs(l);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();

    const unsubHospitals = hospitalService.subscribe(() => {
      loadAllData();
    });
    const unsubComplaints = complaintService.subscribe(() => {
      loadAllData();
    });
    const unsubLogs = staffService.subscribeLogs((updatedLogs) => {
      setLogs(updatedLogs);
    });

    return () => {
      unsubHospitals();
      unsubComplaints();
      unsubLogs();
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="empty-state" style={{ minHeight: 400 }}>
        <RefreshCw className="pulse-dot" style={{ width: 28, height: 28, color: 'var(--teal-600)' }} />
        <p className="empty-state-title">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Command Banner */}
      <div className="command-hero">
        <div className="command-hero-content">
          <div className="demo-badge-pill" style={{ marginBottom: 12 }}>
            <ShieldCheck style={{ width: 14, height: 14 }} />
            Healthcare Overview
          </div>
          <h1 className="command-hero-title">
            Healthcare Dashboard
          </h1>
          <p className="command-hero-subtitle">
            Manage hospital registrations, monitor bed availability across districts, and resolve citizen complaints.
          </p>
        </div>

        <div className="command-hero-actions">
          <Link to="/hospitals" className="btn btn-primary">
            <Building style={{ width: 16, height: 16 }} />
            <span>Manage Hospitals</span>
          </Link>
          <Link to="/announcements" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Megaphone style={{ width: 16, height: 16 }} />
            <span>New Announcement</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <StatCards stats={stats} />

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div style={{ flex: 2, minWidth: 320 }}>
          <RegistrationChart />
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <StatusBreakdownChart hospitals={hospitals} />
        </div>
      </div>

      {/* District overview */}
      <DistrictOverview districts={districts} />

      {/* Recent Streams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <div>
          <RecentApplicationsTable hospitals={hospitals} />
        </div>
        <div>
          <RecentComplaintsList complaints={complaints} />
        </div>
        <div>
          <RecentActivityFeed logs={logs} />
        </div>
      </div>
    </div>
  );
};
