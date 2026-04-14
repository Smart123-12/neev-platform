// ─── Login Page ───────────────────────────────
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { loginFirebase, enableDemoAs, demoMode } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm]   = useState({ email: '', password: '', role: 'volunteer' });
  const [loading, setLoading] = useState(false);
  const [error, setError]  = useState('');

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginFirebase(form.email, form.password, form.role);
      addToast('Welcome back to NEEV ✓', 'success');
      navigate(form.role === 'ngo' ? '/ngo' : '/volunteer');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role) => {
    enableDemoAs(role);
    navigate(role === 'ngo' ? '/ngo' : '/volunteer');
  };

  return (
    <div className="page-enter min-h-screen flex items-center justify-center" style={{ background: 'var(--neev-cream)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '2.5rem',
              letterSpacing: '0.16em',
              color: 'var(--neev-navy)',
              margin: 0,
            }}
          >
            NEEV
          </h1>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--neev-slate)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Sign in to your account
          </p>
        </div>

        <div className="neev-card">
          {/* Demo shortcuts */}
          <div style={{ marginBottom: '1.2rem' }}>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem', color: 'var(--neev-slate)', margin: '0 0 8px', textAlign: 'center' }}>
              ⚡ Jump in as demo user:
            </p>
            <div className="flex gap-2">
              <button
                id="demo-ngo-btn"
                className="btn-primary"
                onClick={() => handleDemo('ngo')}
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
              >
                NGO Admin
              </button>
              <button
                id="demo-vol-btn"
                className="btn-outline"
                onClick={() => handleDemo('volunteer')}
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
              >
                Volunteer
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.2rem' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--neev-mist)' }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', color: '#9ab0c8' }}>or sign in with email</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--neev-mist)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role */}
            <div className="mb-4">
              <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>
                Sign in as
              </label>
              <select id="login-role" className="neev-select" value={form.role} onChange={set('role')}>
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>
                Email
              </label>
              <input id="login-email" className="neev-input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            </div>

            <div className="mb-4">
              <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>
                Password
              </label>
              <input id="login-password" className="neev-input" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', color: '#b91c1c', margin: 0 }}>{error}</p>
              </div>
            )}

            <button id="login-submit" className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: 'var(--neev-slate)', textAlign: 'center', margin: '1rem 0 0' }}>
            New to NEEV? <Link to="/register" style={{ color: 'var(--neev-navy)', fontWeight: 600 }}>Create an account →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
