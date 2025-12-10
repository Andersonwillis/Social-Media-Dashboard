# CSRF Token Exchange System - Complete Guide

## Overview

This document provides a comprehensive explanation of how CSRF (Cross-Site Request Forgery) protection works in this application, including the token exchange mechanism between frontend and backend.

---

## Table of Contents

1. [What is CSRF?](#what-is-csrf)
2. [Why We Need CSRF Protection](#why-we-need-csrf-protection)
3. [Token Exchange Flow](#token-exchange-flow)
4. [Implementation Details](#implementation-details)
5. [Cookie-Based vs Header-Based](#cookie-based-vs-header-based)
6. [Security Considerations](#security-considerations)
7. [Debugging & Troubleshooting](#debugging--troubleshooting)

---

## What is CSRF?

### CSRF Attack Explained

**Cross-Site Request Forgery** is an attack where a malicious website tricks a user's browser into making unauthorized requests to another website where the user is authenticated.

```
┌─────────────────────────────────────────────────────────────┐
│              CSRF ATTACK SCENARIO (Without Protection)       │
└─────────────────────────────────────────────────────────────┘

Step 1: User is logged into your app
┌──────────────┐
│   Browser    │  ← Has session cookies for your-app.com
└──────────────┘

Step 2: User visits malicious site (while still logged in)
┌──────────────┐
│   Browser    │  ← Visits evil-site.com
└──────────────┘
       │
       │ evil-site.com serves HTML:
       │ <form action="https://your-app.com/api/followers/1" method="POST">
       │   <input type="hidden" name="count" value="0">
       │ </form>
       │ <script>document.forms[0].submit();</script>
       ▼
┌──────────────┐
│   Browser    │  ← Automatically submits form to your-app.com
└──────┬───────┘
       │
       │ POST https://your-app.com/api/followers/1
       │ Cookie: sessionId=abc123  ← Browser sends session cookie!
       │ Body: count=0
       ▼
┌──────────────┐
│  Your Server │  ← Sees valid session cookie
│              │  ← Thinks request is from legitimate user
│              │  ← Updates follower count to 0
└──────────────┘
       │
       │ ❌ ATTACK SUCCESSFUL
       │ User's data was modified without their consent
```

### CSRF vs XSS

| Attack Type | Method | Prevention |
|-------------|--------|------------|
| **CSRF** | Tricks browser into sending authenticated requests | CSRF tokens, SameSite cookies |
| **XSS** | Injects malicious JavaScript into your site | Input sanitization, Content Security Policy |

**Key Difference:**
- **CSRF**: Attacker cannot read the response, only perform actions
- **XSS**: Attacker can execute code and steal data

---

## Why We Need CSRF Protection

### Vulnerable Endpoints

In this application, state-changing operations (PATCH requests) need protection:

```javascript
// ❌ VULNERABLE: Anyone with your session cookie can modify data
PATCH /api/followers/1
Body: { count: 0 }

// ❌ VULNERABLE: Attacker site can trigger this
PATCH /api/overview/2
Body: { value: 999999 }
```

### Safe Endpoints

Read-only operations (GET requests) don't need CSRF protection:

```javascript
// ✅ SAFE: No state change, reading is harmless
GET /api/followers

// ✅ SAFE: Even if attacker triggers, no damage
GET /api/overview
```

### Why Cookies Make This Possible

Browsers **automatically** send cookies with every request to a domain, even from malicious sites:

```
User visits evil-site.com
↓
evil-site.com contains: <img src="https://your-app.com/api/followers">
↓
Browser automatically sends request:
GET https://your-app.com/api/followers
Cookie: sessionId=abc123  ← Sent automatically!
```

**CSRF Protection Solution:**
Add a requirement that **cookies alone are not enough** - you also need a secret token that evil-site.com cannot access.

---

## Token Exchange Flow

### Complete CSRF Protection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           CSRF TOKEN EXCHANGE - COMPLETE LIFECYCLE              │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Frontend Requests CSRF Token
──────────────────────────────────────
┌──────────────┐
│ React App    │
│ (Vercel)     │
└──────┬───────┘
       │
       │ User action triggers PATCH request
       │ (e.g., update follower count)
       ▼
┌──────────────┐
│ api.js       │  ← updateFollower() called
│              │  ← Needs CSRF token first
└──────┬───────┘
       │
       │ 1. Check if token already cached
       │ 2. If not, call getCsrfToken()
       ▼
       
       GET https://backend.railway.app/api/csrf-token
       Credentials: include  ← Important! Sends/receives cookies
       
       ▼

STEP 2: Backend Generates Token & Cookie
─────────────────────────────────────────
┌──────────────┐
│ Express      │
│ (Railway)    │
└──────┬───────┘
       │
       │ Request hits: app.get('/api/csrf-token', ...)
       ▼
┌──────────────┐
│ csrf         │  ← csurf middleware
│ middleware   │
└──────┬───────┘
       │
       │ 1. Generates secret (stored in cookie)
       │    Example: "xQzP8nM2vR..."
       │
       │ 2. Generates token (derived from secret)
       │    Example: "L9mK3jH8tF..."
       │
       │ 3. Token is signed with secret
       │    Token = sign(secret, salt)
       ▼
       
       HTTP/1.1 200 OK
       Set-Cookie: _csrf=xQzP8nM2vR...; HttpOnly; Secure; SameSite=None
       Content-Type: application/json
       Body: { csrfToken: "L9mK3jH8tF..." }
       
       ▼

STEP 3: Frontend Stores Token & Cookie
───────────────────────────────────────
┌──────────────┐
│ Browser      │
└──────┬───────┘
       │
       │ Receives response:
       │ 1. Cookie stored automatically by browser
       │    _csrf=xQzP8nM2vR... (HttpOnly - JS cannot access)
       │
       │ 2. Token returned in response body
       │    { csrfToken: "L9mK3jH8tF..." }
       ▼
┌──────────────┐
│ api.js       │
└──────┬───────┘
       │
       │ Caches token in memory:
       │ let cachedCsrfToken = "L9mK3jH8tF...";
       │
       │ Now ready to make PATCH request
       ▼

STEP 4: Frontend Sends Protected Request
─────────────────────────────────────────
┌──────────────┐
│ api.js       │
└──────┬───────┘
       │
       │ PATCH request includes:
       │ 1. Token in header (from cached value)
       │ 2. Cookie (automatically sent by browser)
       ▼
       
       PATCH https://backend.railway.app/api/followers/1
       Headers:
         CSRF-Token: L9mK3jH8tF...  ← From response body (JS accessible)
         Cookie: _csrf=xQzP8nM2vR... ← From Set-Cookie (auto-sent)
         Content-Type: application/json
       Body: { count: 1500 }
       
       ▼

STEP 5: Backend Validates Token
────────────────────────────────
┌──────────────┐
│ Express      │
└──────┬───────┘
       │
       │ Request arrives at: app.patch('/api/followers/:id', ...)
       ▼
┌──────────────┐
│ csrf         │  ← csurf middleware (runs before route handler)
│ middleware   │
└──────┬───────┘
       │
       │ Validation process:
       │
       │ 1. Extract cookie secret
       │    From Cookie header: _csrf=xQzP8nM2vR...
       │
       │ 2. Extract token
       │    From CSRF-Token header: L9mK3jH8tF...
       │
       │ 3. Verify token is signed by secret
       │    verify(token, secret) === true?
       │
       │ 4. Check token hasn't expired (if applicable)
       │
       ├─── ✅ Valid? Continue to route handler
       │
       └─── ❌ Invalid? Return 403 Forbidden
       
       ▼

STEP 6A: Success - Request Processed
─────────────────────────────────────
┌──────────────┐
│ Route        │
│ Handler      │
└──────┬───────┘
       │
       │ const { id } = req.params;
       │ const updates = req.body;
       │ 
       │ const follower = db.data.followers.find(f => f.id === id);
       │ Object.assign(follower, updates);
       │ await db.write();
       ▼
       
       HTTP/1.1 200 OK
       Content-Type: application/json
       Body: { follower: { id: "1", count: 1500, ... } }
       
       ▼
┌──────────────┐
│ React App    │  ← Updates UI with new data
└──────────────┘

STEP 6B: Failure - Invalid Token
─────────────────────────────────
┌──────────────┐
│ csrf         │
│ middleware   │
└──────┬───────┘
       │
       │ Token validation failed!
       ▼
       
       HTTP/1.1 403 Forbidden
       Content-Type: application/json
       Body: { error: "invalid csrf token" }
       
       ▼
┌──────────────┐
│ api.js       │
└──────┬───────┘
       │
       │ catch (error) {
       │   if (error.status === 403) {
       │     cachedCsrfToken = null;  ← Clear invalid token
       │     // Retry will fetch new token
       │   }
       │ }
       ▼
┌──────────────┐
│ React App    │  ← Shows error message
└──────────────┘
```

### Why This Prevents CSRF

```
┌─────────────────────────────────────────────────────────────┐
│         CSRF ATTACK BLOCKED WITH TOKEN PROTECTION            │
└─────────────────────────────────────────────────────────────┘

Step 1: Attacker tries same attack
┌──────────────┐
│ evil-site.com│  ← Malicious website
└──────┬───────┘
       │
       │ Tries to send:
       │ PATCH https://your-app.com/api/followers/1
       │ Body: { count: 0 }
       ▼
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ Sends request with:
       │ Cookie: _csrf=xQzP8nM2vR...  ← Browser auto-sends
       │ CSRF-Token: ???              ← evil-site.com has no way to get this!
       │
       │ Problem for attacker:
       │ - Cannot read token from cookie (HttpOnly)
       │ - Cannot call /api/csrf-token and read response (CORS blocks it)
       │ - Cannot guess token (cryptographically secure)
       ▼
┌──────────────┐
│ Your Server  │
└──────┬───────┘
       │
       │ csrf middleware checks:
       │ ✅ Cookie present: _csrf=xQzP8nM2vR...
       │ ❌ Token missing or invalid
       │
       │ Result: Validation fails
       ▼
       
       HTTP/1.1 403 Forbidden
       Body: { error: "invalid csrf token" }
       
       ✅ ATTACK BLOCKED!
       ✅ User's data is safe
```

---

## Implementation Details

### Backend Implementation

**File: `Server/index.js`**

```javascript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5174;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

// ────────────────────────────────────────────────────────────
// MIDDLEWARE SETUP (Order matters!)
// ────────────────────────────────────────────────────────────

// 1. CORS - Must come first to handle preflight requests
app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true  // ← Required for cookies
}));

// 2. Body parser - Parse JSON request bodies
app.use(express.json());

// 3. Cookie parser - Required by csurf
app.use(cookieParser());

// 4. CSRF protection - Configure cookie settings
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,      // ← JavaScript cannot access cookie
    secure: isProduction, // ← HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // ← Cross-site in production
    maxAge: 3600000      // ← 1 hour expiration
  }
});

// ────────────────────────────────────────────────────────────
// CSRF TOKEN ENDPOINT
// ────────────────────────────────────────────────────────────

/**
 * GET /api/csrf-token
 * Returns a CSRF token to the client
 * Also sets the _csrf cookie with the secret
 */
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
  
  // What happens here:
  // 1. csrfProtection middleware runs first
  // 2. Generates secret, stores in cookie via Set-Cookie header
  // 3. req.csrfToken() generates token from secret
  // 4. Token returned in response body
});

