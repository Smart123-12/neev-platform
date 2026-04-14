// ─── NeedForm — Slide-in Panel ────────────────
import React, { useState } from 'react';
import SkillTagInput from './SkillTagInput';

const CATEGORIES = [
  'Medical', 'Education', 'Food & Nutrition',
  'Disaster Relief', 'Women Empowerment', 'Environment', 'Other',
];

const INITIAL = {
  title: '',
  description: '',
  category: 'Education',
  city: '',
  urgency: 'Medium',
  volunteersNeeded: 2,
  requiredSkills: [],
};

export default function NeedForm({ onSubmit, onClose, ngoName }) {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.city) return;
    setSubmitting(true);
    await onSubmit({ ...form, ngoName });
    setForm(INITIAL);
    setSubmitting(false);
  };

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel">
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--neev-mist)',
            display: 'flex',
            align: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 10,
          }}
        >
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              color: 'var(--neev-navy)',
              margin: 0,
              fontSize: '1.2rem',
            }}
          >
            Post a Community Need
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.4rem',
              color: 'var(--neev-slate)',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--neev-ink)' }}>
              Need Title *
            </label>
            <input
              id="need-title"
              className="neev-input"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Free medical camp — Dharavi"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-1" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--neev-ink)' }}>
              Description *
            </label>
            <textarea
              id="need-description"
              className="neev-input"
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="Describe the community need, context, and volunteer expectations…"
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          {/* Category + Urgency */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--neev-ink)' }}>
                Category
              </label>
              <select id="need-category" className="neev-select" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--neev-ink)' }}>
                Urgency
              </label>
              <select id="need-urgency" className="neev-select" value={form.urgency} onChange={set('urgency')}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* City + Volunteers */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--neev-ink)' }}>
                City *
              </label>
              <input
                id="need-city"
                className="neev-input"
                value={form.city}
                onChange={set('city')}
                placeholder="e.g. Mumbai"
                required
              />
            </div>
            <div>
              <label className="block mb-1" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--neev-ink)' }}>
                Volunteers Needed
              </label>
              <input
                id="need-volunteers"
                className="neev-input"
                type="number"
                min={1}
                max={100}
                value={form.volunteersNeeded}
                onChange={set('volunteersNeeded')}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block mb-1" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600, color: 'var(--neev-ink)' }}>
              Required Skills
            </label>
            <SkillTagInput
              skills={form.requiredSkills}
              onChange={(skills) => setForm((f) => ({ ...f, requiredSkills: skills }))}
            />
          </div>

          {/* Submit */}
          <button
            id="need-submit"
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }}
          >
            {submitting ? 'Posting…' : '+ Post This Need'}
          </button>
        </form>
      </div>
    </>
  );
}
