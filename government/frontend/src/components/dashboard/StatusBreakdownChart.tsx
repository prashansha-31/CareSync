import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Hospital } from '../../types';
import { Building2 } from 'lucide-react';

interface StatusBreakdownChartProps {
  hospitals: Hospital[];
}

export const StatusBreakdownChart: React.FC<StatusBreakdownChartProps> = ({ hospitals }) => {
  const approvedCount = hospitals.filter((h) => h.status === 'Approved').length;
  const pendingCount = hospitals.filter((h) => h.status === 'Pending').length;
  const rejectedCount = hospitals.filter((h) => h.status === 'Rejected').length;
  const suspendedCount = hospitals.filter((h) => h.status === 'Suspended').length;

  const data = [
    { name: 'Approved', value: approvedCount, color: '#0d9488' },
    { name: 'Pending Review', value: pendingCount, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedCount, color: '#f43f5e' },
    { name: 'Suspended', value: suspendedCount, color: '#8b5cf6' },
  ].filter((d) => d.value > 0);

  const total = hospitals.length;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Hospital Status</h3>
          <p className="card-subtitle">Distribution by current status</p>
        </div>
        <span className="badge badge-draft">Total: {total}</span>
      </div>

      <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {total === 0 ? (
          <div className="empty-state" style={{ padding: 20 }}>
            <div className="empty-state-icon" style={{ width: 44, height: 44 }}>
              <Building2 style={{ width: 22, height: 22 }} />
            </div>
            <p className="empty-state-title" style={{ fontSize: 13 }}>No Hospitals Added</p>
            <p className="empty-state-desc" style={{ fontSize: 11 }}>
              Hospitals will appear here once they are registered.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 12,
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