// ────────────────────────────────────────────────────────────
// PROTECTED ROUTES (State-changing operations)
// ────────────────────────────────────────────────────────────

/**
 * PATCH /api/followers/:id
 * Update a follower statistic
 * Protected by CSRF token
 */
app.patch('/api/followers/:id', csrfProtection, async (req, res) => {
  try {
    // csrfProtection middleware already validated token
    // If we reach here, request is legitimate
    
    const { id } = req.params;
    const updates = req.body;
    
    const follower = db.data.followers.find(f => f.id === id);
    
    if (!follower) {
      return res.status(404).json({ error: 'Follower not found' });
    }
    
    Object.assign(follower, updates);
    await db.write();
    
    res.json({ follower });
  } catch (error) {
    console.error('Error updating follower:', error);
    res.status(500).json({ error: 'Failed to update follower' });
  }
});

/**
 * PATCH /api/overview/:id
 * Update an overview statistic
 * Protected by CSRF token
 */
app.patch('/api/overview/:id', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const overview = db.data.overview.find(o => o.id === id);
    
    if (!overview) {
      return res.status(404).json({ error: 'Overview not found' });
    }
    
    Object.assign(overview, updates);
    await db.write();
    
    res.json({ overview });
  } catch (error) {
    console.error('Error updating overview:', error);
    res.status(500).json({ error: 'Failed to update overview' });
  }
});

