import React, { useState } from 'react';
import { Complaint, ComplaintCategory, ComplaintPriority, Hospital } from '../../types';
import { X, AlertCircle, Save } from 'lucide-react';

interface ComplaintRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: Omit<Complaint, 'id' | 'submittedDate' | 'history'>) => void;
  hospitals: Hospital[];
}

const CATEGORIES: ComplaintCategory[] = [
  'Overcharging / Billing Irregularity',
  'Medical Negligence',
  'Infrastructure / Sanitation',
  'Staff Misconduct',
  'Denial of Emergency Care',
  'Essential Medicine Shortage',
];

export const ComplaintRegisterModal: React.FC<ComplaintRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  hospitals,
}) => {
  const [hospitalName, setHospitalName] = useState('');
  const [district, setDistrict] = useState('Central Metro');
  const [category, setCategory] = useState<ComplaintCategory>('Overcharging / Billing Irregularity');
  const [priority, setPriority] = useState<ComplaintPriority>('High');
  const [submittedBy, setSubmittedBy] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName || !description) return;

    onRegister({
      hospitalId: `HSP-EXT-${Date.now().toString().slice(-4)}`,
      hospitalName,
      district,
      category,
      priority,
      status: 'Open',
      submittedBy: submittedBy || 'Concerned Citizen',
      contactEmail: contactEmail || 'citizen@caresync.in',
      description,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Log Grievance / Complaint</h2>
            <p className="modal-subtitle">Submit a healthcare grievance claim to the Ombudsman register</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Hospital Name *</label>
                {hospitals.length > 0 ? (
                  <select
                    value={hospitalName}
                    onChange={(e) => {
                      setHospitalName(e.target.value);
                      const matched = hospitals.find((h) => h.name === e.target.value);
                      if (matched) setDistrict(matched.district);
                    }}
                    className="form-control"
                    required
                  >
                    <option value="">Select hospital facility...</option>
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.name}>
                        {h.name} ({h.district})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="Enter hospital name..."
                    className="form-control"
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">District Jurisdiction</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Grievance Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="form-control"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority SLA</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  className="form-control"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent SLA</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Complainant Name</label>
                <input
                  type="text"
                  value={submittedBy}
                  onChange={(e) => setSubmittedBy(e.target.value)}
                  placeholder="e.g. Patient / Relative Name"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Complainant Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@email.com"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description of Grievance *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide detailed incident particulars, dates, and evidence details..."
                className="form-control"
                style={{ resize: 'vertical' }}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save style={{ width: 14, height: 14 }} />
              <span>Log Grievance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
