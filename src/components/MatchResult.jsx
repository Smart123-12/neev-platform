// ─── MatchResult ─────────────────────────────
// AI match card displayed below a NeedCard
import React from 'react';

const SCORE_COLOR = (score) => {
  if (score >= 85) return '#15803d';
  if (score >= 65) return '#b45309';
  return '#1d4ed8';
};

export default function MatchResult({ match }) {
  return (
    <div
      style={{
        background: 'var(--neev-mist)',
        borderRadius: 8,
        padding: '0.9rem 1.1rem',
        borderLeft: `3px solid ${SCORE_COLOR(match.matchScore)}`,
        transition: 'transform 0.15s',
      }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
        <span
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            color: 'var(--neev-navy)',
            fontSize: '0.95rem',
          }}
        >
          {match.name}
        </span>
        <span
          style={{
            background: SCORE_COLOR(match.matchScore),
            color: '#fff',
            borderRadius: 999,
            padding: '2px 12px',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '0.78rem',
          }}
        >
          {match.matchScore}% match
        </span>
      </div>

      {/* Matched skills */}
      {match.matchedSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {match.matchedSkills.map((s) => (
            <span
              key={s}
              style={{
                background: 'rgba(13,31,53,0.08)',
                color: 'var(--neev-ink)',
                padding: '1px 9px',
                borderRadius: 999,
                fontSize: '0.72rem',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Reasoning */}
      <p
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.82rem',
          color: 'var(--neev-slate)',
          margin: '0 0 6px',
          fontStyle: 'italic',
        }}
      >
        "{match.reason}"
      </p>

      {match.estimatedImpact && (
        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.75rem',
            color: 'var(--neev-slate)',
          }}
        >
          ⏱ {match.estimatedImpact}
        </div>
      )}
    </div>
  );
}