// ────────────────────────────────────────────────────────────
// UNPROTECTED ROUTES (Read-only operations)
// ────────────────────────────────────────────────────────────

/**
 * GET /api/followers
 * No CSRF protection needed - read-only
 */
app.get('/api/followers', (req, res) => {
  res.json({ followers: db.data.followers });
});

/**
 * GET /api/overview
 * No CSRF protection needed - read-only
 */
app.get('/api/overview', (req, res) => {
  res.json({ overview: db.data.overview });
});

// ────────────────────────────────────────────────────────────
// ERROR HANDLING
// ────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  // CSRF token validation errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ 
      error: 'invalid csrf token',
      message: 'CSRF token validation failed'
    });
  }
  
  // Other errors
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Frontend Implementation

**File: `Client/src/api.js`**

```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5174/api';

// ────────────────────────────────────────────────────────────
// CSRF TOKEN MANAGEMENT
// ────────────────────────────────────────────────────────────

/**
 * Cache for CSRF token to avoid fetching on every request
 * Token is valid for 1 hour (matches cookie maxAge)
 */
let cachedCsrfToken = null;

/**
 * Fetch CSRF token from backend
 * Also receives and stores _csrf cookie automatically
 */
async function getCsrfToken() {
  // Return cached token if available
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }
  
  try {
    const response = await fetch(`${API_BASE}/csrf-token`, {
      method: 'GET',
      credentials: 'include', // ← Required! Sends/receives cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.status}`);
    }
    
    const data = await response.json();
    cachedCsrfToken = data.csrfToken;
    
    return cachedCsrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}

