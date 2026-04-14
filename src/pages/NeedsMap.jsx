// ─── Needs Map Page ───────────────────────────
import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import UrgencyBadge from '../components/UrgencyBadge';
import { DEMO_NEEDS } from '../services/demoData';
import { useAuth } from '../context/AuthContext';

const FILTERS = ['All', 'High', 'Medium', 'Low'];

export default function NeedsMap() {
  const { demoMode } = useAuth();
  const [needs, setNeeds]     = useState([]);
  const [filter, setFilter]   = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (demoMode) {
        await new Promise((r) => setTimeout(r, 400));
        setNeeds(DEMO_NEEDS);
      } else {
        try {
          const { getAllNeeds } = await import('../services/firebaseService');
          const data = await getAllNeeds();
          setNeeds(data);
        } catch (e) {
          setNeeds(DEMO_NEEDS);
        }
      }
      setLoading(false);
    }
    load();
  }, [demoMode]);

  const filtered = filter === 'All' ? needs : needs.filter((n) => n.urgency === filter);

  const URGENCY_DOT = { High: '#ef4444', Medium: '#f59e0b', Low: '#3b82f6' };

  return (
    <div className="page-enter" style={{ background: 'var(--neev-cream)', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Filter bar ── */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid var(--neev-mist)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', color: 'var(--neev-slate)', marginRight: 4 }}>
          Filter by urgency:
        </span>
        {FILTERS.map((f) => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'var(--neev-navy)' : 'var(--neev-mist)',
              color: filter === f ? 'var(--neev-gold)' : 'var(--neev-ink)',
              border: 'none',
              borderRadius: 20,
              padding: '4px 14px',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: filter === f ? 700 : 400,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {f !== 'All' && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: URGENCY_DOT[f], display: 'inline-block' }} />
            )}
            {f}
          </button>
        ))}
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.78rem',
            color: 'var(--neev-slate)',
          }}
        >
          {filtered.length} need{filtered.length !== 1 ? 's' : ''} shown
        </span>
      </div>

      {/* ── Map + sidebar layout ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        {/* Map */}
        <div style={{ flex: 1, padding: '1rem', minHeight: 400 }}>
          {loading ? (
            <div
              style={{
                height: '100%',
                minHeight: 400,
                background: 'var(--neev-mist)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--neev-slate)' }}>Loading map…</div>
            </div>
          ) : (
            <div style={{ height: '100%', minHeight: 400 }}>
              <MapView needs={filtered} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div
          style={{
            width: 300,
            overflowY: 'auto',
            borderLeft: '1px solid var(--neev-mist)',
            background: '#fff',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
          className="hidden md:flex"
        >
          <h3
            style={{
              fontFamily: '"Playfair Display", serif',
              color: 'var(--neev-navy)',
              fontSize: '1rem',
              margin: 0,
            }}
          >
            Community Needs
          </h3>
          {filtered.map((need) => (
            <div
              key={need.id}
              style={{
                background: 'var(--neev-cream)',
                border: '1px solid var(--neev-mist)',
                borderLeft: `3px solid ${URGENCY_DOT[need.urgency] || 'var(--neev-gold)'}`,
                borderRadius: 8,
                padding: '0.75rem 0.9rem',
                cursor: 'pointer',
                transition: 'box-shadow 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,31,53,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--neev-navy)', marginBottom: 3 }}>
                {need.title}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'var(--neev-slate)', marginBottom: 5 }}>
                {need.ngoName} · {need.location?.city}
              </div>
              <div className="flex items-center justify-between">
                <UrgencyBadge urgency={need.urgency} />
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', color: 'var(--neev-slate)' }}>
                  👥 {need.volunteersNeeded} needed
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: 'var(--neev-slate)', fontSize: '0.9rem', textAlign: 'center', marginTop: 24 }}>
              No needs match this filter.
            </p>
          )}
        </div>
      </div>

      {/* ── Legend ── */}
      <div
        style={{
          background: '#fff',
          borderTop: '1px solid var(--neev-mist)',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'var(--neev-slate)' }}>Map legend:</span>
        {Object.entries(URGENCY_DOT).map(([u, c]) => (
          <span key={u} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'var(--neev-ink)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
            {u} urgency
          </span>
        ))}
      </div>
    </div>
  );
}
