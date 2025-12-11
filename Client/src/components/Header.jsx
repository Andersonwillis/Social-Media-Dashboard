import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header({ total }) {
  return (
    <header className="header container">
      <div className="header__titles">
        <h1 className="title">Social Media Dashboard</h1>
        <p className="subtitle">Total Followers: <span>{total.toLocaleString?.() ?? total}</span></p>
      </div>
      <div className="theme" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Authentication UI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SignedOut>
            <Link to="/sign-in">
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
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
        </div>
        
        {/* Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="theme__label" htmlFor="theme-toggle">Dark Mode</label>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}