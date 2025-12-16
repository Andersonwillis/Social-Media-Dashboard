import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#0f172a',
      gap: '2rem'
    }}>
      <SignIn 
        appearance={{
          elements: {
            rootBox: {
              margin: '0 auto'
            }
          }
        }}
      />
      
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'transparent',
          color: '#94a3b8',
          border: '1px solid #334155',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          transition: 'all 0.2s',
          fontWeight: '500'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#1e293b';
          e.currentTarget.style.color = '#e2e8f0';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        Continue Without Sign In (View Only)
      </button>
    </div>
  );
}
