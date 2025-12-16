import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header({ total }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <header className="header container">
      <div className="header__titles">
        <h1 className="title">Social Media Dashboard</h1>
        <p className="subtitle">Total Followers: <span>{total.toLocaleString?.() ?? total}</span></p>
      </div>
      <div className="theme" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Authentication UI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SignedOut>
            {/* Modal-based sign in (simpler alternative) */}
            <SignInButton mode="modal">
              <button className="btn-signin" style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem',
                transition: 'background-color 0.2s'
              }}>
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            {user && (
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
            )}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: {
                    width: '32px',
                    height: '32px'
                  }
                }
              }}
            />
          </SignedIn>
        </div>
        
        {/* Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid #334155', paddingLeft: '1rem' }}>
          <label className="theme__label" htmlFor="theme-toggle">Dark Mode</label>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
