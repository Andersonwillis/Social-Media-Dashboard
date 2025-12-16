import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, SignedIn, UserButton } from '@clerk/clerk-react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navigation() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 0 1rem 1rem',
    borderBottom: '1px solid #334155',
    marginBottom: '2rem'
  };

  const linkStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    color: '#94a3b8',
    fontWeight: '500',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    border: '1px solid transparent'
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6'
  };

  return (
    <nav style={navStyle}>
      <NavLink 
        to="/dashboard" 
        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
        end
      >
        📊 Dashboard
      </NavLink>
      {isSignedIn && (
        <>
          <NavLink 
            to="/analytics" 
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            📈 Analytics
          </NavLink>
          <NavLink 
            to="/goals" 
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            🎯 Goals
          </NavLink>
          <NavLink 
            to="/reports" 
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            📄 Reports
          </NavLink>
          <NavLink 
            to="/settings" 
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            ⚙️ Settings
          </NavLink>
        </>
      )}
      
      {/* Right side items */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '1rem' }}>
        <ThemeToggle />
        
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        
        {!isSignedIn && (
          <button
            onClick={() => navigate('/sign-in')}
            style={{
              ...linkStyle,
              background: 'none',
              border: '1px solid #3b82f6',
              cursor: 'pointer',
              margin: 0
            }}
          >
            🔐 Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
