import React from 'react';
import { Announcement } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Megaphone,
  Eye,
  Edit3,
  Archive,
  Send,
  Users,
  MapPin,
} from 'lucide-react';

interface AnnouncementListProps {
  announcements: Announcement[];
  onPreview: (announcement: Announcement) => void;
  onEdit: (announcement: Announcement) => void;
  onPublishPrompt: (announcement: Announcement) => void;
  onArchivePrompt: (announcement: Announcement) => void;
  onDraftClick?: () => void;
}

export const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onPreview,
  onEdit,
  onPublishPrompt,
  onArchivePrompt,
  onDraftClick,
}) => {
  if (announcements.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <Megaphone style={{ width: 28, height: 28 }} />
          </div>
          <h3 className="empty-state-title">No Advisories Issued</h3>
          <p className="empty-state-desc">
            No public health directives, outbreak warnings, or policy updates currently exist.
          </p>
          {onDraftClick && (
            <button onClick={onDraftClick} className="btn btn-primary" style={{ marginTop: 8 }}>
              Draft New Advisory
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
      {announcements.map((ann) => {
        const isDraft = ann.status === 'Draft';
        const isPublished = ann.status === 'Published';

        return (
          <div key={ann.id} className="card" style={{ justifyContent: 'space-between' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--slate-100)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    {ann.referenceNumber}
                  </span>
                  <StatusBadge status={ann.priority} size="sm" />
                </div>
                <StatusBadge status={ann.status} size="sm" />
              </div>

              {/* Title & Summary */}
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                {ann.title}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--slate-600)', margin: 0, lineHeight: 1.5 }}>
                {ann.summary}
              </p>

              {/* Metadata */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--slate-100)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: 'var(--slate-500)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users style={{ width: 14, height: 14, color: 'var(--teal-600)' }} />
                  <span>Audience: <strong>{ann.targetAudience}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin style={{ width: 14, height: 14, color: 'var(--teal-600)' }} />
                  <span>Districts: {ann.targetDistricts.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--slate-400)', paddingTop: 4 }}>
                  <span>By: {ann.author}</span>
                  <span>{ann.publishedDate ? `Published: ${ann.publishedDate}` : `Draft: ${ann.createdDate}`}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => onPreview(ann)} className="btn btn-outline btn-sm">
                <Eye style={{ width: 13, height: 13 }} />
                <span>Gazette Preview</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => onEdit(ann)} className="btn btn-outline btn-sm" title="Edit">
                  <Edit3 style={{ width: 13, height: 13 }} />
                </button>

                {isDraft && (
                  <button onClick={() => onPublishPrompt(ann)} className="btn btn-primary btn-sm">
                    <Send style={{ width: 13, height: 13 }} />
                    <span>Publish</span>
                  </button>
                )}

                {isPublished && (
                  <button onClick={() => onArchivePrompt(ann)} className="btn btn-outline btn-sm" title="Archive">
                    <Archive style={{ width: 13, height: 13 }} />
                    <span>Archive</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
