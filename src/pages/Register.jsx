// ─── Register Page ────────────────────────────
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SkillTagInput from '../components/SkillTagInput';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { registerFirebase } = useAuth();
  const { addToast }         = useToast();
  const navigate             = useNavigate();

  const [role, setRole]     = useState('volunteer');
  const [loading, setL]     = useState(false);
  const [error, setError]   = useState('');

  // Shared
  const [email, setEmail]   = useState('');
  const [password, setPass] = useState('');

  // Volunteer fields
  const [name, setName]     = useState('');
  const [city, setCity]     = useState('');
  const [hours, setHours]   = useState(4);
  const [skills, setSkills] = useState([]);

  // NGO fields
  const [orgName, setOrg]   = useState('');
  const [orgCity, setOrgCity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setL(true);
    try {
      const profileData =
        role === 'ngo'
          ? { name: orgName, city: orgCity, totalNeedsPosted: 0, impactScore: 0 }
          : { name, city, skills, hoursPerWeek: Number(hours), tasksCompleted: 0, totalImpactHours: 0 };

      await registerFirebase(email, password, role, profileData);
      addToast('Welcome to NEEV! 🎉', 'success');
      navigate(role === 'ngo' ? '/ngo' : '/volunteer');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setL(false);
    }
  };

  return (
    <div className="page-enter min-h-screen flex items-center justify-center" style={{ background: 'var(--neev-cream)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '2.5rem', letterSpacing: '0.16em', color: 'var(--neev-navy)', margin: 0 }}>
            NEEV
          </h1>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--neev-slate)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Create your account
          </p>
        </div>

        <div className="neev-card">
          {/* Role selector */}
          <div className="flex gap-2 mb-5">
            {['volunteer', 'ngo'].map((r) => (
              <button
                key={r}
                id={`role-${r}`}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: role === r ? 'var(--neev-navy)' : 'var(--neev-mist)',
                  background: role === r ? 'var(--neev-navy)' : 'transparent',
                  color: role === r ? 'var(--neev-gold)' : 'var(--neev-slate)',
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {r === 'ngo' ? '🏢 NGO Admin' : '🤲 Volunteer'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>Email *</label>
              <input id="reg-email" className="neev-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="mb-4">
              <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>Password *</label>
              <input id="reg-password" className="neev-input" type="password" value={password} onChange={(e) => setPass(e.target.value)} placeholder="Min. 6 characters" required minLength={6} />
            </div>

            {role === 'volunteer' ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>Full Name *</label>
                    <input id="reg-name" className="neev-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Sharma" required />
                  </div>
                  <div>
                    <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>City *</label>
                    <input id="reg-city" className="neev-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>Hours Available / Week</label>
                  <input id="reg-hours" className="neev-input" type="number" min={1} max={40} value={hours} onChange={(e) => setHours(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>Your Skills</label>
                  <SkillTagInput skills={skills} onChange={setSkills} />
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>Organization Name *</label>
                  <input id="reg-org" className="neev-input" value={orgName} onChange={(e) => setOrg(e.target.value)} placeholder="Seva Foundation" required />
                </div>
                <div className="mb-4">
                  <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>City *</label>
                  <input id="reg-org-city" className="neev-input" value={orgCity} onChange={(e) => setOrgCity(e.target.value)} placeholder="Mumbai" required />
                </div>
              </>
            )}

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', color: '#b91c1c', margin: 0 }}>{error}</p>
              </div>
            )}

            <button id="reg-submit" className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: 'var(--neev-slate)', textAlign: 'center', margin: '1rem 0 0' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--neev-navy)', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
