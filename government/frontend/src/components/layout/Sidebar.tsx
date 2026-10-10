import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Activity,
  AlertCircle,
  Megaphone,
  Users2,
  LogOut,
  ShieldCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { AdminUser } from '../../services/authService';

interface SidebarProps {
  user: AdminUser | null;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  pendingHospitalsCount?: number;
  openComplaintsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onLogout,
  isOpen = false,
  onClose,
  pendingHospitalsCount = 0,
  openComplaintsCount = 0,
}) => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/hospitals',
      label: 'Hospitals',
      icon: Building2,
      badge: pendingHospitalsCount > 0 ? `${pendingHospitalsCount} Pending` : null,
      badgeStyle: { background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.3)' },
    },
    {
      to: '/monitoring',
      label: 'Hospital Capacity',
      icon: Activity,
      badge: null,
    },
    {
      to: '/complaints',
      label: 'Complaints',
      icon: AlertCircle,
      badge: openComplaintsCount > 0 ? `${openComplaintsCount} Open` : null,
      badgeStyle: { background: 'rgba(244, 63, 94, 0.2)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)' },
    },
    {
      to: '/announcements',
      label: 'Announcements',
      icon: Megaphone,
      badge: null,
    },
    {
      to: '/staff-logs',
      label: 'Staff & History',
      icon: Users2,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <ShieldCheck style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="sidebar-brand-title">
                Care<span className="sidebar-brand-teal">Sync</span>
              </span>
              <span className="demo-badge-pill" style={{ padding: '1px 5px', fontSize: 9 }}>
                GOV
              </span>
            </div>
            <p className="sidebar-brand-subtitle">Government Admin Portal</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        )}
      </div>

      {/* Scope line */}
      <div className="sidebar-scope">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
          <span className="pulse-dot" /> Government Portal
        </span>
        <span style={{ color: '#64748b', fontSize: 10 }}>Healthcare Management</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {({ isActive }) => (
                <>
                  <div className="nav-link-left">
                    <Icon style={{ width: 16, height: 16, color: isActive ? '#ffffff' : '#64748b' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        ...item.badgeStyle,
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      style={{
                        width: 14,
                        height: 14,
                        color: isActive ? '#99f6e4' : '#475569',
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar-circle">
            {user?.name ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'AD'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="user-meta-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Administrator'}
            </p>
            <p className="user-meta-role" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.role || 'Government Admin'}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="btn btn-danger-outline"
          style={{ width: '100%', fontSize: 12, padding: '7px 12px' }}
        >
          <LogOut style={{ width: 14, height: 14 }} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="app-sidebar">{sidebarContent}</aside>
      {isOpen && (
        <div
          className="modal-backdrop"
          style={{ justifyContent: 'flex-start', padding: 0 }}
          onClick={onClose}
        >
          <div
            style={{ width: 270, height: '100vh', background: 'var(--navy-950)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
