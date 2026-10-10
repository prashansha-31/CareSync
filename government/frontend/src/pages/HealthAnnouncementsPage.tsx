import React, { useState, useEffect, useMemo } from 'react';
import { Announcement, AnnouncementStatus } from '../types';
import { announcementService } from '../services/announcementService';
import { AnnouncementList } from '../components/announcements/AnnouncementList';
import { AnnouncementFormModal } from '../components/announcements/AnnouncementFormModal';
import { AnnouncementPreviewModal } from '../components/announcements/AnnouncementPreviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { Plus, Search } from 'lucide-react';

export const HealthAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AnnouncementStatus>('All');

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [previewAnnouncement, setPreviewAnnouncement] = useState<Announcement | null>(null);

  // Confirmations
  const [publishTarget, setPublishTarget] = useState<Announcement | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Announcement | null>(null);

  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = announcementService.subscribe((updated) => setAnnouncements(updated));
    return () => unsub();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [announcements, searchTerm, statusFilter]);

  const handleSave = async (data: Partial<Announcement>) => {
    try {
      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement.id, data);
        success('Advisory Updated', `"${data.title}" saved successfully.`);
      } else {
        await announcementService.createAnnouncement(
          data as Omit<Announcement, 'id' | 'createdDate'>
        );
        success('Advisory Issued', `"${data.title}" successfully registered.`);
      }
      setFormOpen(false);
      setEditingAnnouncement(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving advisory';
      error('Action Failed', msg);
    }
  };

  const handleConfirmPublish = async () => {
    if (!publishTarget) return;
    try {
      await announcementService.setStatus(publishTarget.id, 'Published');
      success('Directive Published', `"${publishTarget.title}" broadcast to healthcare facilities.`);
      setPublishTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error publishing directive';
      error('Action Failed', msg);
    }
  };

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return;
    try {
      await announcementService.setStatus(archiveTarget.id, 'Archived');
      success('Directive Archived', `"${archiveTarget.title}" moved to official archives.`);
      setArchiveTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error archiving directive';
      error('Action Failed', msg);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Loading Health Advisories...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Public Health Directives & Advisories
          </h1>
          <p style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 4 }}>
            Publish statutory disease outbreak alerts, immunization schedules, and clinical compliance protocols.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAnnouncement(null);
            setFormOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span>Draft New Advisory</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-row">
          <div className="search-input-wrapper">
            <Search className="search-input-icon" style={{ width: 16, height: 16 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search directives by keyword or order ref..."
              className="form-control search-input"
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {(['All', 'Published', 'Draft', 'Archived'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={statusFilter === tab ? 'btn btn-dark btn-sm' : 'btn btn-outline btn-sm'}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <AnnouncementList
        announcements={filteredAnnouncements}
        onPreview={(a) => setPreviewAnnouncement(a)}
        onEdit={(a) => {
          setEditingAnnouncement(a);
          setFormOpen(true);
        }}
        onPublishPrompt={(a) => setPublishTarget(a)}
        onArchivePrompt={(a) => setArchiveTarget(a)}
        onDraftClick={() => {
          setEditingAnnouncement(null);
          setFormOpen(true);
        }}
      />

      {/* Create / Edit Modal */}
      <AnnouncementFormModal
        isOpen={formOpen}
        editingAnnouncement={editingAnnouncement}
        onClose={() => {
          setFormOpen(false);
          setEditingAnnouncement(null);
        }}
        onSave={handleSave}
      />

      {/* Gazette Preview Modal */}
      <AnnouncementPreviewModal
        announcement={previewAnnouncement}
        onClose={() => setPreviewAnnouncement(null)}
      />

      {/* Confirm Publish */}
      <ConfirmDialog
        isOpen={!!publishTarget}
        title="Publish Health Advisory?"
        message={`Confirm publishing "${publishTarget?.title}". This will broadcast the directive across the CareSync network.`}
        confirmLabel="Confirm & Publish"
        variant="success"
        onConfirm={handleConfirmPublish}
        onCancel={() => setPublishTarget(null)}
      />

      {/* Confirm Archive */}
      <ConfirmDialog
        isOpen={!!archiveTarget}
        title="Archive Health Advisory"
        message={`Move "${archiveTarget?.title}" to historical archives?`}
        confirmLabel="Move to Archives"
        variant="warning"
        onConfirm={handleConfirmArchive}
        onCancel={() => setArchiveTarget(null)}
      />
    </div>
  );
};
