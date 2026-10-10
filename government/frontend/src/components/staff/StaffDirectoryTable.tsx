import React from 'react';
import { StaffMember } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Users2, MapPin, Briefcase } from 'lucide-react';

interface StaffDirectoryTableProps {
  staffMembers: StaffMember[];
  onAddClick?: () => void;
}

export const StaffDirectoryTable: React.FC<StaffDirectoryTableProps> = ({ staffMembers, onAddClick }) => {
  if (staffMembers.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users2 style={{ width: 28, height: 28 }} />
          </div>
          <h3 className="empty-state-title">No Staff Members Registered</h3>
          <p className="empty-state-desc">
            No regulatory officers or inspectors have been added to the personnel directory yet.
          </p>
          {onAddClick && (
            <button onClick={onAddClick} className="btn btn-primary" style={{ marginTop: 8 }}>
              Add Staff Officer
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-200)', marginBottom: 0 }}>
        <div>
          <h3 className="card-title">Government Regulatory Personnel Directory</h3>
          <p className="card-subtitle">
            Designated medical commissioners, regional health inspectors, and compliance officers
          </p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Officer & Badge</th>
              <th>Official Designation</th>
              <th>Department / Wing</th>
              <th>Jurisdiction</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Assigned Caseload</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="user-avatar-circle" style={{ width: 32, height: 32, fontSize: 11 }}>
                      {staff.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{staff.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate-500)', display: 'flex', gap: 6, marginTop: 2 }}>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{staff.badgeId}</span>
                        <span>&bull;</span>
                        <span>{staff.email}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ fontWeight: 600 }}>{staff.role}</div>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--slate-600)' }}>
                    <Briefcase style={{ width: 13, height: 13, color: 'var(--slate-400)' }} />
                    <span>{staff.department}</span>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                    <MapPin style={{ width: 13, height: 13, color: 'var(--teal-600)' }} />
                    <span>{staff.district}</span>
                  </div>
                </td>

                <td>
                  <StatusBadge status={staff.status} size="sm" />
                </td>

                <td style={{ textAlign: 'right' }}>
                  <span className="badge badge-draft" style={{ fontWeight: 700 }}>
                    {staff.assignedCasesCount} cases
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
