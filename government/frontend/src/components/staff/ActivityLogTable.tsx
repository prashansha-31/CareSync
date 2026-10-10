import React, { useState } from 'react';
import { ActivityLog } from '../../types';
import {
  ShieldCheck,
  Ban,
  Megaphone,
  AlertCircle,
  UserCheck,
  Search,
  Clock,
  Terminal,
} from 'lucide-react';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.relatedRecord.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || l.actionType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getBadge = (type: ActivityLog['actionType']) => {
    switch (type) {
      case 'HOSPITAL_APPROVED':
        return (
          <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck style={{ width: 13, height: 13 }} />
            Approved
          </span>
        );
      case 'HOSPITAL_REJECTED':
      case 'HOSPITAL_SUSPENDED':
        return (
          <span className="badge badge-urgent" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Ban style={{ width: 13, height: 13 }} />
            Sanction
          </span>
        );
      case 'ANNOUNCEMENT_PUBLISHED':
      case 'ANNOUNCEMENT_ARCHIVED':
        return (
          <span className="badge badge-normal" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Megaphone style={{ width: 13, height: 13 }} />
            Directive
          </span>
        );
      case 'COMPLAINT_STATUS_UPDATED':
      case 'COMPLAINT_ASSIGNED':
        return (
          <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <AlertCircle style={{ width: 13, height: 13 }} />
            Grievance
          </span>
        );
      default:
        return (
          <span className="badge badge-draft" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <UserCheck style={{ width: 13, height: 13 }} />
            Session
          </span>
        );
    }
  };

  return (
    <div className="table-container">
      {/* Search & Filter Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--slate-400)',
            }}
          >
            <Search style={{ width: 16, height: 16 }} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs by officer, action, or record ID..."
            className="form-input"
            style={{ paddingLeft: 36, paddingRight: 12, height: 38 }}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: 200, height: 38 }}
        >
          <option value="ALL">All Action Types</option>
          <option value="HOSPITAL_APPROVED">Hospital Approvals</option>
          <option value="HOSPITAL_REJECTED">Hospital Rejections</option>
          <option value="HOSPITAL_SUSPENDED">Regulatory Suspensions</option>
          <option value="COMPLAINT_STATUS_UPDATED">Grievance Status Changes</option>
          <option value="ANNOUNCEMENT_PUBLISHED">Public Directives</option>
          <option value="ADMIN_LOGIN">Admin Logins</option>
        </select>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Terminal style={{ width: 28, height: 28 }} />
          </div>
          <h3 className="empty-state-title">No Audit Logs Recorded</h3>
          <p className="empty-state-desc">
            Administrative actions, hospital review decisions, and grievance status changes will appear here in real time.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search style={{ width: 28, height: 28 }} />
          </div>
          <h3 className="empty-state-title">No Matching Log Entries</h3>
          <p className="empty-state-desc">
            Try adjusting your search query or action filter to find logged transactions.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action Category</th>
                <th>Officer / Actor</th>
                <th>Related Record</th>
                <th>Action Particulars</th>
                <th>Timestamp (IST)</th>
                <th style={{ textAlign: 'right' }}>Terminal Node</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{getBadge(log.actionType)}</td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{log.actor}</div>
                    <span style={{ fontSize: 11, color: 'var(--slate-400)' }}>{log.actorRole}</span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--teal-700)',
                        fontWeight: 600,
                        backgroundColor: 'var(--teal-50)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--teal-100)',
                      }}
                    >
                      {log.relatedRecord}
                    </span>
                  </td>

                  <td style={{ minWidth: 260, color: 'var(--slate-700)' }}>
                    <p style={{ margin: 0, lineHeight: 1.5, fontSize: 13 }}>{log.details}</p>
                  </td>

                  <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: 'var(--slate-500)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock style={{ width: 13, height: 13, color: 'var(--slate-400)' }} />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>

                  <td
                    style={{
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--slate-400)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {log.ipAddress}
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
