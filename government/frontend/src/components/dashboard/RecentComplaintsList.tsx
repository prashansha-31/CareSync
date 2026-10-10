import React from 'react';
import { Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentComplaintsListProps {
  complaints: Complaint[];
}

export const RecentComplaintsList: React.FC<RecentComplaintsListProps> = ({ complaints }) => {
  const recent = complaints.slice(0, 4);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Complaints</h3>
          <p className="card-subtitle">Latest complaints submitted by citizens</p>
        </div>
        <Link to="/complaints" className="btn btn-outline btn-sm">
          <span>Manage</span>
          <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 16px' }}>
          <div className="empty-state-icon">
            <AlertCircle style={{ width: 24, height: 24 }} />
          </div>
          <p className="empty-state-title">No Active Complaints</p>
          <p className="empty-state-desc">
            No complaints currently on file. Click below to record one.
          </p>
          <Link to="/complaints" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            File a Complaint
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recent.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 12,
                borderRadius: 12,
                border: '1px solid var(--slate-200)',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--slate-600)' }}>
                  {c.id}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <StatusBadge status={c.priority} size="sm" />
                  <StatusBadge status={c.status} size="sm" />
                </div>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: 'var(--slate-900)' }}>
                {c.category}
              </p>
              <p style={{ fontSize: 11, color: 'var(--slate-500)', margin: 0 }}>
                {c.hospitalName} &bull; {c.district}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <Link to={`/complaints?id=${c.id}`} style={{ fontSize: 11, fontWeight: 600, color: 'var(--teal-600)' }}>
                  View &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
