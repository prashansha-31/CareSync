import React, { useState, useEffect } from 'react';
import { Announcement, AnnouncementCategory } from '../../types';
import { X, Megaphone, Save, AlertCircle } from 'lucide-react';
import { STANDARD_DISTRICTS } from '../../data/mockHealthcareCapacity';

interface AnnouncementFormModalProps {
  isOpen: boolean;
  editingAnnouncement: Announcement | null;
  onClose: () => void;
  onSave: (data: Partial<Announcement>) => void;
}

const CATEGORIES: AnnouncementCategory[] = [
  'Disease Outbreak Alert',
  'Vaccination Drive',
  'Hospital Compliance Directive',
  'Emergency Healthcare Advisory',
  'Regulatory Policy Update',
];

export const AnnouncementFormModal: React.FC<AnnouncementFormModalProps> = ({
  isOpen,
  editingAnnouncement,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Disease Outbreak Alert');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('High');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Healthcare Facilities');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(STANDARD_DISTRICTS);
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');
  const [author, setAuthor] = useState('Government Health Authority');

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title);
      setReferenceNumber(editingAnnouncement.referenceNumber);
      setCategory(editingAnnouncement.category);
      setPriority(editingAnnouncement.priority);
      setSummary(editingAnnouncement.summary);
      setContent(editingAnnouncement.content);
      setTargetAudience(editingAnnouncement.targetAudience);
      setSelectedDistricts(editingAnnouncement.targetDistricts);
      setStatus(editingAnnouncement.status === 'Archived' ? 'Draft' : editingAnnouncement.status);
      setAuthor(editingAnnouncement.author);
    } else {
      setTitle('');
      setReferenceNumber(`DIR/NHA/NOTIF-${Date.now().toString().slice(-4)}`);
      setCategory('Disease Outbreak Alert');
      setPriority('High');
      setSummary('');
      setContent('');
      setTargetAudience('All Healthcare Facilities');
      setSelectedDistricts(STANDARD_DISTRICTS);
      setStatus('Published');
      setAuthor('Government Health Authority');
    }
    setFormError('');
  }, [editingAnnouncement, isOpen]);

  if (!isOpen) return null;

  const toggleDistrict = (district: string) => {
    if (selectedDistricts.includes(district)) {
      if (selectedDistricts.length > 1) {
        setSelectedDistricts(selectedDistricts.filter((d) => d !== district));
      }
    } else {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    setFormError('');
    onSave({
      title,
      referenceNumber,
      category,
      priority,
      summary,
      content,
      targetAudience,
      targetDistricts: selectedDistricts,
      status,
      author,
    });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {editingAnnouncement ? 'Edit Health Advisory' : 'Draft New Advisory'}
            </h2>
            <p className="modal-subtitle">Publish official guidelines, outbreak alerts, and compliance directives</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {formError && (
              <div style={{ padding: 10, background: 'var(--rose-50)', color: 'var(--rose-600)', borderRadius: 8, fontSize: 12 }}>
                {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Reference Number *</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Advisory Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                  className="form-control"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Title / Headline *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Hospital Bed Telemetry Sync Notice"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Executive Abstract *</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="Short summary for notifications and feeds..."
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Directives & Guidelines *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Full official text and guidelines..."
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="form-control"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent / Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div>
              <span className="form-label" style={{ marginBottom: 6, display: 'block' }}>Target Districts</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STANDARD_DISTRICTS.map((d) => {
                  const isSelected = selectedDistricts.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDistrict(d)}
                      className={isSelected ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Issuing Signatory</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publishing Action</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="form-control"
                >
                  <option value="Published">Publish Live Immediately</option>
                  <option value="Draft">Save as Internal Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save style={{ width: 14, height: 14 }} />
              <span>Save Advisory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
