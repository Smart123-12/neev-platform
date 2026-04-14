// ─── Volunteer Dashboard ──────────────────────
import React, { useState, useEffect } from 'react';
import NeedCard from '../components/NeedCard';
import SkillTagInput from '../components/SkillTagInput';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEMO_NEEDS, DEMO_VOLUNTEER } from '../services/demoData';

// Simple local match score based on skill overlap
function computeMatchScore(need, volunteer) {
  if (!need.requiredSkills?.length) return 55 + Math.floor(Math.random() * 20);
  const volSkills = (volunteer.skills || []).map((s) => s.toLowerCase());
  const matched   = need.requiredSkills.filter((s) => volSkills.includes(s.toLowerCase()));
  const base      = Math.round((matched.length / need.requiredSkills.length) * 70) + 25;
  return Math.min(base, 99);
}

export default function VolunteerDashboard() {
  const { user, demoMode } = useAuth();
  const { addToast }       = useToast();

  const [volunteer, setVolunteer] = useState(demoMode ? DEMO_VOLUNTEER : (user ?? {}));
  const [needs, setNeeds]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [profileSaving, setPS]    = useState(false);
  const [assignments, setAsgns]   = useState({});  // needId → 'accepted'|'completed'

  // Load needs + assignments
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (demoMode) {
          await new Promise((r) => setTimeout(r, 600));
          setNeeds(DEMO_NEEDS);
          setAsgns({ need_003: 'completed' });
        } else {
          const fb = await import('../services/firebaseService');
          const [allNeeds, myAsgns] = await Promise.all([
            fb.getAllNeeds(),
            fb.getAssignmentsByVolunteer(user.uid),
          ]);
          setNeeds(allNeeds);
          const map = {};
          myAsgns.forEach((a) => { map[a.needId] = a.status; });
          setAsgns(map);
        }
      } catch (e) {
        addToast('Failed to load tasks', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  // Ranked needs
  const rankedNeeds = [...needs]
    .map((n) => ({ ...n, _score: computeMatchScore(n, volunteer) }))
    .sort((a, b) => b._score - a._score);

  // Accept task
  const handleAccept = async (need) => {
    if (!demoMode) {
      try {
        const fb = await import('../services/firebaseService');
        await fb.createAssignment({ needId: need.id, volunteerId: user.uid });
      } catch (e) {
        addToast('Failed to accept task', 'error');
        return;
      }
    }
    setAsgns((prev) => ({ ...prev, [need.id]: 'accepted' }));
    addToast(`Task accepted — "${need.title}" ✓`, 'success');
  };

  // Mark complete
  const handleComplete = async (need) => {
    if (!demoMode) {
      try {
        const fb = await import('../services/firebaseService');
        const myAsgns = await fb.getAssignmentsByVolunteer(user.uid);
        const asgn    = myAsgns.find((a) => a.needId === need.id);
        if (asgn) await fb.completeAssignment(asgn.id);
      } catch (e) {
        addToast('Failed to complete task', 'error');
        return;
      }
    }
    setAsgns((prev) => ({ ...prev, [need.id]: 'completed' }));
    setVolunteer((v) => ({
      ...v,
      tasksCompleted: (v.tasksCompleted || 0) + 1,
      totalImpactHours: (v.totalImpactHours || 0) + 4,
    }));
    addToast('Task completed — great work! 🎉', 'success');
  };

  // Save profile
  const handleSaveProfile = async () => {
    setPS(true);
    try {
      if (!demoMode) {
        const fb = await import('../services/firebaseService');
        await fb.saveVolunteer(user.uid, volunteer);
      }
      addToast('Profile saved ✓', 'success');
    } catch (e) {
      addToast('Failed to save profile', 'error');
    } finally {
      setPS(false);
    }
  };

  return (
    <div className="page-enter min-h-screen" style={{ background: 'var(--neev-cream)' }}>
      {/* ── Sub-header ── */}
      <div style={{ background: 'var(--neev-navy)', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--neev-gold)', margin: 0, fontSize: '1.2rem' }}>
              {volunteer.name || 'Volunteer Dashboard'}
            </h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--neev-slate)', fontSize: '0.8rem', margin: 0 }}>
              {volunteer.city} · {volunteer.totalImpactHours || 0} hours of impact
            </p>
          </div>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', color: 'var(--neev-mist)' }}>
            ✅ {volunteer.tasksCompleted || 0} tasks · ⏱ {volunteer.totalImpactHours || 0} hrs
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-3 gap-6">
        {/* ── Profile Column ── */}
        <div className="lg:col-span-1">
          <div className="neev-card">
            <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--neev-navy)', fontSize: '1.05rem', margin: '0 0 16px' }}>
              My Profile
            </h3>

            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>
              Full Name
            </label>
            <input
              id="vol-name"
              className="neev-input mb-3"
              value={volunteer.name || ''}
              onChange={(e) => setVolunteer((v) => ({ ...v, name: e.target.value }))}
              placeholder="Your full name"
            />

            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>
              City
            </label>
            <input
              id="vol-city"
              className="neev-input mb-3"
              value={volunteer.city || ''}
              onChange={(e) => setVolunteer((v) => ({ ...v, city: e.target.value }))}
              placeholder="e.g. Mumbai"
            />

            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>
              Hours Available / Week
            </label>
            <input
              id="vol-hours"
              className="neev-input mb-4"
              type="number"
              min={1}
              max={40}
              value={volunteer.hoursPerWeek || ''}
              onChange={(e) => setVolunteer((v) => ({ ...v, hoursPerWeek: Number(e.target.value) }))}
            />

            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--neev-ink)', display: 'block', marginBottom: 4 }}>
              My Skills
            </label>
            <SkillTagInput
              skills={volunteer.skills || []}
              onChange={(skills) => setVolunteer((v) => ({ ...v, skills }))}
            />

            <button
              id="save-profile-btn"
              className="btn-primary mt-4"
              onClick={handleSaveProfile}
              disabled={profileSaving}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {profileSaving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>

          {/* ── Impact stats ── */}
          <div className="metric-card mt-4">
            <h4 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--neev-navy)', margin: '0 0 12px', fontSize: '0.95rem' }}>
              Your Impact
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Tasks Done',    value: volunteer.tasksCompleted || 0 },
                { label: 'Impact Hours',  value: volunteer.totalImpactHours || 0 },
                { label: 'Rating',        value: `${volunteer.rating || '—'} ⭐` },
                { label: 'Skills',        value: volunteer.skills?.length || 0 },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '1.5rem', color: 'var(--neev-navy)' }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', color: 'var(--neev-slate)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Task Feed ── */}
        <div className="lg:col-span-2">
          <h3 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--neev-navy)', margin: '0 0 16px', fontSize: '1.1rem' }}>
            Task Feed — Ranked by AI Match Score
          </h3>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="flex flex-col gap-4">
              {rankedNeeds.map((need) => {
                const status = assignments[need.id];
                return (
                  <div key={need.id}>
                    <NeedCard need={need} matchScore={need._score} />
                    <div className="flex gap-2 mt-2 pl-1">
                      {!status && (
                        <button
                          id={`accept-${need.id}`}
                          className="btn-primary"
                          onClick={() => handleAccept(need)}
                          style={{ fontSize: '0.82rem', padding: '5px 16px' }}
                        >
                          ✋ Accept Task
                        </button>
                      )}
                      {status === 'accepted' && (
                        <button
                          id={`complete-${need.id}`}
                          className="btn-outline"
                          onClick={() => handleComplete(need)}
                          style={{ fontSize: '0.82rem', padding: '5px 16px', borderColor: '#15803d', color: '#15803d' }}
                        >
                          ✅ Mark Complete
                        </button>
                      )}
                      {status === 'completed' && (
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', color: '#15803d', fontWeight: 600, padding: '5px 0' }}>
                          ✅ Completed — great work!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
