import React, { useState, useEffect } from 'react';
import { StaffMember, ActivityLog } from '../types';
import { staffService } from '../services/staffService';
import { StaffDirectoryTable } from '../components/staff/StaffDirectoryTable';
import { ActivityLogTable } from '../components/staff/ActivityLogTable';
import { StaffRegisterModal } from '../components/staff/StaffRegisterModal';
import { Users2, History, UserPlus, Info } from 'lucide-react';

export const StaffActivityLogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'staff' | 'logs'>('staff');
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [s, l] = await Promise.all([
        staffService.getStaffMembers(),
        staffService.getActivityLogs(),
      ]);
      setStaffList(s);
      setLogs(l);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubLogs = staffService.subscribeLogs((updated) => setLogs(updated));
    const unsubStaff = staffService.subscribeStaff((updated) => setStaffList(updated));
    return () => {
      unsubLogs();
      unsubStaff();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid var(--teal-600)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Administrative Staff & Audit Trails</h1>
          <p className="page-subtitle">
            Directory of certified health officers and immutable regulatory audit trails.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 4,
              backgroundColor: 'var(--slate-200)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <button
              onClick={() => setActiveTab('staff')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: activeTab === 'staff' ? '#fff' : 'transparent',
                color: activeTab === 'staff' ? 'var(--slate-900)' : 'var(--slate-600)',
                boxShadow: activeTab === 'staff' ? 'var(--shadow-xs)' : 'none',
                border: 'none',
              }}
            >
              <Users2 style={{ width: 14, height: 14, marginRight: 6 }} />
              Staff Directory ({staffList.length})
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: activeTab === 'logs' ? '#fff' : 'transparent',
                color: activeTab === 'logs' ? 'var(--slate-900)' : 'var(--slate-600)',
                boxShadow: activeTab === 'logs' ? 'var(--shadow-xs)' : 'none',
                border: 'none',
              }}
            >
              <History style={{ width: 14, height: 14, marginRight: 6 }} />
              Audit Logs ({logs.length})
            </button>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="btn btn-primary"
          >
            <UserPlus style={{ width: 16, height: 16 }} />
            Add Staff Officer
          </button>
        </div>
      </div>

      {/* Production Notice */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Info style={{ width: 18, height: 18, flexShrink: 0, color: '#2563eb' }} />
        <div>
          <strong>Phase 1 Operating Mode:</strong> New officers and administrative actions are saved to persistent client state in real time. Backend synchronization with Firebase Firestore & Authentication will be connected in Phase 2.
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'staff' ? (
        <StaffDirectoryTable
          staffMembers={staffList}
          onAddClick={() => setIsRegisterModalOpen(true)}
        />
      ) : (
        <ActivityLogTable logs={logs} />
      )}

      {/* Commission Officer Modal */}
      <StaffRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
