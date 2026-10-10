import React from 'react';
import { Announcement } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { X, ShieldCheck } from 'lucide-react';

interface AnnouncementPreviewModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export const AnnouncementPreviewModal: React.FC<AnnouncementPreviewModalProps> = ({
  announcement,
  onClose,
}) => {
  if (!announcement) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 640 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck style={{ width: 18, height: 18, color: 'var(--teal-300)' }} />
            <h2 className="modal-title" style={{ fontSize: 16 }}>Official Gazette Notification Preview</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Gazette Document */}
        <div className="modal-body" style={{ background: '#f8fafc', padding: 28, fontFamily: 'serif' }}>
          {/* Masthead */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid var(--slate-900)', paddingBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              National Healthcare Regulatory Authority
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--slate-500)', textTransform: 'uppercase', marginTop: 2 }}>
              Ministry of Health & Family Welfare &bull; Official Bulletin
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, marginTop: 8, color: 'var(--slate-700)' }}>
              Order No: {announcement.referenceNumber}
            </div>
          </div>

          {/* Metadata */}
          <div style={{ fontFamily: 'var(--font-sans)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--slate-600)', borderBottom: '1px solid var(--slate-200)', paddingBottom: 10 }}>
            <span>Date: <strong>{announcement.publishedDate || announcement.createdDate}</strong></span>
            <span>Status: <StatusBadge status={announcement.status} size="sm" /></span>
          </div>

          {/* Heading */}
          <div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--teal-600)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              {announcement.category} &bull; Priority: {announcement.priority}
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--slate-950)', margin: 0, lineHeight: 1.4 }}>
              {announcement.title}
            </h2>
          </div>

          {/* Abstract */}
          <div style={{ padding: 12, background: 'white', borderRadius: 8, borderLeft: '3px solid var(--teal-600)', fontStyle: 'italic', fontSize: 12, lineHeight: 1.6, color: 'var(--slate-800)' }}>
            <strong>Executive Abstract:</strong> {announcement.summary}
          </div>

          {/* Text */}
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.7, color: 'var(--slate-900)', whiteSpace: 'pre-line' }}>
            {announcement.content}
          </div>

          {/* Signatory */}
          <div style={{ fontFamily: 'var(--font-sans)', paddingTop: 20, borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 11 }}>
            <span style={{ color: 'var(--slate-500)' }}>Audience: {announcement.targetAudience}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontStyle: 'italic', color: 'var(--slate-600)' }}>Digitally Authenticated</div>
              <strong style={{ display: 'block', marginTop: 2, fontSize: 12 }}>{announcement.author}</strong>
              <span style={{ color: 'var(--slate-500)', fontSize: 10 }}>Competent Regulatory Authority</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-outline">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
