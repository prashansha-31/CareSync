import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { STANDARD_DISTRICTS } from '../../data/mockHealthcareCapacity';
import { staffService } from '../../services/staffService';
import { useToast } from '../common/ToastContext';
import { X, UserPlus, Shield, Mail, BadgeCheck, MapPin, Building } from 'lucide-react';

interface StaffRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StaffRegisterModal: React.FC<StaffRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    badgeId: '',
    email: '',
    role: 'District Health Inspector' as StaffMember['role'],
    department: 'Directorate of Health Services',
    district: STANDARD_DISTRICTS[0] || 'Central Delhi',
    status: 'Active' as StaffMember['status'],
    assignedCasesCount: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      error('Missing Information', 'Please enter an officer name and email');
      return;
    }

    setSubmitting(true);
    try {
      const generatedBadge =
        formData.badgeId.trim() ||
        `REG-${Math.floor(1000 + Math.random() * 9000)}`;

      await staffService.addStaffMember({
        name: formData.name.trim(),
        badgeId: generatedBadge,
        email: formData.email.trim(),
        role: formData.role,
        department: formData.department.trim(),
        district: formData.district,
        status: formData.status,
        assignedCasesCount: formData.assignedCasesCount,
      });

      await staffService.logActivity(
        'ADMIN_LOGIN',
        generatedBadge,
        `Commissioned officer ${formData.name.trim()} (${formData.role}) for ${formData.district}`
      );

      success('Officer Commissioned', `Officer ${formData.name} successfully commissioned`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      error('Failed to Commission Officer', 'Please verify input fields and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'var(--teal-50)',
                color: 'var(--teal-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <h3 className="modal-title">Commission Regulatory Officer</h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--slate-500)' }}>
                Add health commissioners, inspectors, or grievance adjudicators
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                Full Legal Name <span style={{ color: 'var(--rose-600)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">
                  Official Email Address <span style={{ color: 'var(--rose-600)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="officer@health.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Badge / Regulatory ID</label>
                <input
                  type="text"
                  placeholder="e.g., REG-8821 (auto-generated if empty)"
                  value={formData.badgeId}
                  onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Designation / Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as StaffMember['role'] })
                  }
                  className="form-select"
                >
                  <option value="District Health Inspector">District Health Inspector</option>
                  <option value="Senior Healthcare Regulator">Senior Healthcare Regulator</option>
                  <option value="Compliance & Audit Officer">Compliance & Audit Officer</option>
                  <option value="Grievance Redressal Officer">Grievance Redressal Officer</option>
                  <option value="Chief Medical Officer">Chief Medical Officer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Jurisdiction District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="form-select"
                >
                  {STANDARD_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Department / Wing</label>
                <input
                  type="text"
                  placeholder="e.g., Clinical Establishment Regulatory Wing"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Active Operational Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as StaffMember['status'] })
                  }
                  className="form-select"
                >
                  <option value="Active">Active Duty</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Commissioning...' : 'Commission Officer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
