import React from 'react';
import { Hospital } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  MapPin,
  Phone,
  Mail,
  BedDouble,
  Activity,
  Wind,
  Truck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface HospitalDetailsModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onStartReview?: (hospital: Hospital) => void;
}

export const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({
  hospital,
  onClose,
  onStartReview,
}) => {
  if (!hospital) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 680 }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  background: 'rgba(20, 184, 166, 0.2)',
                  color: 'var(--teal-300)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                {hospital.id}
              </span>
              <StatusBadge status={hospital.status} size="sm" />
            </div>
            <h2 className="modal-title">{hospital.name}</h2>
            <p className="modal-subtitle">
              {hospital.category} &bull; {hospital.ownership} &bull; {hospital.district}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {hospital.rejectionReason && (
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: 'var(--rose-50)',
                border: '1px solid var(--rose-100)',
                color: 'var(--rose-600)',
              }}
            >
              <strong>Rejection Grounds:</strong> {hospital.rejectionReason}
            </div>
          )}

          {hospital.suspensionReason && (
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                color: '#6b21a8',
              }}
            >
              <strong>Suspension Sanction:</strong> {hospital.suspensionReason}
            </div>
          )}

          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="form-label">Credentials</span>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-500)' }}>License:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{hospital.licenseNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-500)' }}>Accreditation:</span>
                <span style={{ color: 'var(--teal-600)', fontWeight: 700 }}>{hospital.accreditation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-500)' }}>Applied:</span>
                <span>{hospital.appliedDate}</span>
              </div>
            </div>

            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="form-label">Contact & Location</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin style={{ width: 14, height: 14, color: 'var(--slate-400)' }} />
                <span>{hospital.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone style={{ width: 14, height: 14, color: 'var(--slate-400)' }} />
                <span>{hospital.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail style={{ width: 14, height: 14, color: 'var(--slate-400)' }} />
                <span>{hospital.email}</span>
              </div>
            </div>
          </div>

          {/* Bed and Critical Care Capacities */}
          <div>
            <span className="form-label" style={{ marginBottom: 8, display: 'block' }}>Capacity Breakdown</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center' }}>
              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 10, border: '1px solid var(--slate-200)' }}>
                <BedDouble style={{ width: 16, height: 16, margin: '0 auto 4px auto', color: 'var(--teal-600)' }} />
                <span style={{ fontSize: 10, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Beds</span>
                <p style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0 0' }}>{hospital.totalBeds}</p>
                <span style={{ fontSize: 10, color: 'var(--emerald-600)', fontWeight: 700 }}>{hospital.availableBeds} Free</span>
              </div>

              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 10, border: '1px solid var(--slate-200)' }}>
                <Activity style={{ width: 16, height: 16, margin: '0 auto 4px auto', color: 'var(--indigo-600)' }} />
                <span style={{ fontSize: 10, color: 'var(--slate-500)', textTransform: 'uppercase' }}>ICU Beds</span>
                <p style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0 0' }}>{hospital.icuBeds}</p>
                <span style={{ fontSize: 10, color: 'var(--indigo-600)', fontWeight: 700 }}>{hospital.availableIcuBeds} Free</span>
              </div>

              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 10, border: '1px solid var(--slate-200)' }}>
                <Wind style={{ width: 16, height: 16, margin: '0 auto 4px auto', color: '#0284c7' }} />
                <span style={{ fontSize: 10, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Ventilators</span>
                <p style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0 0' }}>{hospital.ventilators}</p>
                <span style={{ fontSize: 10, color: '#0284c7', fontWeight: 700 }}>{hospital.availableVentilators} Free</span>
              </div>

              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 10, border: '1px solid var(--slate-200)' }}>
                <Truck style={{ width: 16, height: 16, margin: '0 auto 4px auto', color: 'var(--amber-600)' }} />
                <span style={{ fontSize: 10, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Ambulances</span>
                <p style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 0 0' }}>{hospital.ambulanceCount}</p>
                <span style={{ fontSize: 10, color: 'var(--slate-700)' }}>{hospital.emergencyServices ? '24/7 ER' : 'No ER'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
          {hospital.status === 'Pending' && onStartReview && (
            <button
              onClick={() => {
                onClose();
                onStartReview(hospital);
              }}
              className="btn btn-primary"
            >
              Open Application Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
