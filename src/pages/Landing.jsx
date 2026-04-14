// ─── Landing Page ─────────────────────────────
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { label: 'NGOs', value: '600+' },
  { label: 'Volunteers', value: '15,000' },
  { label: 'Cities', value: '9' },
  { label: 'Hours of Impact', value: '40,000' },
];

const FEATURES = [
  {
    icon: '📋',
    title: 'Post a Need',
    desc: 'NGOs describe community needs in seconds. NEEV structures it automatically using Gemini AI — no forms, no friction.',
  },
  {
    icon: '✦',
    title: 'AI Matching',
    desc: 'Gemini 1.5 Flash scores every volunteer against each need — considering skills, city, and availability — returning top 3 matches in seconds.',
  },
  {
    icon: '📈',
    title: 'Track Impact',
    desc: 'Volunteers track hours and tasks. NGOs receive monthly AI-generated impact reports highlighting community outcomes.',
  },
];

export default function Landing() {
  const navigate  = useNavigate();
  const { enableDemoAs } = useAuth();

  const goNgo  = () => { enableDemoAs('ngo');       navigate('/ngo'); };
  const goVol  = () => { enableDemoAs('volunteer'); navigate('/volunteer'); };

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <section
        style={{
          background: 'var(--neev-navy)',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 340, height: 340, background: 'rgba(201,168,76,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 260, height: 260, background: 'rgba(201,168,76,0.05)', borderRadius: '50%' }} />

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: 'clamp(3.5rem, 10vw, 5.5rem)',
            letterSpacing: '0.16em',
            color: 'var(--neev-gold)',
            margin: '0 0 0.6rem',
            lineHeight: 1,
            position: 'relative',
          }}
        >
          NEEV
        </h1>

        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(1rem, 3vw, 1.35rem)',
            color: 'var(--neev-mist)',
            letterSpacing: '0.04em',
            margin: '0 0 0.4rem',
            maxWidth: 560,
            position: 'relative',
          }}
        >
          Where community needs meet human purpose
        </p>

        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.85rem',
            color: 'var(--neev-slate)',
            margin: '0 0 2.5rem',
            position: 'relative',
          }}
        >
          Smart volunteer coordination for NGOs in India · Powered by Gemini AI
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center" style={{ position: 'relative' }}>
          <button
            id="cta-ngo"
            className="btn-primary"
            onClick={goNgo}
            style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
          >
            🏢 I represent an NGO
          </button>
          <button
            id="cta-volunteer"
            onClick={goVol}
            style={{
              background: 'transparent',
              color: 'var(--neev-gold)',
              border: '1px solid var(--neev-gold)',
              borderRadius: 6,
              padding: '0.75rem 2rem',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.target.style.background = 'var(--neev-gold)'; e.target.style.color = 'var(--neev-navy)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--neev-gold)'; }}
          >
            🤲 I want to volunteer
          </button>
        </div>

        {/* Divider line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--neev-gold), transparent)' }} />
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--neev-mist)', padding: '1.5rem 1rem' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: 'var(--neev-navy)',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.8rem',
                  color: 'var(--neev-slate)',
                  margin: '4px 0 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section style={{ background: 'var(--neev-cream)', padding: '4rem 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              textAlign: 'center',
              color: 'var(--neev-navy)',
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              marginBottom: '0.5rem',
            }}
          >
            Built for India's social sector
          </h2>
          <p
            style={{
              textAlign: 'center',
              fontFamily: '"DM Sans", sans-serif',
              color: 'var(--neev-slate)',
              fontSize: '0.95rem',
              marginBottom: '2.5rem',
            }}
          >
            NEEV bridges the gap between community urgency and volunteer availability using AI.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="neev-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: 12 }}>{f.icon}</span>
                <h3
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    color: 'var(--neev-navy)',
                    fontSize: '1.1rem',
                    margin: '0 0 8px',
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: 'var(--neev-slate)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ background: 'var(--neev-navy)', padding: '4rem 1.5rem' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              color: 'var(--neev-gold)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              marginBottom: '2rem',
            }}
          >
            How NEEV works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'NGO posts a need', desc: 'Describe the community need — location, urgency, required skills. NEEV structures it with Gemini AI.' },
              { step: '02', title: 'AI finds matches', desc: 'Gemini scores volunteers against the need. Top 3 matches appear with reasoning in seconds.' },
              { step: '03', title: 'Volunteer takes action', desc: 'Volunteer accepts task, completes it, logs impact hours. The community benefits.' },
            ].map((h) => (
              <div key={h.step} style={{ textAlign: 'center', padding: '1rem' }}>
                <div
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '2.5rem',
                    color: 'rgba(201,168,76,0.3)',
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {h.step}
                </div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--neev-gold)', fontSize: '1.05rem', margin: '0 0 8px' }}>
                  {h.title}
                </h3>
                <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--neev-mist)', fontSize: '0.85rem', lineHeight: 1.65 }}>
                  {h.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <button className="btn-primary" onClick={goNgo} style={{ padding: '0.75rem 2rem' }}>
              I represent an NGO →
            </button>
            <button className="btn-gold-outline" onClick={goVol} style={{ padding: '0.75rem 2rem' }}>
              Start volunteering →
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: 'var(--neev-ink)',
          color: 'var(--neev-slate)',
          textAlign: 'center',
          padding: '1.5rem',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.8rem',
        }}
      >
        <span style={{ color: 'var(--neev-gold)', fontFamily: '"Playfair Display", serif', fontWeight: 600, letterSpacing: '0.1em', marginRight: 6 }}>
          NEEV
        </span>
        · Built for Google Solution Challenge 2026 · Powered by
        <span style={{ color: '#60a5fa', margin: '0 4px' }}>Gemini AI</span>+
        <span style={{ color: '#f97316', margin: '0 4px' }}>Firebase</span>+
        <span style={{ color: '#4ade80', margin: '0 4px' }}>Google Maps</span>
      </footer>
    </div>
  );
}
