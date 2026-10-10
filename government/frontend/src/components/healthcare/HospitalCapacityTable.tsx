import React from 'react';
import { Hospital } from '../../types';
import { BedDouble, MapPin, Truck } from 'lucide-react';

interface HospitalCapacityTableProps {
  hospitals: Hospital[];
}

export const HospitalCapacityTable: React.FC<HospitalCapacityTableProps> = ({ hospitals }) => {
  if (hospitals.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <BedDouble style={{ width: 28, height: 28 }} />
          </div>
          <h3 className="empty-state-title">No Hospital Capacity Telemetry</h3>
          <p className="empty-state-desc">
            No approved hospitals are currently streaming bed occupancy data. Once hospitals are approved, their telemetry will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-200)', marginBottom: 0 }}>
        <div>
          <h3 className="card-title">Hospital-Wise Capacity Telemetry</h3>
          <p className="card-subtitle">Reported general beds, critical ICU reserves, and ventilators</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hospital Facility</th>
              <th>District</th>
              <th>Beds (Free / Total)</th>
              <th>Occupancy %</th>
              <th>ICUs (Free / Total)</th>
              <th>Ventilators Free</th>
              <th>Casualty Emergency</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((h) => {
              const occupancy = h.totalBeds > 0
                ? Math.round(((h.totalBeds - h.availableBeds) / h.totalBeds) * 100)
                : 0;

              return (
                <tr key={h.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate-500)', fontFamily: 'var(--font-mono)' }}>{h.licenseNumber}</div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                      <MapPin style={{ width: 14, height: 14, color: 'var(--teal-600)' }} />
                      <span>{h.district}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700 }}>
                      <span style={{ color: 'var(--teal-600)' }}>{h.availableBeds}</span> / {h.totalBeds}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--slate-500)' }}>{h.totalBeds - h.availableBeds} occupied</span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 64, height: 6, background: 'var(--slate-200)', borderRadius: 999, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${occupancy}%`,
                            height: '100%',
                            background: 'var(--teal-500)',
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 11 }}>{occupancy}%</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700 }}>
                      <span style={{ color: 'var(--indigo-600)' }}>{h.availableIcuBeds}</span> / {h.icuBeds}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--slate-500)' }}>{h.icuBeds - h.availableIcuBeds} occupied</span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, color: '#0284c7' }}>{h.availableVentilators} Available</div>
                    <span style={{ fontSize: 10, color: 'var(--slate-500)' }}>{h.ventilators} total</span>
                  </td>

                  <td>
                    {h.emergencyServices ? (
                      <span className="badge badge-approved">
                        <Truck style={{ width: 12, height: 12 }} />
                        24/7 ER Operational
                      </span>
                    ) : (
                      <span className="badge badge-draft">
                        No Casualty ER
                      </span>
                    )}
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
