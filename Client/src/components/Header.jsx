import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header({ total }) {
  return (
    <header className="header container">
      <div className="header__titles">
        <h1 className="title">Social Media Dashboard</h1>
        <p className="subtitle">Total Followers: <span>{total.toLocaleString?.() ?? total}</span></p>
      </div>
      <div className="theme">
        <label className="theme__label" htmlFor="theme-toggle">Dark Mode</label>
        <ThemeToggle />
      </div>
    </header>
  );
}