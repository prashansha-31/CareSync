import React from 'react';
import { Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Eye, AlertCircle } from 'lucide-react';

interface ComplaintTableProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onLogClick?: () => void;
}

export const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  onSelectComplaint,
  onLogClick,
}) => {
  if (complaints.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle style={{ width: 28, height: 28 }} />
          </div>
          <h3 className="empty-state-title">No Grievances Logged</h3>
          <p className="empty-state-desc">
            There are currently no open or investigated complaints. Click below to file or register a grievance case.
          </p>
          {onLogClick && (
            <button onClick={onLogClick} className="btn btn-primary" style={{ marginTop: 8 }}>
              Log Grievance Case
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Hospital & District</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Officer</th>
              <th>Submission Date</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--teal-600)',
                      background: 'var(--teal-50)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--teal-100)',
                    }}
                  >
                    {c.id}
                  </span>
                </td>

                <td>
                  <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{c.hospitalName}</div>
                  <span style={{ fontSize: 11, color: 'var(--slate-400)' }}>{c.district}</span>
                </td>

                <td>
                  <span style={{ fontWeight: 600 }}>{c.category}</span>
                </td>

                <td>
                  <StatusBadge status={c.priority} size="sm" />
                </td>

                <td>
                  <StatusBadge status={c.status} size="sm" />
                </td>

                <td>
                  {c.assignedTo ? (
                    <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{c.assignedTo.split('(')[0]}</span>
                  ) : (
                    <span style={{ color: 'var(--amber-600)', fontStyle: 'italic', fontSize: 11 }}>Unassigned</span>
                  )}
                </td>

                <td style={{ fontSize: 11, color: 'var(--slate-500)' }}>
                  {c.submittedDate}
                </td>

                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComplaint(c);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye style={{ width: 13, height: 13 }} />
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
