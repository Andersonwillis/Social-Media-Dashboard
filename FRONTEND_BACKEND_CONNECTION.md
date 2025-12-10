# Frontend-Backend Connection - Simple Guide

## What's Happening Here?

Your app is split into two parts that talk to each other:
- **Frontend (React)** - The website users see, hosted on Vercel
- **Backend (Express)** - The API server with your data, hosted on Railway

Think of it like a restaurant: the frontend is the waiter (takes orders, shows results), and the backend is the kitchen (processes requests, manages data).

---

## Quick Overview

## Quick Overview

### Development (Your Computer)

```
Your Browser (localhost:5173)
    ↓
  React App runs here
    ↓
  Makes API calls to → Express Server (localhost:5174)
    ↓
  Gets data back ← Database (db.json)
```

**Both servers run on your computer, different ports.**

### Production (Live on Internet)

```
User's Browser
    ↓
  Visits Vercel → Gets React App (HTML/CSS/JS)
    ↓
  React App makes API calls → Railway Server
    ↓
  Gets data back ← Database (db.json)
```

**Frontend and backend are on completely different servers.**

---

## The Key Difference: Environment Variables

Your app needs to know where to find the backend. This changes between development and production.

**Development** (on your computer):
```bash
# Client/.env.local
VITE_API_BASE=http://localhost:5174/api
```

**Production** (on the internet):
```bash
# Set on Vercel
VITE_API_BASE=https://your-backend.railway.app/api
```

The React app uses this URL to make API calls. When you change this variable, you must **rebuild** the app (Vite bakes it into the code at build time).

---

## How a Request Actually Works

Let's say a user wants to see their follower stats. Here's what happens:

### Step 1: User Opens Your App
```
User types: https://your-app.vercel.app
    ↓
Vercel sends back: index.html + React code
    ↓
Browser runs the React app
```

### Step 2: React Fetches Data
```javascript
// In your React component
useEffect(() => {
  fetchFollowers(); // This runs when page loads
}, []);
```

### Step 3: API Client Makes the Call
```javascript
// Client/src/api.js
const API_BASE = import.meta.env.VITE_API_BASE; // Uses env variable

fetch(`${API_BASE}/followers`)
  // Full URL: https://your-backend.railway.app/api/followers
```

### Step 4: Browser Adds Special Headers
```
GET https://your-backend.railway.app/api/followers
Origin: https://your-app.vercel.app  ← Browser adds this automatically
```

### Step 5: Backend Checks "Who's Asking?"
```javascript
// Server/index.js
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN // Must match the Origin header!
}));

// If Origin matches → ✅ Allow request
// If Origin doesn't match → ❌ Block request (CORS error)
```

### Step 6: Backend Sends Data Back
```javascript
app.get('/api/followers', (req, res) => {
  res.json({ followers: db.data.followers });
});
```

### Step 7: React Updates the UI
```javascript
const data = await fetchFollowers();
setFollowers(data); // React re-renders with new data
```

---

## What is CORS and Why Does it Matter?

**CORS = Cross-Origin Resource Sharing**

Imagine you're at a secure building:
- **Your frontend (Vercel)** = Someone trying to enter
- **Your backend (Railway)** = The building
- **CORS** = The security guard checking IDs

### The Problem CORS Solves

Without CORS, any website could make requests to your API:
```
Evil website → Your API → Steals/changes data
```

With CORS, only approved websites can access your API:
```
Your website → Your API → ✅ Allowed
Evil website → Your API → ❌ Blocked by browser
```

### How to Configure CORS

**Backend** (tells who is allowed in):
```javascript
app.use(cors({
  origin: 'https://your-app.vercel.app', // Only this site is allowed
  credentials: true // Allow cookies
}));
```

**Frontend** (proves who they are):
```javascript
fetch(url, {
  credentials: 'include' // Include cookies to prove identity
});
```

### Common CORS Mistakes

