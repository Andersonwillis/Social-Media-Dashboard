export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function getFollowers() {
  const res = await fetch(`${API_BASE}/followers`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load followers: ${res.status} ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.clone().text();
    throw new Error(`Expected JSON but got ${ct}: ${text.slice(0,200)}`);
  }
  return res.json();
}

export async function getOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load overview: ${res.status} ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.clone().text();
    throw new Error(`Expected JSON but got ${ct}: ${text.slice(0,200)}`);
  }
  return res.json();
}

export async function getTotalFollowers() {
  const res = await fetch(`${API_BASE}/total-followers`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load totals: ${res.status} ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.clone().text();
    throw new Error(`Expected JSON but got ${ct}: ${text.slice(0,200)}`);
  }
  return res.json();
}

export async function patchOverview(id, patch) {
  const res = await fetch(`${API_BASE}/overview/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update overview: ${res.status} ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.clone().text();
    throw new Error(`Expected JSON but got ${ct}: ${text.slice(0,200)}`);
  }
  return res.json();
}