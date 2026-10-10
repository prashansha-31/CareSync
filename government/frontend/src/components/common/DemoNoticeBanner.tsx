import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Regulatory Portal Environment" className="demo-banner">
      <div className="demo-banner-content">
        <span className="demo-badge-pill">
          <ShieldAlert style={{ width: 12, height: 12 }} /> Demo Preview
        </span>
        <p style={{ fontSize: 12, margin: 0 }}>
          <strong style={{ color: '#ffffff' }}>CareSync Government Portal:</strong>{' '}
          Interactive demo mode. You can register hospitals, monitor healthcare capacity, and review complaints in real time.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="demo-banner-btn"
        title="Dismiss notice"
      >
        <X style={{ width: 14, height: 14 }} />
      </button>
    </aside>
  );
};
