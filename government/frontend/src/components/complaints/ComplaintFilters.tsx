import React from 'react';
import { Search, RotateCcw, X } from 'lucide-react';

interface ComplaintFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  priorityFilter: string;
  onPriorityChange: (val: string) => void;
  totalResults: number;
  onReset: () => void;
}

export const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  totalResults,
  onReset,
}) => {
  const hasFilters = searchTerm !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {/* Search */}
        <div className="search-input-wrapper">
          <Search className="search-input-icon" style={{ width: 16, height: 16 }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Complaint ID, hospital name, or category..."
            className="form-control search-input"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--slate-400)',
                cursor: 'pointer',
              }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div style={{ minWidth: 160 }}>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="form-control"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div style={{ minWidth: 160 }}>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="form-control"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent SLA</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {hasFilters && (
          <button onClick={onReset} className="btn btn-outline btn-sm">
            <RotateCcw style={{ width: 12, height: 12 }} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--slate-500)', paddingTop: 4, borderTop: '1px solid var(--slate-100)' }}>
        <span>Found <strong>{totalResults}</strong> grievances</span>
        <span style={{ color: 'var(--teal-600)', fontWeight: 600 }}>Citizen Ombudsman Registry</span>
      </div>
    </div>
  );
};
