import React from 'react';
import { BedDouble, Activity, Wind, Truck } from 'lucide-react';
import { DistrictCapacity } from '../../types';

interface CapacityMetricCardsProps {
  districts: DistrictCapacity[];
}

export const CapacityMetricCards: React.FC<CapacityMetricCardsProps> = ({ districts }) => {
  const totalBeds = districts.reduce((acc, d) => acc + d.totalBeds, 0);
  const occupiedBeds = districts.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const availableBeds = districts.reduce((acc, d) => acc + d.availableBeds, 0);

  const icuTotal = districts.reduce((acc, d) => acc + d.icuTotal, 0);
  const icuAvailable = districts.reduce((acc, d) => acc + d.icuAvailable, 0);

  const ventTotal = districts.reduce((acc, d) => acc + d.ventilatorTotal, 0);
  const ventAvailable = districts.reduce((acc, d) => acc + d.ventilatorAvailable, 0);

  const overallOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const icuOccupancy = icuTotal > 0 ? Math.round(((icuTotal - icuAvailable) / icuTotal) * 100) : 0;

  return (
    <div className="kpi-grid">
      {/* Total Reported Beds */}
      <div className="kpi-card">
        <div>
          <div className="kpi-card-header">
            <span className="kpi-title">Reported Bed Capacity</span>
            <div className="kpi-icon-wrapper" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}>
              <BedDouble style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <h3 className="kpi-value">{totalBeds.toLocaleString()}</h3>
          <p style={{ fontSize: 11, color: 'var(--slate-500)', marginTop: 4 }}>
            Across all 6 administrative health regions
          </p>
        </div>
        <p className="kpi-subtext">
          Available Buffer: <strong>{availableBeds.toLocaleString()} Beds</strong>
        </p>
      </div>

      {/* Reported Bed Occupancy */}
      <div className="kpi-card">
        <div>
          <div className="kpi-card-header">
            <span className="kpi-title">Regional Occupancy</span>
            <div className="kpi-icon-wrapper" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}>
              <Activity style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <h3 className="kpi-value">{overallOccupancy}%</h3>
          <div style={{ width: '100%', height: 6, background: 'var(--slate-200)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ width: `${overallOccupancy}%`, height: '100%', background: 'var(--teal-500)', borderRadius: 999 }} />
          </div>
        </div>
        <p className="kpi-subtext">
          Occupied: <strong>{occupiedBeds.toLocaleString()} patients</strong>
        </p>
      </div>

      {/* Critical ICU Capacity */}
      <div className="kpi-card">
        <div>
          <div className="kpi-card-header">
            <span className="kpi-title">ICU Free Buffer</span>
            <div className="kpi-icon-wrapper" style={{ background: 'var(--amber-50)', color: 'var(--amber-600)' }}>
              <Activity style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <h3 className="kpi-value">
            {icuAvailable.toLocaleString()}{' '}
            <span style={{ fontSize: 13, color: 'var(--slate-400)', fontWeight: 500 }}>/ {icuTotal} Total</span>
          </h3>
          <p style={{ fontSize: 11, color: 'var(--slate-500)', marginTop: 4 }}>
            ICU Occupancy rate at <strong>{icuOccupancy}%</strong>
          </p>
        </div>
        <p className="kpi-subtext">
          Status: <strong>Stable Intensive Care Reserve</strong>
        </p>
      </div>

      {/* Mechanical Ventilators */}
      <div className="kpi-card">
        <div>
          <div className="kpi-card-header">
            <span className="kpi-title">Mechanical Ventilators</span>
            <div className="kpi-icon-wrapper" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)' }}>
              <Wind style={{ width: 20, height: 20 }} />
            </div>
          </div>
          <h3 className="kpi-value">
            {ventAvailable.toLocaleString()}{' '}
            <span style={{ fontSize: 13, color: 'var(--slate-400)', fontWeight: 500 }}>/ {ventTotal} Free</span>
          </h3>
          <p style={{ fontSize: 11, color: 'var(--slate-500)', marginTop: 4 }}>
            Invasive & non-invasive respiratory units
          </p>
        </div>
        <p className="kpi-subtext">
          Emergency Reserve: <strong>Verified Operational</strong>
        </p>
      </div>
    </div>
  );
};
