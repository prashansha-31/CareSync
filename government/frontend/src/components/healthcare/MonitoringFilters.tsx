import React from 'react';
import { Search, RotateCcw, X } from 'lucide-react';

interface MonitoringFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDistrict: string;
  onDistrictChange: (value: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (value: string) => void;
  districts: string[];
  totalResults: number;
  onReset: () => void;
}

export const MonitoringFilters: React.FC<MonitoringFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedDistrict,
  onDistrictChange,
  selectedDateRange,
  onDateRangeChange,
  districts,
  totalResults,
  onReset,
}) => {
  const hasFilters = searchTerm !== '' || selectedDistrict !== 'all' || selectedDateRange !== 'today';

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
            placeholder="Search facility name or registration number..."
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

        {/* District */}
        <div style={{ minWidth: 160 }}>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="form-control"
          >
            <option value="all">All Health Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div style={{ minWidth: 160 }}>
          <select
            value={selectedDateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="form-control"
          >
            <option value="today">Latest Telemetry (Today)</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Last 7 Days (Average)</option>
            <option value="30d">Last 30 Days</option>
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
        <span>Showing <strong>{totalResults}</strong> facility capacity streams</span>
        <span style={{ color: 'var(--teal-600)', fontWeight: 600 }}>Real-time telemetry</span>
      </div>
    </div>
  );
};
