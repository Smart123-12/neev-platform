// ─── VolunteerCard ────────────────────────────
import React from 'react';

export default function VolunteerCard({ volunteer, matchScore }) {
  return (
    <div className="neev-card page-enter flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '1rem',
              color: 'var(--neev-navy)',
              margin: 0,
            }}
          >
            {volunteer.name}
          </p>
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.78rem',
              color: 'var(--neev-slate)',
              margin: 0,
            }}
          >
            {volunteer.city} · {volunteer.hoursPerWeek}h/week
          </p>
        </div>
        {matchScore != null && (
          <span className="match-chip">{matchScore}% match</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {volunteer.skills?.map((s) => (
          <span key={s} className="skill-pill">{s}</span>
        ))}
      </div>

      <div
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.78rem',
          color: 'var(--neev-slate)',
        }}
      >
        ✅ {volunteer.tasksCompleted} tasks · ⏱ {volunteer.totalImpactHours} hrs impact
        {volunteer.rating && ` · ⭐ ${volunteer.rating}`}
      </div>
    </div>
  );
}
