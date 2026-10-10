import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus, StaffMember } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  UserCheck,
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface ComplaintDetailsDrawerProps {
  complaint: Complaint | null;
  staffList: StaffMember[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: ComplaintStatus, notes?: string) => void;
  onAssignStaff: (id: string, staffName: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export const ComplaintDetailsDrawer: React.FC<ComplaintDetailsDrawerProps> = ({
  complaint,
  staffList,
  onClose,
  onUpdateStatus,
  onAssignStaff,
  onSaveNotes,
}) => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const { success } = useToast();

  useEffect(() => {
    if (complaint) {
      setSelectedStaff(complaint.assignedTo || '');
      setResolutionNotes(complaint.resolutionNotes || '');
    }
  }, [complaint]);

  if (!complaint) return null;

  const handleAssign = () => {
    if (!selectedStaff) return;
    onAssignStaff(complaint.id, selectedStaff);
    success('Investigator Assigned', `Case assigned to ${selectedStaff}`);
  };

  const handleSaveNotes = () => {
    onSaveNotes(complaint.id, resolutionNotes);
    success('Resolution Notes Saved', 'Official case findings updated in permanent grievance ledger.');
  };

  return (
    <div className="modal-backdrop" style={{ justifyContent: 'flex-end', padding: 0 }} role="dialog" aria-modal="true">
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          height: '100vh',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-2xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'rgba(20, 184, 166, 0.2)', color: 'var(--teal-300)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                {complaint.id}
              </span>
              <StatusBadge status={complaint.priority} size="sm" />
              <StatusBadge status={complaint.status} size="sm" />
            </div>
            <h2 className="modal-title" style={{ fontSize: 16 }}>{complaint.category}</h2>
            <p className="modal-subtitle">{complaint.hospitalName} ({complaint.district})</p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Grievance Details */}
          <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            <span className="form-label">Complainant Information</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Submitted By:</span>
              <span style={{ fontWeight: 700 }}>{complaint.submittedBy}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Email:</span>
              <span>{complaint.contactEmail}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Submission Date:</span>
              <span>{complaint.submittedDate}</span>
            </div>
          </div>

          {/* Narrative */}
          <div>
            <span className="form-label" style={{ marginBottom: 6, display: 'block' }}>Grievance Statement</span>
            <div style={{ padding: 12, borderRadius: 10, background: '#f8fafc', border: '1px solid var(--slate-200)', fontSize: 12, lineHeight: 1.6 }}>
              {complaint.description}
            </div>
          </div>

          {/* Assign Case */}
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--teal-50)', border: '1px solid var(--teal-100)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck style={{ width: 16, height: 16, color: 'var(--teal-600)' }} />
              <strong style={{ fontSize: 12, color: 'var(--slate-900)' }}>Assign Regulatory Officer</strong>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="form-control"
                style={{ fontSize: 12 }}
              >
                <option value="">Select Government Inspector...</option>
                {staffList.map((s) => (
                  <option key={s.id} value={`${s.name} (${s.role})`}>
                    {s.name} &bull; {s.role} ({s.district})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAssign}
                disabled={!selectedStaff || selectedStaff === complaint.assignedTo}
                className="btn btn-primary btn-sm"
              >
                Assign
              </button>
            </div>
            {complaint.assignedTo && (
              <span style={{ fontSize: 11, color: 'var(--teal-700)' }}>
                Currently assigned to: <strong>{complaint.assignedTo}</strong>
              </span>
            )}
          </div>

          {/* Status Updates */}
          <div>
            <span className="form-label" style={{ marginBottom: 8, display: 'block' }}>Update Status</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {(['Open', 'In Progress', 'Escalated', 'Resolved'] as const).map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => onUpdateStatus(complaint.id, statusOption, resolutionNotes)}
                  className={complaint.status === statusOption ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </div>

          {/* Findings & Notes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="form-label">Investigation Findings</span>
              <button onClick={handleSaveNotes} style={{ background: 'none', border: 'none', color: 'var(--teal-600)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                Save Findings
              </button>
            </div>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={3}
              placeholder="Record clinical audit findings or show-cause notices..."
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Audit History Timeline */}
          <div>
            <span className="form-label" style={{ marginBottom: 8, display: 'block' }}>Case Chronology</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {complaint.history.map((h) => (
                <div key={h.id} style={{ padding: 10, borderRadius: 8, background: '#f8fafc', border: '1px solid var(--slate-200)', fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>{h.action}</span>
                    <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>{h.timestamp}</span>
                  </div>
                  <span style={{ color: 'var(--slate-500)', display: 'block', marginTop: 2 }}>By: {h.actor}</span>
                  {h.notes && (
                    <p style={{ fontStyle: 'italic', color: 'var(--slate-700)', marginTop: 4 }}>
                      &ldquo;{h.notes}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
