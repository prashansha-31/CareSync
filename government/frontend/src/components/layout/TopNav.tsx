import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Shield,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { AdminUser } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { clearAllPortalData } from '../../services/storageHelper';

interface TopNavProps {
  user: AdminUser | null;
  onOpenMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  onOpenMobileSidebar,
  title = 'Government Administration',
  subtitle = 'Healthcare Oversight & Hospital Directory',
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { info, success } = useToast();

  const handleClearData = () => {
    if (window.confirm('Reset all demo data and start fresh?')) {
      clearAllPortalData();
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="navbar-title-group">
          <button
            onClick={onOpenMobileSidebar}
            className="btn btn-outline btn-sm"
            style={{ display: 'none' }} // Visible on mobile via CSS
            aria-label="Open navigation menu"
          >
            <Menu style={{ width: 18, height: 18 }} />
          </button>

          <div>
            <h1 className="navbar-page-title">
              {title}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--teal-600)',
                  background: 'var(--teal-50)',
                  border: '1px solid var(--teal-100)',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Shield style={{ width: 12, height: 12 }} /> Government Portal
              </span>
            </h1>
            <p className="navbar-page-subtitle">{subtitle}</p>
          </div>
        </div>

        {/* Right Tools */}
        <div className="navbar-actions">
          {/* Clear / Wipe Stored State Button */}
          <button
            onClick={handleClearData}
            title="Reset demo data"
            className="btn btn-outline btn-sm"
          >
            <Trash2 style={{ width: 13, height: 13, color: 'var(--slate-500)' }} />
            <span>Reset Data</span>
          </button>

          {/* System Online Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--emerald-50)',
              border: '1px solid var(--emerald-100)',
              fontSize: 12,
              fontWeight: 600,
              color: '#065f46',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--emerald-500)',
              }}
            />
            <span>Online</span>
          </div>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn btn-outline btn-sm"
              style={{ padding: 8, borderRadius: 10 }}
              aria-label="Notifications"
            >
              <Bell style={{ width: 16, height: 16, color: 'var(--slate-600)' }} />
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: 8,
                  width: 320,
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--slate-200)',
                  padding: 16,
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 8,
                    borderBottom: '1px solid var(--slate-100)',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-700)' }}>
                    Notifications
                  </span>
                  <button
                    onClick={() => {
                      info('All notifications marked as read');
                      setShowNotifications(false);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--teal-600)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                </div>

                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--slate-500)', textAlign: 'center', padding: '16px 0' }}>
                  No new notifications.
                </div>
              </div>
            )}
          </div>

          {/* User Profile Mini */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingLeft: 12,
              borderLeft: '1px solid var(--slate-200)',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--slate-900)',
                color: 'var(--teal-300)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {user?.name ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'AD'}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: 'var(--slate-900)' }}>
                {user?.name || 'Admin'}
              </p>
              <p style={{ fontSize: 10, color: 'var(--slate-500)', margin: 0 }}>
                {user?.role || 'Regulatory Officer'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
