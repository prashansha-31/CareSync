import React, { useState, useEffect, useMemo } from 'react';
import { DistrictCapacity, Hospital } from '../types';
import { monitoringService } from '../services/monitoringService';
import { hospitalService } from '../services/hospitalService';
import { CapacityMetricCards } from '../components/healthcare/CapacityMetricCards';
import { CapacityCharts } from '../components/healthcare/CapacityCharts';
import { MonitoringFilters } from '../components/healthcare/MonitoringFilters';
import { HospitalCapacityTable } from '../components/healthcare/HospitalCapacityTable';
import { Clock } from 'lucide-react';

export const HealthcareMonitoringPage: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictCapacity[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  const loadData = async () => {
    try {
      const [d, h] = await Promise.all([
        monitoringService.getDistrictCapacities(),
        hospitalService.getHospitals(),
      ]);
      setDistricts(d);
      setHospitals(h.filter((item) => item.status === 'Approved'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = monitoringService.subscribe((updated) => setDistricts(updated));
    const unsubHosp = hospitalService.subscribe((updated) => {
      setHospitals(updated.filter((item) => item.status === 'Approved'));
    });

    return () => {
      unsub();
      unsubHosp();
    };
  }, []);

  const districtNames = useMemo(() => {
    return districts.map((d) => d.district);
  }, [districts]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict =
        selectedDistrict === 'all' || h.district === selectedDistrict;
      return matchesSearch && matchesDistrict;
    });
  }, [hospitals, searchTerm, selectedDistrict]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('all');
    setSelectedDateRange('today');
  };

  if (loading) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Loading Capacity Telemetry...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Healthcare Capacity Oversight
          </h1>
          <p style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 4 }}>
            Reported bed inventory, ICU reserve buffers, and casualty emergency casualty telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--slate-600)', background: 'white', border: '1px solid var(--slate-200)', padding: '6px 14px', borderRadius: 10 }}>
          <Clock style={{ width: 14, height: 14, color: 'var(--teal-600)' }} />
          <span>Status: <strong>Live Telemetry Stream</strong></span>
        </div>
      </div>

      {/* KPI Cards */}
      <CapacityMetricCards districts={districts} />

      {/* Charts */}
      <CapacityCharts districts={districts} />

      {/* Filters */}
      <MonitoringFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        districts={districtNames}
        totalResults={filteredHospitals.length}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <HospitalCapacityTable hospitals={filteredHospitals} />
    </div>
  );
};
