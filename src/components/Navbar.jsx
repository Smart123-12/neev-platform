// ─── NEEV Navbar ──────────────────────────────
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DemoModeToggle from './DemoModeToggle';

export default function Navbar() {
  const { user, role, logoutUser, demoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const ngoLinks = [
    { to: '/ngo',  label: 'Dashboard' },
    { to: '/map',  label: 'Needs Map' },
  ];
  const volLinks = [
    { to: '/volunteer', label: 'My Tasks' },
    { to: '/map',       label: 'Needs Map' },
  ];

  const links = role === 'ngo' ? ngoLinks : role === 'volunteer' ? volLinks : [];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <header style={{ background: 'var(--neev-navy)' }} className="sticky top-0 z-30 shadow-lg">
      {demoMode && (
        <div className="demo-banner">
          🌟 Demo Mode — explore NEEV freely · No login required
        </div>
      )}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              letterSpacing: '0.16em',
              color: 'var(--neev-gold)',
              fontSize: '1.5rem',
              lineHeight: 1,
            }}
          >
            NEEV
          </span>
          <span
            style={{
              color: 'var(--neev-slate)',
              fontSize: '0.7rem',
              letterSpacing: '0.06em',
              fontFamily: '"DM Sans", sans-serif',
              marginTop: 2,
            }}
            className="hidden sm:block"
          >
            VOLUNTEER PLATFORM
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                color: location.pathname === l.to ? 'var(--neev-gold)' : 'var(--neev-mist)',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              {l.label}
            </Link>
          ))}

          <DemoModeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <span
                style={{
                  color: 'var(--neev-mist)',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.85rem',
                }}
              >
                {user.name || user.email}
              </span>
              <button onClick={handleLogout} className="btn-gold-outline" style={{ padding: '4px 14px', fontSize: '0.82rem' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn-primary" style={{ padding: '4px 14px', fontSize: '0.82rem' }}>
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: 'var(--neev-gold)',
                borderRadius: 2,
                transition: 'transform 0.2s',
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{ background: 'var(--neev-navy)', borderTop: '1px solid rgba(201,168,76,0.2)' }}
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--neev-mist)', fontFamily: '"DM Sans", sans-serif', textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}
          <DemoModeToggle />
          {user ? (
            <button onClick={handleLogout} className="btn-gold-outline w-full" style={{ marginTop: 4 }}>
              Sign Out
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="btn-primary w-full" style={{ marginTop: 4 }}>Sign In</button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
