import React, { useState } from 'react';
import { Hospital } from '../../types';
import {
  X,
  CheckCircle,
  XCircle,
  ClipboardList,
} from 'lucide-react';

interface HospitalReviewModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onApprove: (hospital: Hospital) => void;
  onRejectPrompt: (hospital: Hospital) => void;
}

export const HospitalReviewModal: React.FC<HospitalReviewModalProps> = ({
  hospital,
  onClose,
  onApprove,
  onRejectPrompt,
}) => {
  const [checklist, setChecklist] = useState({
    fireNoc: true,
    bioWaste: true,
    icuOxygen: true,
    staffQuorum: true,
  });

  if (!hospital) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 620 }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="demo-badge-pill" style={{ marginBottom: 6 }}>
              <ClipboardList style={{ width: 12, height: 12 }} /> Regulatory Licensing Board
            </div>
            <h2 className="modal-title">Review Application</h2>
            <p className="modal-subtitle">
              Verify statutory compliance for <strong>{hospital.name}</strong> ({hospital.licenseNumber})
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Summary Box */}
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: '#f8fafc',
              border: '1px solid var(--slate-200)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            <div>
              <span className="form-label">District</span>
              <p style={{ fontWeight: 700, margin: '2px 0 0 0' }}>{hospital.district}</p>
            </div>
            <div>
              <span className="form-label">Capacity</span>
              <p style={{ fontWeight: 700, margin: '2px 0 0 0' }}>{hospital.totalBeds} Beds ({hospital.icuBeds} ICU)</p>
            </div>
            <div>
              <span className="form-label">Accreditation</span>
              <p style={{ fontWeight: 700, margin: '2px 0 0 0' }}>{hospital.accreditation}</p>
            </div>
          </div>

          {/* Statutory Clearances Checklist */}
          <div>
            <span className="form-label" style={{ marginBottom: 8, display: 'block' }}>
              Statutory Inspection Clearances
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 10, border: '1px solid var(--slate-200)', cursor: 'pointer', background: '#f8fafc' }}>
                <input
                  type="checkbox"
                  checked={checklist.fireNoc}
                  onChange={(e) => setChecklist({ ...checklist, fireNoc: e.target.checked })}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--slate-900)' }}>Fire Safety & Hydraulic Clearance</strong>
                  <p style={{ fontSize: 11, color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                    Certified suppression systems and emergency evacuation routes inspected.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 10, border: '1px solid var(--slate-200)', cursor: 'pointer', background: '#f8fafc' }}>
                <input
                  type="checkbox"
                  checked={checklist.bioWaste}
                  onChange={(e) => setChecklist({ ...checklist, bioWaste: e.target.checked })}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--slate-900)' }}>Bio-Medical Waste Disposal NOC</strong>
                  <p style={{ fontSize: 11, color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                    State Pollution Control Board authorization on file.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 10, border: '1px solid var(--slate-200)', cursor: 'pointer', background: '#f8fafc' }}>
                <input
                  type="checkbox"
                  checked={checklist.icuOxygen}
                  onChange={(e) => setChecklist({ ...checklist, icuOxygen: e.target.checked })}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--slate-900)' }}>Medical Gas & Oxygen Pipeline Certificate</strong>
                  <p style={{ fontSize: 11, color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                    Cryogenic liquid medical oxygen backup verified compliant with national standards.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 10, border: '1px solid var(--slate-200)', cursor: 'pointer', background: '#f8fafc' }}>
                <input
                  type="checkbox"
                  checked={checklist.staffQuorum}
                  onChange={(e) => setChecklist({ ...checklist, staffQuorum: e.target.checked })}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--slate-900)' }}>Physician & Nurse Clinical Quorum</strong>
                  <p style={{ fontSize: 11, color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                    Practitioner credentials verified against National Medical Commission registry.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                onClose();
                onRejectPrompt(hospital);
              }}
              className="btn btn-danger-outline"
            >
              <XCircle style={{ width: 14, height: 14 }} />
              <span>Reject Application</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onApprove(hospital);
              }}
              className="btn btn-primary"
            >
              <CheckCircle style={{ width: 14, height: 14 }} />
              <span>Grant License & Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
