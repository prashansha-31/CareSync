import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DistrictCapacity } from '../../types';

interface CapacityChartsProps {
  districts: DistrictCapacity[];
}

export const CapacityCharts: React.FC<CapacityChartsProps> = ({ districts }) => {
  const chartData = districts.map((d) => ({
    name: d.district.replace('District', '').trim(),
    totalBeds: d.totalBeds,
    availableBeds: d.availableBeds,
    icuAvailable: d.icuAvailable,
  }));

  const totalBedsAcross = districts.reduce((acc, d) => acc + d.totalBeds, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
      {/* District Comparison */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">District Bed Inventory Comparison</h3>
            <p className="card-subtitle">Total bed allotment vs available vacant capacity</p>
          </div>
          <span className="badge badge-published">Regional Breakdown</span>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          {totalBedsAcross === 0 ? (
            <div className="empty-state" style={{ height: '100%', padding: 20 }}>
              <p className="empty-state-title" style={{ fontSize: 13 }}>No Registered Beds</p>
              <p className="empty-state-desc" style={{ fontSize: 11 }}>
                Register hospitals in the Hospital Management module to view capacity telemetry.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    borderRadius: 12,
                    border: 'none',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11 }} iconType="circle" />
                <Bar dataKey="totalBeds" name="Total Beds" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="availableBeds" name="Free Beds" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="icuAvailable" name="Free ICUs" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
