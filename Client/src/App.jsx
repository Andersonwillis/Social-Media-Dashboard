import { useEffect, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getFollowers, getOverview, getTotalFollowers, patchOverview } from './api';
import Header from './components/Header.jsx';
import FollowerCard from './components/FollowerCard.jsx';
import OverviewCard from './components/OverviewCard.jsx';

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [overview, setOverview] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (!isSignedIn) return; // Don't load data if not signed in
    
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
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn]);

  const actions = useMemo(() => ({
    async bump(id) {
      // Only allow stat changes if user is signed in
      if (!isSignedIn) {
        alert('Please sign in to modify stats');
        return;
      }
      
      const item = overview.find(x => x.id === id);
      if (!item) return;
      const updated = await patchOverview(id, { value: item.value + 1 });
      setOverview(prev => prev.map(x => x.id === id ? updated : x));
    }
  }), [overview, isSignedIn]);

  // Show loading while checking authentication
  if (!isLoaded || !isSignedIn) {
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
      <Header total={total} />

      <main className="container main">
        <section className="grid grid--top" aria-label="Accounts">
          {loading && <p>Loading…</p>}
          {!loading && followers.map(f => (
            <FollowerCard key={f.id} data={f} />
          ))}
        </section>

        <h2 className="section-title">Overview - Today</h2>
        <section className="grid grid--overview" aria-label="Today overview">
          {!loading && overview.map(o => (
            <OverviewCard 
              key={o.id} 
              data={o} 
              onBump={() => actions.bump(o.id)}
              isSignedIn={isSignedIn}
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