import React from 'react';
import { Hospital } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Eye,
  CheckCircle,
  AlertTriangle,
  Building2,
  MapPin,
  BedDouble,
  FileCheck2,
} from 'lucide-react';

interface HospitalTableProps {
  hospitals: Hospital[];
  onViewDetails: (hospital: Hospital) => void;
  onReviewApplication: (hospital: Hospital) => void;
  onSuspendPrompt: (hospital: Hospital) => void;
  onRegisterClick?: () => void;
}

export const HospitalTable: React.FC<HospitalTableProps> = ({
  hospitals,
  onViewDetails,
  onReviewApplication,
  onSuspendPrompt,
  onRegisterClick,
}) => {
  if (hospitals.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Building2 style={{ width: 28, height: 28 }} />
          </div>
          <h3 className="empty-state-title">No Hospitals In Registry</h3>
          <p className="empty-state-desc">
            No hospital registration records currently exist. Click below to register a clinical establishment.
          </p>
          {onRegisterClick && (
            <button onClick={onRegisterClick} className="btn btn-primary" style={{ marginTop: 8 }}>
              Register Hospital
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
              <th>Hospital & License</th>
              <th>District</th>
              <th>Classification</th>
              <th>Beds (Free / Total)</th>
              <th>Accreditation</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((h) => {
              const isPending = h.status === 'Pending';
              const isApproved = h.status === 'Approved';

              return (
                <tr key={h.id}>
                  {/* Name & ID */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{h.name}</div>
                    <div style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--slate-500)', marginTop: 2 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', background: 'var(--slate-100)', padding: '1px 6px', borderRadius: 4 }}>
                        {h.licenseNumber}
                      </span>
                      <span>&bull;</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{h.registrationNumber}</span>
                    </div>
                  </td>

                  {/* District */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                      <MapPin style={{ width: 14, height: 14, color: 'var(--teal-600)' }} />
                      <span>{h.district}</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--slate-400)' }}>{h.state}</span>
                  </td>

                  {/* Category */}
                  <td>
                    <div style={{ fontWeight: 600 }}>{h.category}</div>
                    <span style={{ fontSize: 11, color: 'var(--slate-500)' }}>{h.ownership}</span>
                  </td>

                  {/* Bed stats */}
                  <td>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BedDouble style={{ width: 14, height: 14, color: 'var(--slate-400)' }} />
                      <span>{h.availableBeds} / {h.totalBeds} Beds</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--teal-600)', fontWeight: 600, marginTop: 2 }}>
                      {h.availableIcuBeds} / {h.icuBeds} ICUs Free
                    </div>
                  </td>

                  {/* Accreditation */}
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        background: 'var(--slate-100)',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--slate-200)',
                      }}
                    >
                      <FileCheck2 style={{ width: 12, height: 12, color: 'var(--teal-600)' }} />
                      {h.accreditation}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge status={h.status} />
                    {h.rejectionReason && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: 10,
                          color: 'var(--rose-600)',
                          marginTop: 2,
                          maxWidth: 140,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={h.rejectionReason}
                      >
                        {h.rejectionReason}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <button onClick={() => onViewDetails(h)} className="btn btn-outline btn-sm">
                        <Eye style={{ width: 13, height: 13 }} />
                        <span>Details</span>
                      </button>

                      {isPending && (
                        <button onClick={() => onReviewApplication(h)} className="btn btn-primary btn-sm">
                          <CheckCircle style={{ width: 13, height: 13 }} />
                          <span>Review</span>
                        </button>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => onSuspendPrompt(h)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--rose-600)', borderColor: 'var(--rose-100)', background: 'var(--rose-50)' }}
                          title="Suspend License"
                        >
                          <AlertTriangle style={{ width: 13, height: 13 }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
