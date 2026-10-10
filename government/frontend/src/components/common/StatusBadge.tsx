import React from 'react';
import { HospitalStatus, ComplaintStatus, ComplaintPriority, AnnouncementStatus } from '../../types';

interface StatusBadgeProps {
  status: HospitalStatus | ComplaintStatus | ComplaintPriority | AnnouncementStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status?.toLowerCase() || '';
  let badgeClass = 'badge';

  if (s === 'approved' || s === 'active') {
    badgeClass += ' badge-approved';
  } else if (s === 'pending') {
    badgeClass += ' badge-pending';
  } else if (s === 'rejected') {
    badgeClass += ' badge-rejected';
  } else if (s === 'suspended') {
    badgeClass += ' badge-suspended';
  } else if (s === 'open') {
    badgeClass += ' badge-open';
  } else if (s === 'in progress') {
    badgeClass += ' badge-inprogress';
  } else if (s === 'resolved') {
    badgeClass += ' badge-resolved';
  } else if (s === 'urgent' || s === 'escalated') {
    badgeClass += ' badge-urgent';
  } else if (s === 'high') {
    badgeClass += ' badge-pending';
  } else if (s === 'medium') {
    badgeClass += ' badge-open';
  } else if (s === 'published') {
    badgeClass += ' badge-published';
  } else if (s === 'draft') {
    badgeClass += ' badge-draft';
  } else if (s === 'archived') {
    badgeClass += ' badge-archived';
  } else {
    badgeClass += ' badge-draft';
  }

  const styleOverride = size === 'sm' ? { fontSize: 10, padding: '2px 8px' } : undefined;

  return (
    <span className={badgeClass} style={styleOverride}>
      <span className="badge-dot" />
      {status}
    </span>
  );
};
