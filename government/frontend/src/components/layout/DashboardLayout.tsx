import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { DemoNoticeBanner } from '../common/DemoNoticeBanner';
import { authService, AdminUser } from '../../services/authService';
import { hospitalService } from '../../services/hospitalService';
import { complaintService } from '../../services/complaintService';

export const DashboardLayout: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(() => authService.getCurrentUser());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingHospitalsCount, setPendingHospitalsCount] = useState(0);
  const [openComplaintsCount, setOpenComplaintsCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Authentication check
  useEffect(() => {
    const unsubAuth = authService.subscribe((updatedUser) => {
      setUser(updatedUser);
      if (!updatedUser) {
        navigate('/login', { replace: true });
      }
    });

    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
    }

    return () => unsubAuth();
  }, [navigate]);

  // Counts for sidebar badges
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const hospitals = await hospitalService.getHospitals();
        setPendingHospitalsCount(hospitals.filter((h) => h.status === 'Pending').length);

        const complaints = await complaintService.getComplaints();
        setOpenComplaintsCount(
          complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadCounts();

    const unsubHospitals = hospitalService.subscribe((hospitals) => {
      setPendingHospitalsCount(hospitals.filter((h) => h.status === 'Pending').length);
    });

    const unsubComplaints = complaintService.subscribe((complaints) => {
      setOpenComplaintsCount(
        complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length
      );
    });

    return () => {
      unsubHospitals();
      unsubComplaints();
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login', { replace: true });
  };

  let title = 'National Command Center';
  let subtitle = 'CareSync Integrated Healthcare Regulatory Registry';
  const pathname = location.pathname;

  if (pathname.startsWith('/hospitals')) {
    title = 'Hospital Licensing & Accreditation';
    subtitle = 'Review, approve, reject, and inspect clinical establishment registrations';
  } else if (pathname.startsWith('/monitoring')) {
    title = 'Healthcare Capacity Oversight';
    subtitle = 'Reported district-level bed, ICU, and emergency telemetry';
  } else if (pathname.startsWith('/complaints')) {
    title = 'Citizen & Clinical Grievance Redressal';
    subtitle = 'Investigate reported overcharging, negligence, sanitation, and emergency denial';
  } else if (pathname.startsWith('/announcements')) {
    title = 'Public Health Directives & Advisories';
    subtitle = 'Publish official regulatory mandates, outbreak warnings, and vaccination guidelines';
  } else if (pathname.startsWith('/staff-logs')) {
    title = 'Administrative Staff & Audit Logs';
    subtitle = 'Government regulatory personnel directory and system security logs';
  }

  return (
    <div className="app-shell">
      <DemoNoticeBanner />
      <div className="app-main-layout">
        <Sidebar
          user={user}
          onLogout={handleLogout}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          pendingHospitalsCount={pendingHospitalsCount}
          openComplaintsCount={openComplaintsCount}
        />

        <div className="main-viewport">
          <TopNav
            user={user}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            title={title}
            subtitle={subtitle}
          />

          <main className="page-wrapper">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
