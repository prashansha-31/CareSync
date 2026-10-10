import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HospitalManagementPage } from '../pages/HospitalManagementPage';
import { HealthcareMonitoringPage } from '../pages/HealthcareMonitoringPage';
import { ComplaintManagementPage } from '../pages/ComplaintManagementPage';
import { HealthAnnouncementsPage } from '../pages/HealthAnnouncementsPage';
import { StaffActivityLogsPage } from '../pages/StaffActivityLogsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Government Admin Portal Layout */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="hospitals" element={<HospitalManagementPage />} />
        <Route path="monitoring" element={<HealthcareMonitoringPage />} />
        <Route path="complaints" element={<ComplaintManagementPage />} />
        <Route path="announcements" element={<HealthAnnouncementsPage />} />
        <Route path="staff-logs" element={<StaffActivityLogsPage />} />
      </Route>

      {/* Fallback to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
