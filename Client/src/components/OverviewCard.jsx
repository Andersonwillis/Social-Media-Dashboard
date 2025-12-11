import React from 'react';

const iconFor = (brand) => `/images/icon-${brand}.svg`;
const deltaIcon = (dir) => `/images/icon-${dir}.svg`;
const fmt = (n) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(n%1_000_000?1:0)}m`
  : n >= 10_000 ? `${(n/1_000).toFixed(n%1_000?1:0)}k`
  : Number(n).toLocaleString();

export default function OverviewCard({ data, onBump, isSignedIn = true }) {
  const { brand, metric, value, deltaDirection, deltaPercent } = data;
  return (
    <article className="card card--overview" data-brand={brand} tabIndex={0}>
      <p className="metric">{metric}</p>
      <img className="brand" src={iconFor(brand)} alt="" aria-hidden="true" />
      <p className="value">{fmt(value)}</p>
      <p className={`delta ${deltaDirection === 'up' ? 'delta--up' : 'delta--down'}`}>
        <img src={deltaIcon(deltaDirection)} alt="" aria-hidden="true" />
        <span>{deltaPercent}%</span>
      </p>
      <button 
        className="btn-bump" 
        onClick={onBump} 
        disabled={!isSignedIn}
        aria-label={`Increase ${metric}`}
        title={!isSignedIn ? "Sign in to modify stats" : ""}
        style={{
          opacity: isSignedIn ? 1 : 0.5,
          cursor: isSignedIn ? 'pointer' : 'not-allowed'
        }}
      >
        +1
      </button>
    </article>
  );
}