import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger' | 'warning' | 'success';
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'primary',
  requireReason = false,
  reasonLabel = 'Provide Mandatory Reason',
  reasonPlaceholder = 'Enter official rationale...',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setReasonError('A justification or reason is strictly required for this administrative action.');
      return;
    }
    setReasonError('');
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    setReasonError('');
    onCancel();
  };

  let confirmBtnClass = 'btn btn-primary';
  if (variant === 'danger') confirmBtnClass = 'btn btn-danger';
  else if (variant === 'warning') confirmBtnClass = 'btn btn-danger';
  else if (variant === 'success') confirmBtnClass = 'btn btn-primary';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title" style={{ fontSize: 16 }}>{title}</h3>
            <p className="modal-subtitle">{message}</p>
          </div>
          <button onClick={handleClose} className="modal-close-btn" aria-label="Close dialog">
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {requireReason && (
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="form-label">
              {reasonLabel} <span style={{ color: 'var(--rose-600)' }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError('');
              }}
              rows={3}
              placeholder={reasonPlaceholder}
              className="form-control"
              style={{ resize: 'vertical' }}
            />
            {reasonError && (
              <span style={{ fontSize: 11, color: 'var(--rose-600)', fontWeight: 600 }}>
                {reasonError}
              </span>
            )}
          </div>
        )}

        <div className="modal-footer">
          <button type="button" onClick={handleClose} className="btn btn-outline">
            {cancelLabel}
          </button>
          <button type="button" onClick={handleConfirm} className={confirmBtnClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
