import React, { useState } from 'react';

const iconFor = (brand) => `/images/icon-${brand}.svg`;
const deltaIcon = (dir) => `/images/icon-${dir}.svg`;
const fmt = (n) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(n%1_000_000?1:0)}m`
  : n >= 10_000 ? `${(n/1_000).toFixed(n%1_000?1:0)}k`
  : Number(n).toLocaleString();

export default function OverviewCard({ data, onBump, onDecrement, onCustomChange, isSignedIn = true }) {
  const { brand, metric, value, deltaDirection, deltaPercent } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const newValue = parseInt(customValue, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      onCustomChange && onCustomChange(newValue);
      setIsEditing(false);
      setCustomValue('');
    }
  };

  return (
    <article className="card card--overview" data-brand={brand} tabIndex={0} style={{ position: 'relative' }}>
      <p className="metric">{metric}</p>
      <img className="brand" src={iconFor(brand)} alt="" aria-hidden="true" />
      
      {isEditing ? (
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.5rem 0' }}>
          <input
            type="number"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Enter value"
            autoFocus
            style={{
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #475569',
              backgroundColor: '#1e293b',
              color: 'white',
              fontSize: '0.875rem'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="submit"
              style={{
                flex: 1,
                padding: '0.25rem',
                borderRadius: '0.25rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              Set
            </button>
            <button 
              type="button"
              onClick={() => { setIsEditing(false); setCustomValue(''); }}
              style={{
                flex: 1,
                padding: '0.25rem',
                borderRadius: '0.25rem',
                backgroundColor: '#475569',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="value" 
          onDoubleClick={() => isSignedIn && setIsEditing(true)}
          title={isSignedIn ? "Double-click to edit" : ""}
          style={{ cursor: isSignedIn ? 'pointer' : 'default' }}
        >
          {fmt(value)}
        </p>
      )}
      
      <p className={`delta ${deltaDirection === 'up' ? 'delta--up' : 'delta--down'}`}>
        <img src={deltaIcon(deltaDirection)} alt="" aria-hidden="true" />
        <span>{deltaPercent}%</span>
      </p>
      
      <div style={{ display: 'flex', gap: '0.25rem', position: 'absolute', bottom: '0.5rem', right: '0.5rem' }}>
        {onDecrement && (
          <button 
            onClick={onDecrement}
            disabled={!isSignedIn}
            aria-label={`Decrease ${metric}`}
            title={!isSignedIn ? "Sign in to modify stats" : "Decrease by 1"}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              cursor: isSignedIn ? 'pointer' : 'not-allowed',
              opacity: isSignedIn ? 1 : 0.5,
              fontSize: '0.75rem'
            }}
          >
            -1
          </button>
        )}
        <button 
          className="btn-bump" 
          onClick={onBump} 
          disabled={!isSignedIn}
          aria-label={`Increase ${metric}`}
          title={!isSignedIn ? "Sign in to modify stats" : "Increase by 1"}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            backgroundColor: '#1db954',
            color: 'white',
            border: 'none',
            cursor: isSignedIn ? 'pointer' : 'not-allowed',
            opacity: isSignedIn ? 1 : 0.5,
            fontSize: '0.75rem'
          }}
        >
          +1
        </button>
      </div>
    </article>
  );
}