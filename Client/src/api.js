export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Cache for CSRF token
let csrfToken = null;

// Note: API_BASE is configured via VITE_API_BASE environment variable in Vercel

// Fetch CSRF token from server
async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  
  const res = await fetch(`${API_BASE}/csrf-token`, {
    credentials: 'include' // Important: include cookies for cross-site requests
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch CSRF token: ${res.status}`);
  }
  
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

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
  const token = await getCsrfToken();
  
  const res = await fetch(`${API_BASE}/overview/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'x-csrf-token': token
    },
    credentials: 'include', // Important: include cookies for cross-site requests
    body: JSON.stringify(patch)
  });
  
  if (!res.ok) {
    // If CSRF token is invalid, clear it and let the caller retry
    if (res.status === 403) {
      csrfToken = null;
    }
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