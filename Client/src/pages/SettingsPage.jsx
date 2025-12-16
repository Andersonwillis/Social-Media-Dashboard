import React from 'react';
import { useAuth, useUser, UserProfile } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !isSignedIn) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="title" style={{ marginBottom: '2rem' }}>Profile & Settings</h1>
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem'
      }}>
        <UserProfile 
          appearance={{
            elements: {
              rootBox: {
                width: '100%',
                maxWidth: '900px'
              },
              card: {
                boxShadow: 'none',
                border: '1px solid #334155'
              }
            }
          }}
        />
      </div>
    </div>
  );
}
