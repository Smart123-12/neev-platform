// ─── NGO Dashboard ────────────────────────────
import React, { useState, useEffect } from 'react';
import NeedCard from '../components/NeedCard';
import NeedForm from '../components/NeedForm';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEMO_NEEDS, DEMO_NGO, MOCK_IMPACT_REPORT } from '../services/demoData';

export default function NGODashboard() {
  const { user, demoMode } = useAuth();
  const { addToast } = useToast();
  const [needs, setNeeds]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [impactReport, setReport] = useState(null);
  const [reportLoading, setRL]    = useState(false);

  const ngo = demoMode ? DEMO_NGO : user;

  // ── Load needs ──────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (demoMode) {
          await new Promise((r) => setTimeout(r, 700));
          setNeeds(DEMO_NEEDS);
        } else {
          const { getNeedsByNgo } = await import('../services/firebaseService');
          const data = await getNeedsByNgo(user.uid);
          setNeeds(data);
        }
      } catch (e) {
        addToast('Failed to load needs', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, user?.uid]);

  // ── Post new need ────────────────────────────
  const handlePostNeed = async (formData) => {
    try {
      const newNeed = {
        id: `need_${Date.now()}`,
        ngoId: ngo.id,
        ngoName: ngo.name,
        ...formData,
        location: { city: formData.city, lat: null, lng: null },
        volunteersAssigned: [],
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      if (demoMode) {
        setNeeds((prev) => [newNeed, ...prev]);
      } else {
        const { createNeed } = await import('../services/firebaseService');
        const id = await createNeed({ ...newNeed, ngoId: user.uid });
        setNeeds((prev) => [{ ...newNeed, id }, ...prev]);
      }

      setShowForm(false);
      addToast('Need posted successfully ✓', 'success');
    } catch (e) {
      addToast('Failed to post need', 'error');
      console.error(e);
    }
  };

  // ── AI Impact Report ─────────────────────────
  const handleImpactReport = async () => {
    setRL(true);
    try {
      if (demoMode) {
        await new Promise((r) => setTimeout(r, 2000));
        setReport(MOCK_IMPACT_REPORT);
      } else {
        const { generateImpactReport } = await import('../services/geminiService');
        const completed = needs.filter((n) => n.status === 'completed');
        const text = await generateImpactReport(completed);
        setReport(text);
      }
      addToast('Impact report generated ✓', 'success');
    } catch (e) {
      addToast('Failed to generate report', 'error');
    } finally {
      setRL(false);
    }
  };

  // ── Metrics ──────────────────────────────────
  const totalNeeds       = needs.length;
  const activeVolunteers = needs.reduce((a, n) => a + (n.volunteersAssigned?.length ?? 0), 0);
  const completed        = needs.filter((n) => n.status === 'completed').length;
  const impactScore      = ngo?.impactScore ?? 0;

  const METRICS = [
    { label: 'Total Needs Posted',  value: totalNeeds,       icon: '📋' },
    { label: 'Active Volunteers',   value: activeVolunteers,  icon: '🤲' },
    { label: 'Tasks Completed',     value: completed,          icon: '✅' },
    { label: 'Impact Score',        value: `${impactScore}/100`, icon: '⭐' },
  ];

  return (
    <div className="page-enter min-h-screen" style={{ background: 'var(--neev-cream)' }}>
      {/* ── Sub-header ── */}
      <div
        style={{
          background: 'var(--neev-navy)',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2
              style={{
                fontFamily: '"Playfair Display", serif',
                color: 'var(--neev-gold)',
                margin: 0,
                fontSize: '1.2rem',
              }}
            >
              {ngo?.name || 'NGO Dashboard'}
            </h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--neev-slate)', fontSize: '0.8rem', margin: 0 }}>
              {ngo?.city} · {ngo?.email}
            </p>
          </div>
          <button
            id="post-need-btn"
            className="btn-primary"
            onClick={() => setShowForm(true)}
            style={{ padding: '0.6rem 1.4rem' }}
          >
            + Post New Need
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {METRICS.map((m) => (
            <div key={m.label} className="metric-card">
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{m.icon}</div>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: 'var(--neev-navy)',
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.75rem',
                  color: 'var(--neev-slate)',
                  marginTop: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Impact Report ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--neev-navy)', margin: 0, fontSize: '1.1rem' }}>
              AI Monthly Impact Report
            </h3>
            <button
              id="impact-report-btn"
              className="btn-outline"
              onClick={handleImpactReport}
              disabled={reportLoading}
              style={{ fontSize: '0.82rem' }}
            >
              {reportLoading ? '⟳ Generating…' : '✦ Generate with Gemini'}
            </button>
          </div>
          {impactReport && (
            <div
              className="neev-card page-enter"
              style={{ borderLeft: '3px solid var(--neev-gold)', padding: '1.1rem 1.4rem' }}
            >
              <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--neev-ink)', lineHeight: 1.8, margin: 0, fontSize: '0.9rem' }}>
                {impactReport}
              </p>
            </div>
          )}
        </div>

        {/* ── Needs List ── */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--neev-navy)', margin: 0, fontSize: '1.1rem' }}>
            Community Needs ({needs.length})
          </h3>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : needs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--neev-slate)' }}>
            <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.1rem', marginBottom: 12 }}>
              No needs posted yet.
            </p>
            <button className="btn-gold-outline btn-outline" onClick={() => setShowForm(true)}>
              + Post your first need
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {needs.map((need) => (
              <NeedCard key={need.id} need={need} showMatchBtn />
            ))}
          </div>
        )}
      </div>

      {/* ── Slide-in Form ── */}
      {showForm && (
        <NeedForm
          onSubmit={handlePostNeed}
          onClose={() => setShowForm(false)}
          ngoName={ngo?.name || 'NGO'}
        />
      )}
    </div>
  );
}
