import React from 'react';
import { DistrictCapacity } from '../../types';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DistrictOverviewProps {
  districts: DistrictCapacity[];
}

export const DistrictOverview: React.FC<DistrictOverviewProps> = ({ districts }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">District Hospital Capacity</h3>
          <p className="card-subtitle">Bed availability and emergency status by district</p>
        </div>
        <Link to="/monitoring" className="btn btn-outline btn-sm">
          <span>View Bed Capacity</span>
          <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {districts.map((d) => {
          const occupancyRate = d.totalBeds > 0 ? Math.round((d.occupiedBeds / d.totalBeds) * 100) : 0;
          return (
            <div
              key={d.district}
              style={{
                padding: 14,
                borderRadius: 12,
                border: '1px solid var(--slate-200)',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin style={{ width: 13, height: 13, color: 'var(--teal-600)' }} />
                  {d.district}
                </span>
                <span className="badge badge-draft" style={{ fontSize: 9, padding: '2px 6px' }}>
                  {d.emergencyStatus}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--slate-500)', marginBottom: 4 }}>
                  <span>Occupancy</span>
                  <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{occupancyRate}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--slate-200)', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${occupancyRate}%`,
                      height: '100%',
                      background: 'var(--teal-500)',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              {/* Counts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  paddingTop: 8,
                  borderTop: '1px solid var(--slate-200)',
                  textAlign: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: 9, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Hospitals</span>
                  <p style={{ fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>{d.totalHospitals}</p>
                </div>
                <div>
                  <span style={{ fontSize: 9, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Available Beds</span>
                  <p style={{ fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--teal-600)' }}>{d.availableBeds}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
