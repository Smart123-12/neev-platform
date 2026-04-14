// ─────────────────────────────────────────────
//  NEEV Auth Context
//  role: "ngo" | "volunteer" | "demo" | null
// ─────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_NGO, DEMO_VOLUNTEER } from '../services/demoData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [role, setRole]         = useState(null); // "ngo" | "volunteer" | "demo"
  const [demoMode, setDemoMode] = useState(true); // Default ON for judges
  const [loading, setLoading]   = useState(false);

  // ── Demo mode helpers ───────────────────────
  const enableDemoAs = useCallback((demoRole) => {
    if (demoRole === 'ngo') {
      setUser({ ...DEMO_NGO, uid: DEMO_NGO.id });
      setRole('ngo');
    } else {
      setUser({ ...DEMO_VOLUNTEER, uid: DEMO_VOLUNTEER.id });
      setRole('volunteer');
    }
    setDemoMode(true);
  }, []);

  const toggleDemoMode = useCallback(() => {
    setDemoMode((prev) => {
      const next = !prev;
      if (next) {
        // Re-enter demo with current role or default to volunteer
        setUser({ ...DEMO_VOLUNTEER, uid: DEMO_VOLUNTEER.id });
        setRole('volunteer');
      } else {
        setUser(null);
        setRole(null);
      }
      return next;
    });
  }, []);

  // Initialize in demo mode on first load
  useEffect(() => {
    if (demoMode && !user) {
      setUser({ ...DEMO_VOLUNTEER, uid: DEMO_VOLUNTEER.id });
      setRole('volunteer');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Firebase auth (only when not demo) ──────
  const loginFirebase = useCallback(async (email, password, userRole) => {
    const { loginWithEmail, getVolunteer, getNgo } = await import('../services/firebaseService');
    const cred = await loginWithEmail(email, password);
    const uid  = cred.user.uid;

    let profile = null;
    if (userRole === 'ngo') {
      profile = await getNgo(uid);
    } else {
      profile = await getVolunteer(uid);
    }

    setUser({ uid, email: cred.user.email, ...(profile ?? {}) });
    setRole(userRole);
    setDemoMode(false);
  }, []);

  const registerFirebase = useCallback(async (email, password, userRole, profileData) => {
    const { registerWithEmail, saveNgo, saveVolunteer } = await import('../services/firebaseService');
    const cred = await registerWithEmail(email, password);
    const uid  = cred.user.uid;

    if (userRole === 'ngo') {
      await saveNgo(uid, { email, ...profileData });
    } else {
      await saveVolunteer(uid, { email, tasksCompleted: 0, totalImpactHours: 0, ...profileData });
    }

    setUser({ uid, email, ...profileData });
    setRole(userRole);
    setDemoMode(false);
  }, []);

  const logoutUser = useCallback(async () => {
    if (!demoMode) {
      const { logout } = await import('../services/firebaseService');
      await logout();
    }
    setUser(null);
    setRole(null);
    setDemoMode(true);
    // Re-enter demo on logout
    setUser({ ...DEMO_VOLUNTEER, uid: DEMO_VOLUNTEER.id });
    setRole('volunteer');
  }, [demoMode]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        demoMode,
        loading,
        enableDemoAs,
        toggleDemoMode,
        loginFirebase,
        registerFirebase,
        logoutUser,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
