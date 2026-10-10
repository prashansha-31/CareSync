import React, { useState } from 'react';
import { Hospital, HospitalCategory, OwnershipType, HospitalStatus } from '../../types';
import { X, Building2, Save } from 'lucide-react';

interface HospitalRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: Omit<Hospital, 'id' | 'appliedDate' | 'status'> & { status?: HospitalStatus }) => void;
  districts: string[];
}

export const HospitalRegisterModal: React.FC<HospitalRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  districts,
}) => {
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [district, setDistrict] = useState(districts[0] || 'Central Metro');
  const [state, setState] = useState('National Capital Region');
  const [category, setCategory] = useState<HospitalCategory>('Multi-Specialty');
  const [ownership, setOwnership] = useState<OwnershipType>('Private');
  const [status, setStatus] = useState<HospitalStatus>('Pending');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [totalBeds, setTotalBeds] = useState(250);
  const [availableBeds, setAvailableBeds] = useState(60);
  const [icuBeds, setIcuBeds] = useState(30);
  const [availableIcuBeds, setAvailableIcuBeds] = useState(8);
  const [ventilators, setVentilators] = useState(15);
  const [availableVentilators, setAvailableVentilators] = useState(4);
  const [emergencyServices, setEmergencyServices] = useState(true);
  const [ambulanceCount, setAmbulanceCount] = useState(4);
  const [accreditation, setAccreditation] = useState<'NABH Accredited' | 'JCI Accredited' | 'ISO 9001:2015' | 'State Certified' | 'Under Review'>('NABH Accredited');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !licenseNumber) return;

    onRegister({
      name,
      licenseNumber,
      registrationNumber: registrationNumber || `REG-${Date.now().toString().slice(-5)}`,
      district,
      state,
      category,
      ownership,
      status,
      contactPerson: contactPerson || 'Medical Director',
      phone: phone || '+91 11 2000 0000',
      email: email || 'admin@hospital.org',
      address: address || `${district} Main Road`,
      totalBeds: Number(totalBeds),
      availableBeds: Number(availableBeds),
      icuBeds: Number(icuBeds),
      availableIcuBeds: Number(availableIcuBeds),
      ventilators: Number(ventilators),
      availableVentilators: Number(availableVentilators),
      emergencyServices,
      ambulanceCount: Number(ambulanceCount),
      accreditation,
      documents: [
        { name: 'Clinical Establishment Registration Certificate', type: 'PDF', size: '2.4 MB', verified: true },
        { name: 'Fire Safety Clearance NOC', type: 'PDF', size: '1.8 MB', verified: true },
        { name: 'Bio-Medical Waste Authorization', type: 'PDF', size: '1.1 MB', verified: true },
      ],
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Register Hospital Facility</h2>
            <p className="modal-subtitle">Add a clinical establishment to the state regulatory registry</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Name & License */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Hospital Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. City General Hospital"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">License Number *</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. LIC-2026-081"
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* District & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="form-control"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Classification Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HospitalCategory)}
                  className="form-control"
                >
                  <option value="General Hospital">General Hospital</option>
                  <option value="Multi-Specialty">Multi-Specialty</option>
                  <option value="Super-Specialty">Super-Specialty</option>
                  <option value="District Hospital">District Hospital</option>
                  <option value="Community Health Center">Community Health Center</option>
                </select>
              </div>
            </div>

            {/* Ownership & Accreditation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Ownership Structure</label>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as OwnershipType)}
                  className="form-control"
                >
                  <option value="Government">Government / Public</option>
                  <option value="Private">Private</option>
                  <option value="Public-Private">Public-Private Partnership</option>
                  <option value="Trust / Non-Profit">Trust / Non-Profit</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Accreditation</label>
                <select
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value as any)}
                  className="form-control"
                >
                  <option value="NABH Accredited">NABH Accredited</option>
                  <option value="JCI Accredited">JCI Accredited</option>
                  <option value="ISO 9001:2015">ISO 9001:2015</option>
                  <option value="State Certified">State Certified</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>

            {/* Bed Capacities */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Total Beds</label>
                <input
                  type="number"
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(Number(e.target.value))}
                  className="form-control"
                  min={1}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Free Beds</label>
                <input
                  type="number"
                  value={availableBeds}
                  onChange={(e) => setAvailableBeds(Number(e.target.value))}
                  className="form-control"
                  min={0}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ICU Beds</label>
                <input
                  type="number"
                  value={icuBeds}
                  onChange={(e) => setIcuBeds(Number(e.target.value))}
                  className="form-control"
                  min={0}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Free ICUs</label>
                <input
                  type="number"
                  value={availableIcuBeds}
                  onChange={(e) => setAvailableIcuBeds(Number(e.target.value))}
                  className="form-control"
                  min={0}
                />
              </div>
            </div>

            {/* Emergency & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as HospitalStatus)}
                  className="form-control"
                >
                  <option value="Pending">Pending Regulatory Review</option>
                  <option value="Approved">Approved & Certified</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
                <input
                  type="checkbox"
                  id="erCheck"
                  checked={emergencyServices}
                  onChange={(e) => setEmergencyServices(e.target.checked)}
                />
                <label htmlFor="erCheck" style={{ fontSize: 13, fontWeight: 600 }}>
                  24/7 Emergency Casualty Operational
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save style={{ width: 14, height: 14 }} />
              <span>Register Hospital</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
