import React, { useState, useEffect } from 'react';
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
import { monitoringService } from '../../services/monitoringService';

export const RegistrationChart: React.FC = () => {
  const [trends, setTrends] = useState<{ month: string; applications: number; approved: number; rejected: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await monitoringService.getRegistrationTrends();
      setTrends(data);
    };
    load();
    const unsub = monitoringService.subscribe(async () => {
      const data = await monitoringService.getRegistrationTrends();
      setTrends(data);
    });
    return () => unsub();
  }, []);

  const totalApps = trends.reduce((acc, t) => acc + t.applications, 0);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Hospital Registrations</h3>
          <p className="card-subtitle">Monthly applications compared to approvals</p>
        </div>
        <span className="badge badge-published">
          {totalApps} Total Applications
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
            <Bar dataKey="applications" name="Applications" fill="#0284c7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approved" name="Approved" fill="#0d9488" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected" name="Rejected" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
