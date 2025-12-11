# Vercel Dashboard Settings Configuration

## ⚠️ IMPORTANT: Manual Dashboard Configuration Required

Vercel requires you to manually set the **Root Directory** in the dashboard. The `vercel.json` file cannot override this setting.

## Steps to Configure Vercel Dashboard:

### 1. Go to Project Settings
- Navigate to: https://vercel.com/dashboard
- Select: **social-media-dashboard** project
- Click: **Settings** tab

### 2. Build & Development Settings

Navigate to: **Settings** → **General** → **Build & Development Settings**

#### Set Root Directory:
```
Root Directory: Client
```
**IMPORTANT:** Click the "Edit" button next to Root Directory and check/enable it!

#### Framework Preset:
```
Framework Preset: Other
```
(or leave as Vite if detected)

#### Build Command (Override):
```
npm install --legacy-peer-deps && npm run build
```

#### Output Directory:
```
dist
```

#### Install Command (Override):
```
npm install --legacy-peer-deps
```

### 3. Save Changes
Click **Save** at the bottom of the page.

### 4. Redeploy
Go to **Deployments** tab and click **Redeploy** on the latest deployment.

---

## Why This Is Needed

The error shows Vercel is installing from `/vercel/path0` (root) which pulls in:
- Root workspace dependencies
- Server dependencies (including lowdb, express, etc.)
- Dev dependencies from root package.json
- This causes Rollup native module conflicts

By setting Root Directory to `Client`, Vercel will:
- Work from `/vercel/path0/Client` as the root
- Only install Client dependencies
- Avoid Server and root workspace pollution
- Build successfully with Vite

---

## Alternative: If Dashboard Settings Don't Work

If Vercel continues to ignore the Root Directory setting, we may need to:

1. Create a separate repository for the Client code only
2. Or use Vercel's CLI to deploy: `vercel --cwd Client`
3. Or restructure the monorepo to have Client at the root

---

## Verification

After saving settings, the build logs should show:
- Working directory: `/vercel/path0` (but this will be the Client directory)
- No root workspace dependencies being installed
- Only Client's package.json dependencies

If you still see `/vercel/path0/Client` in logs after setting Root Directory, the setting wasn't applied correctly.
