// ─── NeedCard ─────────────────────────────────
import React, { useState } from 'react';
import UrgencyBadge from './UrgencyBadge';
import MatchResult from './MatchResult';
import LoadingSkeleton from './LoadingSkeleton';
import { matchVolunteersToNeed } from '../services/geminiService';
import { DEMO_VOLUNTEERS, MOCK_MATCH_RESULTS } from '../services/demoData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function NeedCard({ need, showMatchBtn = false, matchScore = null }) {
  const { demoMode } = useAuth();
  const { addToast } = useToast();
  const [matches, setMatches]   = useState(null);
  const [matching, setMatching] = useState(false);

  const handleMatch = async () => {
    setMatching(true);
    try {
      if (demoMode) {
        // Simulate delay for realism
        await new Promise((r) => setTimeout(r, 1800));
        const result = MOCK_MATCH_RESULTS[need.id];
        setMatches(result?.matches ?? []);
        addToast('AI matching complete ✓', 'success');
      } else {
        const volunteers = await import('../services/firebaseService').then((m) => m.getAllVolunteers());
        const results = await matchVolunteersToNeed(need, volunteers);
        setMatches(results);
        addToast('AI matching complete ✓', 'success');
      }
    } catch (err) {
      addToast('Matching failed — check Gemini API key', 'error');
      console.error(err);
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="neev-card page-enter">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <h3
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '1.05rem',
              color: 'var(--neev-navy)',
              margin: 0,
            }}
          >
            {need.title}
          </h3>
          <p
            style={{
              color: 'var(--neev-slate)',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.82rem',
              margin: '2px 0 0',
            }}
          >
            {need.ngoName} · {need.location?.city}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <UrgencyBadge urgency={need.urgency} />
          {matchScore !== null && (
            <span className="match-chip">{matchScore}% match</span>
          )}
        </div>
      </div>

      <p
        style={{
          color: 'var(--neev-ink)',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          margin: '0 0 12px',
        }}
      >
        {need.description?.length > 180
          ? need.description.slice(0, 180) + '…'
          : need.description}
      </p>

      {/* Skills */}
      {need.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {need.requiredSkills.map((s) => (
            <span key={s} className="skill-pill">{s}</span>
          ))}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
        <span
          style={{
            color: 'var(--neev-slate)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.8rem',
          }}
        >
          👥 {need.volunteersAssigned?.length ?? 0} / {need.volunteersNeeded} volunteers
        </span>

        <span
          style={{
            color:
              need.status === 'completed' ? '#15803d' :
              need.status === 'active'    ? '#b45309' :
                                           'var(--neev-slate)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {need.status}
        </span>
      </div>

      {/* Match button */}
      {showMatchBtn && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--neev-mist)' }}>
          <button
            className="btn-primary"
            onClick={handleMatch}
            disabled={matching}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {matching ? (
              <>
                <span className="animate-spin">⟳</span> Matching with NEEV AI…
              </>
            ) : (
              <>✦ Match with NEEV AI</>
            )}
          </button>
        </div>
      )}

      {/* AI Match Results */}
      {matching && (
        <div className="mt-4">
          <LoadingSkeleton count={3} />
        </div>
      )}
      {matches && !matching && (
        <div className="mt-4 flex flex-col gap-3">
          <p
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: 'var(--neev-slate)',
              margin: 0,
            }}
          >
            Top 3 volunteer matches from Gemini AI:
          </p>
          {matches.length === 0 ? (
            <p style={{ color: '#b91c1c', fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem' }}>
              No matching volunteers found. Try updating volunteer profiles.
            </p>
          ) : (
            matches.map((m) => <MatchResult key={m.volunteerId} match={m} />)
          )}
        </div>
      )}
    </div>
  );
}
