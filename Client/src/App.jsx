import React, { useEffect, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getFollowers, getOverview, getTotalFollowers, patchOverview } from './api';
import { useRole } from './hooks/useRole';
import Header from './components/Header.jsx';
import FollowerCard from './components/FollowerCard.jsx';
import OverviewCard from './components/OverviewCard.jsx';

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { can, role } = useRole();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [overview, setOverview] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load data regardless of sign-in status (for view-only mode)
  useEffect(() => {
    (async () => {
      try {
        const [f, o, t] = await Promise.all([
          getFollowers(),
          getOverview(),
          getTotalFollowers()
        ]);
        setFollowers(f);
        setOverview(o);
        setTotal(t.total);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const actions = useMemo(() => ({
    async bump(id) {
      // Check if user has edit permission
      if (!isSignedIn) {
        alert('Please sign in to modify stats');
        return;
      }
      
      if (!can('edit')) {
        alert(`You don't have permission to edit. Your role: ${role}`);
        return;
      }
      
      const item = overview.find(x => x.id === id);
      if (!item) return;
      const currentValue = item.value || item.count || 0;
      const updated = await patchOverview(id, { value: currentValue + 1, count: currentValue + 1 });
      setOverview(prev => prev.map(x => x.id === id ? { ...x, ...updated } : x));
    },
    async decrement(id) {
      if (!isSignedIn) {
        alert('Please sign in to modify stats');
        return;
      }
      
      if (!can('edit')) {
        alert(`You don't have permission to edit. Your role: ${role}`);
        return;
      }
      
      const item = overview.find(x => x.id === id);
      if (!item) return;
      const currentValue = item.value || item.count || 0;
      if (currentValue <= 0) return; // Don't go below 0
      const updated = await patchOverview(id, { value: currentValue - 1, count: currentValue - 1 });
      setOverview(prev => prev.map(x => x.id === id ? { ...x, ...updated } : x));
    },
    async setCustomValue(id, newValue) {
      if (!isSignedIn) {
        alert('Please sign in to modify stats');
        return;
      }
      
      if (!can('edit')) {
        alert(`You don't have permission to edit. Your role: ${role}`);
        return;
      }
      
      const updated = await patchOverview(id, { value: newValue, count: newValue });
      setOverview(prev => prev.map(x => x.id === id ? { ...x, ...updated } : x));
    }
  }), [overview, isSignedIn, can, role]);

  // Show loading while data loads
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* View-Only Banner */}
      {!isSignedIn && (
        <div style={{
          backgroundColor: '#1e293b',
          borderBottom: '2px solid #3b82f6',
          padding: '1rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
            👁️ <strong style={{ color: '#e2e8f0' }}>View-Only Mode</strong> - 
            <button
              onClick={() => navigate('/sign-in')}
              style={{
                marginLeft: '0.5rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Sign In
            </button>
            {' '}to edit and track goals
          </p>
        </div>
      )}

      <Header total={total} />

      <main className="container main">
        <section className="grid grid--top" aria-label="Accounts">
          {loading && <p>Loading…</p>}
          {!loading && followers.map(f => (
            <FollowerCard key={f.id} data={f} />
          ))}
        </section>

        <h2 className="section-title">
          Overview - Today
          {isSignedIn && <span style={{ fontSize: '0.875rem', color: '#64748b', marginLeft: '1rem' }}>
            (Role: {role})
          </span>}
        </h2>
        <section className="grid grid--overview" aria-label="Today overview">
          {!loading && overview.map(o => (
            <OverviewCard 
              key={o.id} 
              data={o} 
              onBump={() => actions.bump(o.id)}
              onDecrement={() => actions.decrement(o.id)}
              onCustomChange={(newValue) => actions.setCustomValue(o.id, newValue)}
              isSignedIn={isSignedIn && can('edit')}
            />
          ))}
        </section>
      </main>

      <footer className="container attribution">
        Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" rel="noreferrer">Frontend Mentor</a>.
        Coded by Malachi Anderson &amp; Evan Bellig.
      </footer>
    </>
  );
}