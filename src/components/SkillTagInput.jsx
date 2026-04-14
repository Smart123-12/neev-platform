// ─── SkillTagInput ────────────────────────────
// Type a skill and press Enter to add gold pill chips
import React, { useState } from 'react';

export default function SkillTagInput({ skills, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput('');
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: '6px 10px',
          border: '1px solid #d0d9e8',
          borderRadius: 6,
          background: '#fff',
          minHeight: 44,
          alignItems: 'center',
          cursor: 'text',
        }}
        onClick={() => document.getElementById('skill-input')?.focus()}
      >
        {skills.map((skill) => (
          <span key={skill} className="skill-pill" style={{ cursor: 'default' }}>
            {skill}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--neev-gold)',
                cursor: 'pointer',
                padding: '0 2px',
                fontSize: '0.85rem',
                lineHeight: 1,
              }}
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="skill-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : ''}
          style={{
            border: 'none',
            outline: 'none',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.875rem',
            color: 'var(--neev-ink)',
            flexGrow: 1,
            minWidth: 140,
            background: 'transparent',
          }}
        />
      </div>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', color: '#9ab0c8', margin: '4px 0 0' }}>
        Press Enter or Tab after each skill · Backspace to remove last
      </p>
    </div>
  );
}
