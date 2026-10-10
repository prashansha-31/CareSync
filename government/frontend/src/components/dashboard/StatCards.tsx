import React from 'react';
import { Building2, Clock, BedDouble, AlertCircle, Megaphone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardStats } from '../../types';

interface StatCardsProps {
  stats: DashboardStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Registered Hospitals',
      value: stats.totalRegisteredHospitals.toLocaleString(),
      subtext: 'Approved healthcare facilities',
      icon: Building2,
      bgColor: 'var(--teal-50)',
      textColor: 'var(--teal-600)',
      link: '/hospitals',
    },
    {
      title: 'Awaiting Review',
      value: stats.hospitalsAwaitingApproval.toLocaleString(),
      subtext: 'Pending approval',
      icon: Clock,
      bgColor: 'var(--amber-50)',
      textColor: 'var(--amber-600)',
      link: '/hospitals?filter=Pending',
    },
    {
      title: 'Available Beds',
      value: stats.reportedAvailableBeds.toLocaleString(),
      subtext: `Total Capacity: ${stats.totalBedsCapacity.toLocaleString()} beds`,
      icon: BedDouble,
      bgColor: 'var(--indigo-50)',
      textColor: 'var(--indigo-600)',
      link: '/monitoring',
    },
    {
      title: 'Open Complaints',
      value: stats.openComplaints.toLocaleString(),
      subtext: `${stats.urgentComplaints} marked urgent`,
      icon: AlertCircle,
      bgColor: 'var(--rose-50)',
      textColor: 'var(--rose-600)',
      link: '/complaints',
    },
    {
      title: 'Active Notices',
      value: stats.activeAnnouncements.toLocaleString(),
      subtext: 'Published announcements',
      icon: Megaphone,
      bgColor: 'var(--slate-100)',
      textColor: 'var(--slate-800)',
      link: '/announcements',
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Link key={i} to={c.link} className="kpi-card">
            <div>
              <div className="kpi-card-header">
                <div className="kpi-icon-wrapper" style={{ background: c.bgColor, color: c.textColor }}>
                  <Icon style={{ width: 20, height: 20 }} />
                </div>
                <ArrowUpRight style={{ width: 16, height: 16, color: 'var(--slate-400)' }} />
              </div>
              <p className="kpi-title">{c.title}</p>
              <h3 className="kpi-value">{c.value}</h3>
            </div>
            <p className="kpi-subtext">{c.subtext}</p>
          </Link>
        );
      })}
    </div>
  );
};
