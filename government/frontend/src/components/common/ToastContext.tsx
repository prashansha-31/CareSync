import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast({ type: 'success', title, message }),
    [showToast]
  );
  const error = useCallback(
    (title: string, message?: string) => showToast({ type: 'error', title, message }),
    [showToast]
  );
  const warning = useCallback(
    (title: string, message?: string) => showToast({ type: 'warning', title, message }),
    [showToast]
  );
  const info = useCallback(
    (title: string, message?: string) => showToast({ type: 'info', title, message }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, warning, info }}
    >
      {children}
      <div className="toast-container" aria-live="assertive">
        {toasts.map((toast) => {
          let icon = <Info style={{ width: 18, height: 18, color: 'var(--teal-600)', flexShrink: 0 }} />;
          let toastClass = 'toast-item toast-info';

          if (toast.type === 'success') {
            toastClass = 'toast-item toast-success';
            icon = <CheckCircle2 style={{ width: 18, height: 18, color: 'var(--emerald-600)', flexShrink: 0 }} />;
          } else if (toast.type === 'error') {
            toastClass = 'toast-item toast-error';
            icon = <AlertCircle style={{ width: 18, height: 18, color: 'var(--rose-600)', flexShrink: 0 }} />;
          } else if (toast.type === 'warning') {
            toastClass = 'toast-item toast-warning';
            icon = <AlertTriangle style={{ width: 18, height: 18, color: 'var(--amber-600)', flexShrink: 0 }} />;
          }

          return (
            <div key={toast.id} className={toastClass} role="alert">
              {icon}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{toast.title}</p>
                {toast.message && (
                  <p style={{ fontSize: 11, color: 'var(--slate-600)', marginTop: 2, margin: 0 }}>
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: 2 }}
                aria-label="Dismiss notification"
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
