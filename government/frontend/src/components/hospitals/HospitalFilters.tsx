import React from 'react';
import { Search, RotateCcw, X } from 'lucide-react';

interface HospitalFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDistrict: string;
  onDistrictChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  districts: string[];
  totalResults: number;
  onResetFilters: () => void;
}

export const HospitalFilters: React.FC<HospitalFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedDistrict,
  onDistrictChange,
  selectedStatus,
  onStatusChange,
  districts,
  totalResults,
  onResetFilters,
}) => {
  const hasActiveFilters = searchTerm !== '' || selectedDistrict !== 'all' || selectedStatus !== 'all';

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search className="search-input-icon" style={{ width: 16, height: 16 }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by hospital name, registration number, or license..."
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

        {/* District Selector */}
        <div style={{ minWidth: 160 }}>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="form-control"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div style={{ minWidth: 160 }}>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="form-control"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved / Active</option>
            <option value="Rejected">Rejected</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={onResetFilters} className="btn btn-outline btn-sm">
            <RotateCcw style={{ width: 12, height: 12 }} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--slate-500)', paddingTop: 4, borderTop: '1px solid var(--slate-100)' }}>
        <span>Found <strong>{totalResults}</strong> hospitals matching filters</span>
        <span style={{ color: 'var(--teal-600)', fontWeight: 600 }}>State Clinical Establishments Registry</span>
      </div>
    </div>
  );
};
