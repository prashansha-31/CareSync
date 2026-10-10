import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Hospital, HospitalStatus } from '../types';
import { hospitalService } from '../services/hospitalService';
import { useToast } from '../hooks/useToast';
import { HospitalFilters } from '../components/hospitals/HospitalFilters';
import { HospitalTable } from '../components/hospitals/HospitalTable';
import { HospitalDetailsModal } from '../components/hospitals/HospitalDetailsModal';
import { HospitalReviewModal } from '../components/hospitals/HospitalReviewModal';
import { HospitalRegisterModal } from '../components/hospitals/HospitalRegisterModal';
import { Pagination } from '../components/common/Pagination';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Plus, CheckCircle2, Clock } from 'lucide-react';
import { STANDARD_DISTRICTS } from '../data/mockHealthcareCapacity';

export const HospitalManagementPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get('filter') || 'all'
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [reviewHospital, setReviewHospital] = useState<Hospital | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Confirmation dialogs state
  const [approveConfirmTarget, setApproveConfirmTarget] = useState<Hospital | null>(null);
  const [rejectPromptTarget, setRejectPromptTarget] = useState<Hospital | null>(null);
  const [suspendPromptTarget, setSuspendPromptTarget] = useState<Hospital | null>(null);

  const { success, warning, error } = useToast();

  const loadData = async () => {
    try {
      const data = await hospitalService.getHospitals();
      setHospitals(data);

      const reviewId = searchParams.get('review');
      if (reviewId) {
        const found = data.find((h) => h.id === reviewId);
        if (found) {
          if (found.status === 'Pending') {
            setReviewHospital(found);
          } else {
            setSelectedHospital(found);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = hospitalService.subscribe((updated) => {
      setHospitals(updated);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      setSelectedStatus(filter);
    }
  }, [searchParams]);

  const districts = useMemo(() => {
    const set = new Set<string>(STANDARD_DISTRICTS);
    hospitals.forEach((h) => set.add(h.district));
    return Array.from(set).sort();
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict =
        selectedDistrict === 'all' || h.district === selectedDistrict;

      const matchesStatus =
        selectedStatus === 'all' || h.status === selectedStatus;

      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [hospitals, searchTerm, selectedDistrict, selectedStatus]);

  const paginatedHospitals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHospitals.slice(start, start + pageSize);
  }, [filteredHospitals, currentPage, pageSize]);

  const handleFilterChange = (type: 'search' | 'district' | 'status', value: string) => {
    setCurrentPage(1);
    if (type === 'search') setSearchTerm(value);
    if (type === 'district') setSelectedDistrict(value);
    if (type === 'status') {
      setSelectedStatus(value);
      if (value === 'all') {
        searchParams.delete('filter');
        setSearchParams(searchParams);
      } else {
        setSearchParams({ filter: value });
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('all');
    setSelectedStatus('all');
    setCurrentPage(1);
    searchParams.delete('filter');
    setSearchParams(searchParams);
  };

  const handleRegisterHospital = async (data: any) => {
    try {
      const newHosp = await hospitalService.registerHospital(data);
      success('Hospital Registered', `${newHosp.name} added to the state registry.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      error('Action Failed', msg);
    }
  };

  const handleApproveConfirm = async () => {
    if (!approveConfirmTarget) return;
    try {
      await hospitalService.approveHospital(approveConfirmTarget.id);
      success(
        'License Granted & Approved',
        `${approveConfirmTarget.name} has been approved and added to active registry.`
      );
      setApproveConfirmTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Approval failed';
      error('Action Failed', msg);
    }
  };

  const handleRejectConfirm = async (reason?: string) => {
    if (!rejectPromptTarget || !reason) return;
    try {
      await hospitalService.rejectHospital(rejectPromptTarget.id, reason);
      warning(
        'Application Declined',
        `${rejectPromptTarget.name} application was officially rejected with stated grounds.`
      );
      setRejectPromptTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rejection failed';
      error('Action Failed', msg);
    }
  };

  const handleSuspendConfirm = async (reason?: string) => {
    if (!suspendPromptTarget || !reason) return;
    try {
      await hospitalService.suspendHospital(suspendPromptTarget.id, reason);
      warning(
        'License Suspended',
        `${suspendPromptTarget.name} license suspended. Triage stopped.`
      );
      setSuspendPromptTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Suspension failed';
      error('Action Failed', msg);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Loading Hospital Registry...</p>
      </div>
    );
  }

  const pendingCount = hospitals.filter((h) => h.status === 'Pending').length;
  const approvedCount = hospitals.filter((h) => h.status === 'Approved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Hospital Licensing & Accreditation
          </h1>
          <p style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 4 }}>
            Review new clinical establishments, verify statutory clearances, and manage regulatory accreditation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-pending">
            <Clock style={{ width: 12, height: 12 }} />
            {pendingCount} Pending Review
          </span>
          <span className="badge badge-approved">
            <CheckCircle2 style={{ width: 12, height: 12 }} />
            {approvedCount} Active Licensed
          </span>
          <button onClick={() => setRegisterModalOpen(true)} className="btn btn-primary">
            <Plus style={{ width: 14, height: 14 }} />
            <span>Register Hospital</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <HospitalFilters
        searchTerm={searchTerm}
        onSearchChange={(v) => handleFilterChange('search', v)}
        selectedDistrict={selectedDistrict}
        onDistrictChange={(v) => handleFilterChange('district', v)}
        selectedStatus={selectedStatus}
        onStatusChange={(v) => handleFilterChange('status', v)}
        districts={districts}
        totalResults={filteredHospitals.length}
        onResetFilters={handleResetFilters}
      />

      {/* Table & Pagination */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <HospitalTable
          hospitals={paginatedHospitals}
          onViewDetails={(h) => setSelectedHospital(h)}
          onReviewApplication={(h) => setReviewHospital(h)}
          onSuspendPrompt={(h) => setSuspendPromptTarget(h)}
          onRegisterClick={() => setRegisterModalOpen(true)}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredHospitals.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>

      {/* Modals */}
      <HospitalDetailsModal
        hospital={selectedHospital}
        onClose={() => setSelectedHospital(null)}
        onStartReview={(h) => setReviewHospital(h)}
      />

      <HospitalReviewModal
        hospital={reviewHospital}
        onClose={() => setReviewHospital(null)}
        onApprove={(h) => setApproveConfirmTarget(h)}
        onRejectPrompt={(h) => setRejectPromptTarget(h)}
      />

      <HospitalRegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegister={handleRegisterHospital}
        districts={districts}
      />

      {/* Confirm Approve */}
      <ConfirmDialog
        isOpen={!!approveConfirmTarget}
        title="Approve Hospital Registration?"
        message={`Confirm licensing and accreditation for "${approveConfirmTarget?.name}". This authorizes full patient care admissions.`}
        confirmLabel="Grant License & Approve"
        variant="success"
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveConfirmTarget(null)}
      />

      {/* Confirm Reject */}
      <ConfirmDialog
        isOpen={!!rejectPromptTarget}
        title="Decline Hospital Application"
        message={`Reject registration application for "${rejectPromptTarget?.name}". A formal administrative ground is required.`}
        confirmLabel="Decline Application"
        variant="danger"
        requireReason={true}
        reasonLabel="Statutory Grounds for Rejection"
        reasonPlaceholder="e.g. Failure to comply with ICU oxygen reserve standards..."
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectPromptTarget(null)}
      />

      {/* Confirm Suspend */}
      <ConfirmDialog
        isOpen={!!suspendPromptTarget}
        title="Enforce Regulatory Suspension"
        message={`Suspending "${suspendPromptTarget?.name}" halts emergency admissions and marks reported bed capacity to zero.`}
        confirmLabel="Enforce Sanction"
        variant="warning"
        requireReason={true}
        reasonLabel="Order Number and Sanction Grounds"
        reasonPlaceholder="e.g. Repeated violation of emergency triage protocol..."
        onConfirm={handleSuspendConfirm}
        onCancel={() => setSuspendPromptTarget(null)}
      />
    </div>
  );
};
