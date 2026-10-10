import React from 'react';
import { Hospital } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentApplicationsTableProps {
  hospitals: Hospital[];
}

export const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({ hospitals }) => {
  const recent = hospitals.slice(0, 5);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Registrations</h3>
          <p className="card-subtitle">Latest hospital applications and status</p>
        </div>
        <Link to="/hospitals" className="btn btn-outline btn-sm">
          <span>Manage</span>
          <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 16px' }}>
          <div className="empty-state-icon">
            <Building2 style={{ width: 24, height: 24 }} />
          </div>
          <p className="empty-state-title">No Hospital Applications</p>
          <p className="empty-state-desc">
            No hospital applications submitted yet. Click below to add a hospital.
          </p>
          <Link to="/hospitals" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            Add Hospital
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hospital Name</th>
                <th>District</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((h) => (
                <tr key={h.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate-500)', fontFamily: 'var(--font-mono)' }}>
                      {h.licenseNumber}
                    </div>
                  </td>
                  <td>{h.district}</td>
                  <td>
                    <StatusBadge status={h.status} size="sm" />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/hospitals?review=${h.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