❌ **Wrong protocol**: `http://` vs `https://`
❌ **Trailing slash**: `https://app.com/` vs `https://app.com`
❌ **Wrong subdomain**: `www.app.com` vs `app.com`

The `ALLOWED_ORIGIN` must match **exactly**.

---

## Common Problems & How to Fix Them

### Problem 1: "CORS Error" in Browser Console

**What you see:**
```
Access to fetch has been blocked by CORS policy
```

**What it means:**
Your backend is rejecting requests from your frontend.

**How to fix:**
```bash
# On Railway, check this environment variable:
ALLOWED_ORIGIN=https://your-app.vercel.app

# Make sure it matches your Vercel URL exactly!
# Check in browser: console.log(window.location.origin)
```

### Problem 2: "404 Not Found" on API Calls

**What you see:**
```
GET https://backend.com/followers → 404
```

**What it means:**
The URL is wrong (missing `/api` prefix).

**How to fix:**
```javascript
// Make sure your env variable includes /api
VITE_API_BASE=https://backend.railway.app/api
//                                          ↑ Don't forget this!
```

### Problem 3: Old API URL After Changing Env Variable

**What it means:**
Vite "bakes" the env variable into your code when you build. Changing the env variable doesn't update the already-built code.

**How to fix:**
```bash
# On Vercel, after changing VITE_API_BASE:
# Push new commit OR trigger manual redeploy
# This rebuilds your app with the new URL
```

---

## Debugging Tips

### Check if Backend is Running
```bash
# Visit in browser or use curl:
curl https://your-backend.railway.app/api/health

# Should return: { status: "ok" }
```

### Check Request in Browser
1. Open DevTools (F12)
2. Go to **Network** tab
3. Make a request
4. Click on the request
5. Check:
   - **Request URL** - Is it correct?
   - **Status Code** - 200 = good, 403/404 = problem
   - **Response Headers** - Look for `Access-Control-Allow-Origin`

### Check Cookies
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Cookies** on left side
4. Look for your backend domain
5. Should see cookies if you're using authentication

---

## Best Practices

### ✅ Always Use Environment Variables
```javascript
// Good
const API_BASE = import.meta.env.VITE_API_BASE;

// Bad (hardcoded URL)
const API_BASE = 'https://my-api.railway.app/api';
```

### ✅ Handle Errors Gracefully
```javascript
try {
  const data = await fetchFollowers();
  setFollowers(data);
} catch (error) {
  setError('Failed to load data. Please try again.');
  console.error(error);
}
```

### ✅ Show Loading States
```javascript
const [loading, setLoading] = useState(true);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;
return <FollowersList data={followers} />;
```

### ✅ Use Specific CORS Origins (Not Wildcards)
```javascript
// Good (production)
origin: 'https://your-app.vercel.app'

// Bad (allows any website)
origin: '*'
```

---

## Quick Reference

### Environment Variables Needed

**Frontend (Vercel):**
```
VITE_API_BASE=https://your-backend.railway.app/api
```

**Backend (Railway):**
```
ALLOWED_ORIGIN=https://your-app.vercel.app
PORT=5174
```

### Required Code Patterns

**Frontend API Call:**
```javascript
const response = await fetch(`${API_BASE}/followers`, {
  credentials: 'include' // Important for cookies
});
```

**Backend CORS Setup:**
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true
}));
```

---

## Summary

1. **Two Servers**: Frontend (Vercel) and Backend (Railway) are separate
2. **Environment Variables**: Tell each server where to find the other
3. **CORS**: Security feature that checks "who's allowed to access my API"
4. **Credentials**: Needed if you're using cookies for authentication
5. **Debugging**: Use browser DevTools Network tab to see what's happening

**Remember**: If you change environment variables, you need to redeploy (especially frontend, since Vite bakes them into the build).

---

**Next Steps:**
- Read [CSRF_TOKEN_EXCHANGE.md](./CSRF_TOKEN_EXCHANGE.md) for security details
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for overall system design