// ────────────────────────────────────────────────────────────
// API FUNCTIONS - READ-ONLY (No CSRF needed)
// ────────────────────────────────────────────────────────────

/**
 * Fetch all follower statistics
 * GET /api/followers
 */
export async function fetchFollowers() {
  try {
    const response = await fetch(`${API_BASE}/followers`, {
      method: 'GET',
      credentials: 'include', // Good practice, but not required for GET
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.followers;
  } catch (error) {
    console.error('Failed to fetch followers:', error);
    throw error;
  }
}

/**
 * Fetch all overview statistics
 * GET /api/overview
 */
export async function fetchOverview() {
  try {
    const response = await fetch(`${API_BASE}/overview`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.overview;
  } catch (error) {
    console.error('Failed to fetch overview:', error);
    throw error;
  }
}

// ────────────────────────────────────────────────────────────
// API FUNCTIONS - STATE-CHANGING (CSRF required)
// ────────────────────────────────────────────────────────────

/**
 * Update a follower statistic
 * PATCH /api/followers/:id
 * Requires CSRF token
 */
export async function updateFollower(id, updates) {
  try {
    // 1. Get CSRF token (from cache or fetch new one)
    const csrfToken = await getCsrfToken();
    
    // 2. Make PATCH request with token
    const response = await fetch(`${API_BASE}/followers/${id}`, {
      method: 'PATCH',
      credentials: 'include', // ← Required! Sends _csrf cookie
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken, // ← Required! Token in header
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      // If 403, token might be invalid/expired
      if (response.status === 403) {
        cachedCsrfToken = null; // Clear cache
        throw new Error('CSRF token invalid. Please try again.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.follower;
  } catch (error) {
    console.error(`Failed to update follower ${id}:`, error);
    throw error;
  }
}

/**
 * Update an overview statistic
 * PATCH /api/overview/:id
 * Requires CSRF token
 */
export async function updateOverview(id, updates) {
  try {
    // 1. Get CSRF token (from cache or fetch new one)
    const csrfToken = await getCsrfToken();
    
    // 2. Make PATCH request with token
    const response = await fetch(`${API_BASE}/overview/${id}`, {
      method: 'PATCH',
      credentials: 'include', // ← Required! Sends _csrf cookie
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken, // ← Required! Token in header
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      // If 403, token might be invalid/expired
      if (response.status === 403) {
        cachedCsrfToken = null; // Clear cache
        throw new Error('CSRF token invalid. Please try again.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.overview;
  } catch (error) {
    console.error(`Failed to update overview ${id}:`, error);
    throw error;
  }
}
```

---

## Cookie-Based vs Header-Based

### Cookie-Based Tokens (Current Implementation)

**How it works:**
- Secret stored in **HttpOnly cookie** (cannot be read by JavaScript)
- Token returned in **response body** (can be read by JavaScript)
- PATCH requests send **both** cookie and token

**Advantages:**
- ✅ HttpOnly cookie prevents XSS from stealing secret
- ✅ Works well with cross-origin deployments (SameSite=None)
- ✅ Automatic cookie management by browser
- ✅ Token can be cached in memory (no localStorage needed)

**Disadvantages:**
- ⚠️ Requires `credentials: 'include'` on all requests
- ⚠️ More complex cookie configuration (SameSite, Secure)
- ⚠️ Cookie size limits (though CSRF cookies are small)

### Header-Based Tokens (Alternative)

**How it works:**
- Token stored in **localStorage** or **sessionStorage**
- Token sent in **custom header** on every request
- No cookies involved

**Advantages:**
- ✅ Simpler configuration (no cookie settings)
- ✅ No CORS credentials needed
- ✅ Works easily across subdomains

**Disadvantages:**
- ❌ Vulnerable to XSS (attacker can read localStorage)
- ❌ Manual token management required
- ❌ No automatic browser handling

### Why We Chose Cookie-Based

```
┌─────────────────────────────────────────────────────────┐
│         COOKIE-BASED vs HEADER-BASED COMPARISON          │
└─────────────────────────────────────────────────────────┘

Scenario: XSS Attack (Malicious script injected into your site)

COOKIE-BASED (Current Implementation):
┌──────────────┐
│ Attacker     │
│ <script>     │
│   steal()    │
│ </script>    │
└──────┬───────┘
       │
       │ Tries: document.cookie
       │ Result: "" (HttpOnly blocks access)
       │
       │ Tries: localStorage.getItem('csrf')
       │ Result: null (token in memory, not storage)
       │
       │ ✅ ATTACK BLOCKED
       │ Cannot steal secret or token

HEADER-BASED (Alternative):
┌──────────────┐
│ Attacker     │
│ <script>     │
│   steal()    │
│ </script>    │
└──────┬───────┘
       │
       │ Tries: localStorage.getItem('csrfToken')
       │ Result: "L9mK3jH8tF..." ← Token stolen!
       │
       │ Now attacker can:
       │ fetch('/api/followers/1', {
       │   method: 'PATCH',
       │   headers: { 'CSRF-Token': stolenToken },
       │   body: JSON.stringify({ count: 0 })
       │ })
       │
       │ ❌ ATTACK SUCCESSFUL
```

---

## Security Considerations

### Production Cookie Configuration

**Critical Settings for Railway/Vercel Deployment:**

```javascript
const csrfProtection = csrf({
  cookie: {
    // Prevents JavaScript access to cookie
    httpOnly: true,
    
    // Only send cookie over HTTPS (production)
    // Railway provides HTTPS by default
    secure: process.env.NODE_ENV === 'production',
    
    // Allows cross-site requests from Vercel to Railway
    // Required when frontend and backend are on different domains
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    
    // Token expires after 1 hour
    // User must fetch new token after expiration
    maxAge: 3600000, // 1 hour in milliseconds
    
    // Cookie path (optional, defaults to '/')
    path: '/',
    
    // Domain (optional, auto-set by Railway)
    // domain: '.yourdomain.com' // Uncomment for custom domains
  }
});
```

### SameSite Attribute Explained

| Value | Behavior | Use Case |
|-------|----------|----------|
| `strict` | Never sent on cross-site requests | Same-origin apps only |
| `lax` | Sent on top-level navigation (links) | Most websites (default) |
| `none` | Always sent (requires `secure: true`) | **Our case**: Vercel → Railway |

**Why we use `none` in production:**
```
Frontend: https://your-app.vercel.app
Backend:  https://your-api.railway.app

↑ Different domains = cross-site
↑ Requires SameSite=None to send cookies
```

### HTTPS Requirement

```javascript
secure: process.env.NODE_ENV === 'production'
```

**Why this matters:**
- `secure: true` means cookie only sent over HTTPS
- Railway provides HTTPS automatically
- Local development uses HTTP, so `secure: false`

**What happens if misconfigured:**
```
❌ Production with secure: false
   → Cookie sent over HTTP
   → Attacker can intercept cookie (MITM attack)

❌ Development with secure: true
   → Browser blocks cookie (localhost uses HTTP)
   → CSRF protection breaks in development
```

### Token Expiration Strategy

**Current: 1 Hour Expiration**
```javascript
maxAge: 3600000 // 1 hour
```

**Alternatives:**

1. **Session-based (expires when browser closes):**
```javascript
maxAge: undefined // Session cookie
```

2. **Long-lived (24 hours):**
```javascript
maxAge: 86400000 // 24 hours
```

3. **Short-lived (15 minutes):**
```javascript
maxAge: 900000 // 15 minutes
```

**Trade-offs:**

| Duration | Security | User Experience |
|----------|----------|----------------|
| Short (15 min) | ✅ High | ❌ Frequent re-authentication |
| Medium (1 hour) | ✅ Good | ✅ Balanced |
| Long (24 hours) | ⚠️ Lower | ✅ Seamless |

---

## Debugging & Troubleshooting

### Common Issues

#### Issue 1: "invalid csrf token" Error

**Symptom:**
```
HTTP 403 Forbidden
Body: { error: "invalid csrf token" }
```

**Possible Causes & Solutions:**

**1. Missing CSRF-Token header:**
```javascript
// ❌ Wrong: No token header
fetch('/api/followers/1', {
  method: 'PATCH',
  credentials: 'include',
  body: JSON.stringify({ count: 100 })
});

// ✅ Correct: Include token header
const token = await getCsrfToken();
fetch('/api/followers/1', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'CSRF-Token': token
  },
  body: JSON.stringify({ count: 100 })
});
```

**2. Missing credentials:**
```javascript
// ❌ Wrong: Cookie not sent
fetch('/api/followers/1', {
  method: 'PATCH',
  headers: { 'CSRF-Token': token }
});

// ✅ Correct: Include credentials
fetch('/api/followers/1', {
  method: 'PATCH',
  credentials: 'include', // ← Required!
  headers: { 'CSRF-Token': token }
});
```

**3. Token expired:**
```javascript
// Token was fetched 2 hours ago (maxAge: 1 hour)
// Solution: Clear cache and fetch new token
cachedCsrfToken = null;
const newToken = await getCsrfToken();
```

**4. Cookie not set properly:**
```bash
# Check browser DevTools → Application → Cookies
# Should see: _csrf with value

# If missing, check backend logs:
console.log('Set-Cookie header:', res.getHeader('Set-Cookie'));
```

#### Issue 2: Cookie Not Being Set

**Symptom:**
Browser doesn't store `_csrf` cookie after calling `/api/csrf-token`

**Debugging Steps:**

**1. Check CORS credentials:**
```javascript
// Backend
app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true // ← Must be true!
}));

// Frontend
fetch('/api/csrf-token', {
  credentials: 'include' // ← Must be include!
});
```

**2. Check SameSite + Secure settings:**
```javascript
// Production: Must use SameSite=None with Secure=true
cookie: {
  sameSite: 'none',
  secure: true // ← Requires HTTPS!
}
```

**3. Check browser console for warnings:**
```
Warning: Cookie was blocked because it had the "SameSite=None" 
attribute but was not marked "Secure"
```

**4. Verify HTTPS in production:**
```bash
# Backend must use HTTPS
https://your-api.railway.app ✅
http://your-api.railway.app  ❌
```

#### Issue 3: CORS Error When Fetching Token

**Symptom:**
```
Access to fetch at 'https://api.railway.app/api/csrf-token'
from origin 'https://app.vercel.app' has been blocked by CORS policy
```

**Solution:**
```bash
# Backend environment variable must match frontend exactly
ALLOWED_ORIGIN=https://app.vercel.app

# Common mistakes:
❌ ALLOWED_ORIGIN=http://app.vercel.app  (wrong protocol)
❌ ALLOWED_ORIGIN=https://app.vercel.app/  (trailing slash)
❌ ALLOWED_ORIGIN=https://www.app.vercel.app  (wrong subdomain)
```

### Debugging Tools

**1. Browser DevTools - Application Tab**
```
1. Open DevTools (F12)
2. Go to Application tab
3. Click Cookies → https://your-api.railway.app
4. Look for _csrf cookie
5. Check:
   - Value: Should be a long string
   - HttpOnly: Should be ✅
   - Secure: Should be ✅ (production)
   - SameSite: Should be None (production)
   - Expires: Should be ~1 hour in future
```

**2. Browser DevTools - Network Tab**
```
1. Open DevTools (F12)
2. Go to Network tab
3. Make a PATCH request
4. Click the request
5. Check Request Headers:
   - Cookie: _csrf=...  ✅
   - CSRF-Token: ...    ✅
6. Check Response Headers:
   - Access-Control-Allow-Origin: ...  ✅
   - Access-Control-Allow-Credentials: true  ✅
```

**3. Backend Logging**
```javascript
// Server/index.js

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Cookies:', req.cookies);
  console.log('CSRF-Token header:', req.headers['csrf-token']);
  next();
});

// Log CSRF errors
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('CSRF validation failed:');
    console.error('Cookie secret:', req.cookies._csrf);
    console.error('Token from header:', req.headers['csrf-token']);
  }
  next(err);
});
```

**4. Test with cURL**
```bash
# Step 1: Get CSRF token and cookie
curl -v -X GET https://backend.railway.app/api/csrf-token \
  -H "Origin: https://app.vercel.app" \
  -c cookies.txt

# Look for:
# < Set-Cookie: _csrf=...; HttpOnly; Secure; SameSite=None
# {"csrfToken":"..."}

# Step 2: Use token in PATCH request
curl -v -X PATCH https://backend.railway.app/api/followers/1 \
  -H "Origin: https://app.vercel.app" \
  -H "Content-Type: application/json" \
  -H "CSRF-Token: <token-from-step-1>" \
  -b cookies.txt \
  -d '{"count":999}'

# Should return 200 OK with updated data
```

---

## Best Practices

### 1. Always Use HTTPS in Production
```javascript
// ✅ Correct
const API_BASE = 'https://backend.railway.app/api';

// ❌ Wrong
const API_BASE = 'http://backend.railway.app/api';
```

### 2. Set Appropriate Token Expiration
```javascript
// ✅ Balance security and UX
maxAge: 3600000 // 1 hour

// ❌ Too long (security risk)
maxAge: 2592000000 // 30 days

// ❌ Too short (poor UX)
maxAge: 60000 // 1 minute
```

### 3. Cache Token Properly
```javascript
// ✅ In-memory cache (cleared on page refresh)
let cachedCsrfToken = null;

// ❌ localStorage (vulnerable to XSS)
localStorage.setItem('csrfToken', token);

// ❌ sessionStorage (better than localStorage but still vulnerable)
sessionStorage.setItem('csrfToken', token);
```

### 4. Handle Token Expiration Gracefully
```javascript
// ✅ Retry with new token on 403
try {
  await updateFollower(id, updates);
} catch (error) {
  if (error.status === 403) {
    cachedCsrfToken = null; // Clear cache
    await updateFollower(id, updates); // Retry (will fetch new token)
  }
  throw error;
}
```

### 5. Protect All State-Changing Endpoints
```javascript
// ✅ Protect PATCH, POST, DELETE
app.patch('/api/followers/:id', csrfProtection, handler);
app.post('/api/followers', csrfProtection, handler);
app.delete('/api/followers/:id', csrfProtection, handler);

// ❌ Don't protect GET (read-only)
app.get('/api/followers', handler); // No csrfProtection
```

---

## Summary

### How CSRF Protection Works

1. **Backend generates** secret (stored in HttpOnly cookie) and token (returned in response)
2. **Frontend caches** token in memory
3. **PATCH requests send** both cookie (automatic) and token (manual header)
4. **Backend validates** token matches secret from cookie
5. **If valid**, request proceeds; **if invalid**, 403 error

### Key Security Benefits

- ✅ Prevents unauthorized state-changing requests
- ✅ HttpOnly cookies protect against XSS
- ✅ Tokens are cryptographically secure (can't be guessed)
- ✅ Works across different domains (Vercel ← → Railway)
- ✅ Automatic token rotation on expiration

### Critical Configuration

```javascript
// Backend
cookie: {
  httpOnly: true,
  secure: true,              // HTTPS only
  sameSite: 'none',          // Cross-site
  maxAge: 3600000           // 1 hour
}

// Frontend
credentials: 'include'       // Send/receive cookies
headers: { 'CSRF-Token': token }  // Include token
```

### When CSRF Protection is NOT Needed

- ❌ GET requests (read-only)
- ❌ Public APIs (no authentication)
- ❌ Stateless APIs with bearer tokens (OAuth, JWT)

### When CSRF Protection IS Needed

- ✅ Cookie-based authentication
- ✅ State-changing operations (POST, PATCH, DELETE)
- ✅ Sensitive actions (payments, password changes)

---

## Additional Resources

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [csurf npm package](https://www.npmjs.com/package/csurf)
- [SameSite Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

---

**Related Documentation:**
- [FRONTEND_BACKEND_CONNECTION.md](./FRONTEND_BACKEND_CONNECTION.md) - How frontend and backend communicate
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
