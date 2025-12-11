# CSRF Token 404 Error - Railway Deployment Fix

## Problem
The application is showing this error:
```
Failed to load resource: the server responded with a status of 404 ()
Error: Failed to fetch CSRF token: 404
```

This occurs because Railway cannot find the `/api/csrf-token` endpoint.

## Root Cause
**Railway is auto-detecting the `/api` folder** (which contains Vercel serverless functions) and trying to serve those instead of running the Express server from `/Server` directory.

The `/api` folder was designed for Vercel deployment and doesn't have a CSRF token endpoint. Railway needs to **ignore** this folder and run the Express server instead.

## Solution

I've created the following files to fix this issue:

### Files Created/Updated:
1. **`.railwayignore`** - Tells Railway to ignore the `/api` folder (Vercel functions)
2. **`Procfile`** - Explicitly tells Railway to run the Express server
3. **`railway.json`** - Updated with correct build/start commands
4. **`nixpacks.toml`** - Updated to install and run from Server directory

### What These Files Do:
- `.railwayignore` prevents Railway from detecting and serving the Vercel serverless functions
- `Procfile` is a standard deployment file that tells Railway exactly what to run
- The updated configs ensure Railway builds and runs from the `/Server` directory

## Deployment Steps

### 1. Push Changes to GitHub

Commit and push all the new configuration files:

```bash
git add .railwayignore Procfile railway.json nixpacks.toml
git commit -m "Fix Railway deployment to use Express server instead of serverless functions"
git push origin dev-malachi
```

### 2. Verify Railway Service Configuration (Optional)

In your Railway dashboard:
1. Go to your service
2. Click on **Settings** → **Deploy**
3. Check the following settings:

**Root Directory:** Should be blank (we'll use commands to navigate) OR set to `Server`

**Build Command:**
```bash
npm install --prefix Server
```

**Start Command:**
```bash
npm run start:server
```

OR if Railway doesn't recognize workspace commands:

**Start Command:**
```bash
cd Server && npm start
```

### 2. Alternative: Set Root Directory

If the above doesn't work, try setting the **Root Directory** explicitly:

1. Go to Railway Dashboard → Your Service → Settings
2. Under **Deploy** section
3. Set **Root Directory** to: `Server`
4. Set **Build Command** to: `npm install`
5. Set **Start Command** to: `npm start`

### 3. Verify Environment Variables

Make sure these are set in Railway:
```
NODE_ENV=production
PORT=5174
ALLOWED_ORIGIN=https://your-frontend-domain.vercel.app
```

Replace `your-frontend-domain.vercel.app` with your actual Vercel URL.

### 4. Check Deployment Logs

After updating the configuration:
1. Trigger a new deployment
2. Check the logs in Railway dashboard
3. Look for:
   - `API running on http://localhost:5174` (or your PORT)
   - Any error messages about missing files or modules

### 5. Test the Endpoint

Once deployed, test these URLs in your browser:

```
https://social-media-dashboard-production-7619.up.railway.app/
https://social-media-dashboard-production-7619.up.railway.app/api/health
https://social-media-dashboard-production-7619.up.railway.app/api/csrf-token
```

All three should return JSON responses without 404 errors.

## What Changed

The updated configuration files:
- `railway.json` - Now uses `npm install --prefix Server` and `npm run start:server`
- `nixpacks.toml` - Now installs dependencies and runs the server from the correct directory

## If Still Not Working

### Option A: Remove the `/api` folder temporarily
The `/api` folder might confuse Railway into thinking this is a serverless deployment.

1. Rename `/api` to `/api-serverless-backup`
2. Push to GitHub
3. Let Railway redeploy

### Option B: Use Railway CLI
Deploy directly using Railway CLI to have more control:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Deploy from Server directory
cd Server
railway up
```

### Option C: Check Railway Logs for Specific Errors

In Railway dashboard, click on **View Logs** and look for:
- Module not found errors
- Port binding issues
- CSRF middleware errors

## Common Issues

### Issue: "Cannot find module 'csurf'"
**Solution:** Make sure `Server/package.json` has all dependencies:
```json
{
  "dependencies": {
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "csurf": "^1.11.0",
    "express": "^4.19.2",
    "lowdb": "^7.0.1"
  }
}
```

### Issue: "Port already in use"
**Solution:** Railway sets the PORT environment variable automatically. The code already handles this:
```javascript
const PORT = process.env.PORT || 5174;
```

### Issue: CORS errors after fixing 404
**Solution:** Update `ALLOWED_ORIGIN` in Railway to match your frontend domain exactly:
```
ALLOWED_ORIGIN=https://your-exact-vercel-url.vercel.app
```

## Quick Test Script

Test if your server is running correctly locally:

```bash
cd Server
npm install
npm start
```

Then in another terminal:
```bash
curl http://localhost:5174/
curl http://localhost:5174/api/health
curl http://localhost:5174/api/csrf-token
```

All three should return JSON responses.

## Next Steps

After fixing Railway deployment:
1. Update frontend's `VITE_API_BASE` environment variable in Vercel
2. Test CSRF token fetch from frontend
3. Verify PATCH requests work correctly
4. Check that cookies are being set properly

---

**Note:** The `/api` folder contains serverless functions for Vercel deployment. Railway should be deploying the Express server from `/Server` directory instead.
