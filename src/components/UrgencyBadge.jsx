// ─── Urgency Badge ────────────────────────────
import React from 'react';

export default function UrgencyBadge({ urgency }) {
  const cls =
    urgency === 'High'   ? 'badge-high' :
    urgency === 'Medium' ? 'badge-medium' :
                           'badge-low';
  return <span className={cls}>{urgency}</span>;
}
