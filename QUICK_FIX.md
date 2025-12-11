# Quick Fix - Railway CSRF 404 Error

## What Was Wrong
Railway was serving the `/api` folder (Vercel serverless functions) instead of running your Express server from `/Server`. The serverless functions don't have a CSRF token endpoint, causing the 404 error.

## What Was Fixed

### Files Created:
1. **`.railwayignore`** - Tells Railway to ignore Vercel functions and frontend code
2. **`Procfile`** - Explicitly tells Railway: "Run the Express server"
3. **`api/csrf-token.js`** - Backup CSRF endpoint (in case Railway still uses serverless mode)

### Files Updated:
1. **`railway.json`** - Fixed to build/run from Server directory
2. **`nixpacks.toml`** - Fixed to install dependencies and start from Server directory

## Next Steps

### 1. Commit and Push
```bash
git add .
git commit -m "Fix Railway deployment - use Express server instead of serverless functions"
git push origin dev-malachi
```

### 2. Wait for Railway to Redeploy
Railway will automatically detect the changes and redeploy. This should take 2-5 minutes.

### 3. Check Deployment Logs
In Railway dashboard:
1. Click on your service
2. Click "Deployments"
3. Click on the latest deployment
4. Watch the logs

**Look for this success message:**
```
API running on http://localhost:5174
```

**Or look for errors like:**
```
Cannot find module 'express'
ENOENT: no such file or directory
```

### 4. Test the Endpoints

Once deployed, test in your browser:

✅ **Root:** https://social-media-dashboard-production-7619.up.railway.app/
```json
{"ok":true,"message":"API running. Use /api/* endpoints."}
```

✅ **Health:** https://social-media-dashboard-production-7619.up.railway.app/api/health
```json
{"ok":true}
```

✅ **CSRF Token:** https://social-media-dashboard-production-7619.up.railway.app/api/csrf-token
```json
{"csrfToken":"some-long-token-string"}
```

If all three work, your frontend should work too! 🎉

### 5. Still Getting 404?

If you're still getting 404 errors after Railway redeploys:

#### Option A: Manual Railway Settings Override
Go to Railway Dashboard → Your Service → Settings → Deploy:

1. **Root Directory:** Set to `Server`
2. **Build Command:** `npm install`
3. **Start Command:** `node index.js`

Then trigger a manual redeploy.

#### Option B: Check for Multiple Services
Railway might have created multiple services. Check if you have:
- One service pointing to the root directory (wrong)
- One service pointing to Server directory (correct)

If so, delete the wrong one and keep the Server service.

#### Option C: View Full Logs
Click "View Logs" in Railway and look for the actual error:
- Is it trying to run from the root directory?
- Is it serving the `/api` folder?
- Are there any module not found errors?

Share the log output if you need more help.

## Why This Happened

Your repo has two backend setups:
1. **`/Server`** - Express server with CSRF protection ✅ (for Railway/Render/Heroku)
2. **`/api`** - Serverless functions ❌ (for Vercel only)

Railway auto-detected the `/api` folder and thought: "Oh, this is a serverless app!" and started serving those functions instead of running your Express server.

The `.railwayignore` file now tells Railway: "Ignore `/api`, run the Express server instead!"

## Troubleshooting

### Error: "Cannot find module 'express'"
**Cause:** Build command didn't run in Server directory
**Fix:** Check Railway settings and make sure build command is `cd Server && npm install`

### Error: "EADDRINUSE: address already in use"
**Cause:** Multiple instances trying to run
**Fix:** Check if you have duplicate services in Railway

### Error: "Permission denied"
**Cause:** Railway can't access Server directory
**Fix:** Make sure `Server/` is committed to Git and pushed

### Frontend still shows 404
**Cause:** Browser cache or old deployment
**Fix:** 
1. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Check Railway deployment timestamp
3. Verify the Railway URL hasn't changed

---

**TL;DR:** Push the changes, wait for Railway to redeploy, test the endpoints. Should work! 🚀
