import React from 'react';
import { ActivityLog } from '../../types';
import { History, ArrowRight, ShieldCheck, Ban, Megaphone, AlertCircle, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivityFeedProps {
  logs: ActivityLog[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ logs }) => {
  const recent = logs.slice(0, 5);

  const getIcon = (type: ActivityLog['actionType']) => {
    switch (type) {
      case 'HOSPITAL_APPROVED':
        return <ShieldCheck style={{ width: 14, height: 14, color: 'var(--emerald-600)' }} />;
      case 'HOSPITAL_REJECTED':
      case 'HOSPITAL_SUSPENDED':
        return <Ban style={{ width: 14, height: 14, color: 'var(--rose-600)' }} />;
      case 'ANNOUNCEMENT_PUBLISHED':
        return <Megaphone style={{ width: 14, height: 14, color: 'var(--teal-600)' }} />;
      case 'COMPLAINT_STATUS_UPDATED':
      case 'COMPLAINT_ASSIGNED':
        return <AlertCircle style={{ width: 14, height: 14, color: 'var(--amber-600)' }} />;
      default:
        return <UserCheck style={{ width: 14, height: 14, color: 'var(--slate-600)' }} />;
    }
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Activity</h3>
          <p className="card-subtitle">Recent actions taken by staff</p>
        </div>
        <Link to="/staff-logs" className="btn btn-outline btn-sm">
          <span>View All</span>
          <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 16px' }}>
          <div className="empty-state-icon">
            <History style={{ width: 24, height: 24 }} />
          </div>
          <p className="empty-state-title">No Activity Recorded</p>
          <p className="empty-state-desc">
            Actions such as hospital approvals and updates will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recent.map((log) => (
            <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'var(--slate-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {getIcon(log.actionType)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{log.actor}</span>
                  <span style={{ fontSize: 10, color: 'var(--slate-400)' }}>{log.timestamp.split(',')[0]}</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--slate-600)', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                  {log.details}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 4,
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--teal-600)',
                    background: 'var(--teal-50)',
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  {log.relatedRecord}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
