export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5174/api';

export async function getFollowers() {
  const res = await fetch(`${API_BASE}/followers`);
  if (!res.ok) throw new Error('Failed to load followers');
  return res.json();
}

export async function getOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  if (!res.ok) throw new Error('Failed to load overview');
  return res.json();
}

export async function getTotalFollowers() {
  const res = await fetch(`${API_BASE}/total-followers`);
  if (!res.ok) throw new Error('Failed to load totals');
  return res.json();
}

export async function patchOverview(id, patch) {
  const res = await fetch(`${API_BASE}/overview/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error('Failed to update overview');
  return res.json();
}