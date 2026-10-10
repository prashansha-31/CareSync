import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Complaint, ComplaintStatus, StaffMember, Hospital } from '../types';
import { complaintService } from '../services/complaintService';
import { staffService } from '../services/staffService';
import { hospitalService } from '../services/hospitalService';
import { ComplaintFilters } from '../components/complaints/ComplaintFilters';
import { ComplaintTable } from '../components/complaints/ComplaintTable';
import { ComplaintDetailsDrawer } from '../components/complaints/ComplaintDetailsDrawer';
import { ComplaintRegisterModal } from '../components/complaints/ComplaintRegisterModal';
import { Pagination } from '../components/common/Pagination';
import { useToast } from '../hooks/useToast';
import { AlertCircle, Clock, Plus } from 'lucide-react';

export const ComplaintManagementPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected complaint for drawer inspection
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const [c, s, h] = await Promise.all([
        complaintService.getComplaints(),
        staffService.getStaffMembers(),
        hospitalService.getHospitals(),
      ]);
      setComplaints(c);
      setStaffList(s);
      setHospitals(h);

      const queryId = searchParams.get('id');
      if (queryId) {
        const found = c.find((item) => item.id === queryId);
        if (found) setSelectedComplaint(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = complaintService.subscribe((updated) => {
      setComplaints(updated);
      if (selectedComplaint) {
        const updatedSelected = updated.find((c) => c.id === selectedComplaint.id);
        if (updatedSelected) setSelectedComplaint(updatedSelected);
      }
    });
    return () => unsub();
  }, [selectedComplaint]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, searchTerm, statusFilter, priorityFilter]);

  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredComplaints.slice(start, start + pageSize);
  }, [filteredComplaints, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCurrentPage(1);
  };

  const handleLogComplaint = async (data: any) => {
    try {
      const newC = await complaintService.createComplaint(data);
      success('Grievance Logged', `Case #${newC.id} registered for investigation.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error logging grievance';
      error('Action Failed', msg);
    }
  };

  const handleUpdateStatus = async (id: string, status: ComplaintStatus, notes?: string) => {
    try {
      const updated = await complaintService.updateStatus(id, status, notes);
      setSelectedComplaint(updated);
      success('Status Updated', `Grievance #${id} moved to "${status}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating status';
      error('Action Failed', msg);
    }
  };

  const handleAssignStaff = async (id: string, staffName: string) => {
    try {
      const updated = await complaintService.assignToStaff(id, staffName);
      setSelectedComplaint(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error assigning officer';
      error('Action Failed', msg);
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      const updated = await complaintService.addResolutionNotes(id, notes);
      setSelectedComplaint(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving notes';
      error('Action Failed', msg);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Loading Grievance Redressal...</p>
      </div>
    );
  }

  const urgentCount = complaints.filter((c) => c.priority === 'Urgent').length;
  const activeCount = complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Citizen & Clinical Grievance Redressal
          </h1>
          <p style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 4 }}>
            Investigate reported medical negligence, overcharging, emergency denial, and sanitation violations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-urgent">
            <AlertCircle style={{ width: 12, height: 12 }} />
            {urgentCount} Urgent SLA
          </span>
          <span className="badge badge-open">
            <Clock style={{ width: 12, height: 12 }} />
            {activeCount} Active Cases
          </span>
          <button onClick={() => setRegisterModalOpen(true)} className="btn btn-primary">
            <Plus style={{ width: 14, height: 14 }} />
            <span>Log Grievance</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <ComplaintFilters
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setCurrentPage(1);
        }}
        priorityFilter={priorityFilter}
        onPriorityChange={(v) => {
          setPriorityFilter(v);
          setCurrentPage(1);
        }}
        totalResults={filteredComplaints.length}
        onReset={handleResetFilters}
      />

      {/* Table & Pagination */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ComplaintTable
          complaints={paginatedComplaints}
          onSelectComplaint={(c) => setSelectedComplaint(c)}
          onLogClick={() => setRegisterModalOpen(true)}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredComplaints.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Details Drawer */}
      <ComplaintDetailsDrawer
        complaint={selectedComplaint}
        staffList={staffList}
        onClose={() => setSelectedComplaint(null)}
        onUpdateStatus={handleUpdateStatus}
        onAssignStaff={handleAssignStaff}
        onSaveNotes={handleSaveNotes}
      />

      {/* Register Complaint Modal */}
      <ComplaintRegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegister={handleLogComplaint}
        hospitals={hospitals}
      />
    </div>
  );
};
