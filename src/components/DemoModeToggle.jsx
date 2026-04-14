// ─── Demo Mode Toggle ─────────────────────────
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DemoModeToggle() {
  const { demoMode, toggleDemoMode } = useAuth();

  return (
    <button
      onClick={toggleDemoMode}
      title={demoMode ? 'Exit demo mode' : 'Enter demo mode'}
      style={{
        background: demoMode ? 'var(--neev-gold)' : 'transparent',
        color: demoMode ? 'var(--neev-navy)' : 'var(--neev-gold)',
        border: '1px solid var(--neev-gold)',
        borderRadius: 6,
        padding: '4px 12px',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '0.78rem',
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: '0.04em',
        transition: 'all 0.15s',
      }}
    >
      {demoMode ? '⚡ Demo ON' : 'Demo OFF'}
    </button>
  );
}
