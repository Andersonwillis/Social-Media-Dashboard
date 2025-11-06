import React from 'react';

const iconFor = (brand) => `/images/icon-${brand}.svg`;
const deltaIcon = (dir) => `/images/icon-${dir}.svg`;
const fmt = (n) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(n%1_000_000?1:0)}m`
  : n >= 10_000 ? `${(n/1_000).toFixed(n%1_000?1:0)}k`
  : Number(n).toLocaleString();

export default function FollowerCard({ data }) {
  const { brand, handle, displayName, label, count, deltaDirection, deltaValue } = data;
  const name = handle ?? displayName ?? '';
  return (
    <article className="card card--top" data-brand={brand} tabIndex={0}>
      <header className="handle">
        <img src={iconFor(brand)} alt="" aria-hidden="true" />
        <span>{name}</span>
      </header>
      <p className="count" aria-label={`${label} count`}>{fmt(count)}</p>
      <p className="label">{label}</p>
      <p className={`delta ${deltaDirection === 'up' ? 'delta--up' : 'delta--down'}`}>
        <img src={deltaIcon(deltaDirection)} alt="" aria-hidden="true" />
        <span>{fmt(deltaValue)} Today</span>
      </p>
    </article>
  );
}