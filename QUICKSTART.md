# Quick Start Guide

This guide will get you up and running in 5 minutes!

## 🚀 Local Development Setup

### Step 1: Install Dependencies
```bash
# From the root directory
npm run install:all
```

### Step 2: Configure Environment Variables

**Client** - Create `Client/.env.local`:
```bash
VITE_API_BASE=http://localhost:5174/api
```

**Server** - Create `Server/.env`:
```bash
PORT=5174
ALLOWED_ORIGIN=http://localhost:5173
```

Or copy from examples:
```bash
cp Client/.env.example Client/.env.local
cp Server/.env.example Server/.env
```

### Step 3: Start Development Servers
```bash
# From the root directory
npm run dev
```

This starts both:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5174

### Step 4: Open Your Browser
Navigate to http://localhost:5173 and you should see the dashboard!

---

## 🌐 Production Deployment

### Part 1: Deploy Backend (5-10 minutes)

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `Server`
5. Add environment variables:
   - `PORT=5174`
   - `ALLOWED_ORIGIN=https://your-app.vercel.app` (we'll update this in Part 2)
6. Deploy and copy your Railway URL (e.g., `https://your-app.railway.app`)

#### Option B: Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - Root Directory: `Server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variable: `ALLOWED_ORIGIN=https://your-app.vercel.app`
6. Deploy and copy your Render URL

### Part 2: Deploy Frontend (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your repository
4. Configure:
   - Root Directory: `Client`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   - `VITE_API_BASE` = `https://your-backend-url.railway.app/api`
6. Click Deploy
7. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Part 3: Update Backend CORS

Go back to your backend (Railway/Render) and update `ALLOWED_ORIGIN` to your Vercel URL:
- Railway: Dashboard → Variables → Update `ALLOWED_ORIGIN`
- Render: Dashboard → Environment → Update `ALLOWED_ORIGIN`

Wait for the backend to redeploy (~1 minute).

### Part 4: Test Your Deployment

Visit your Vercel URL and verify:
- ✅ Dashboard loads
- ✅ Follower counts display
- ✅ Theme switcher works
- ✅ No console errors

---

## 🔧 Troubleshooting

### "Failed to fetch" error
- ✅ Check that `VITE_API_BASE` includes `/api` at the end
- ✅ Verify backend is running (visit `https://your-backend-url/api/health`)

### CORS errors
- ✅ Ensure `ALLOWED_ORIGIN` in backend matches your Vercel URL exactly
- ✅ Include `https://` in the URL
- ✅ Don't include trailing slash

### Backend 404 errors
- ✅ Verify root directory is set to `Server` in hosting platform
- ✅ Check that `package.json` has correct start script
- ✅ Review deployment logs for errors

### Frontend not updating
- ✅ Clear Vercel cache and redeploy
- ✅ Check environment variables are set in Vercel dashboard
- ✅ Verify build logs for errors

---

## 📋 Checklist

### Before Deployment
- [ ] All dependencies installed locally
- [ ] Local dev servers running successfully
- [ ] Environment variables configured
- [ ] Code committed and pushed to GitHub
- [ ] No sensitive data in code

### Backend Deployment
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables set
- [ ] Health check endpoint responding
- [ ] Backend URL copied

### Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_BASE` environment variable set
- [ ] Vercel URL copied
- [ ] Backend CORS updated with Vercel URL

### Post-Deployment
- [ ] Dashboard loads in browser
- [ ] Data displays correctly
- [ ] Theme switcher works
- [ ] No console errors
- [ ] Mobile responsive design works

---

## 💡 Pro Tips

1. **Deploy backend first** - You need the backend URL for frontend deployment
2. **Use environment variables** - Never hardcode URLs in your code
3. **Test locally first** - Ensure everything works before deploying
4. **Check logs** - Deployment platforms show detailed logs for debugging
5. **Enable auto-deploy** - Configure GitHub integration for automatic deployments

---

## 🆘 Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Review the [README.md](./README.md) for architecture details
3. Check deployment platform logs for errors
4. Verify environment variables are set correctly
5. Test API endpoints directly with curl or Postman

---

## 🎉 You're Done!

Your Social Media Dashboard is now live! Share your Vercel URL and show off your work!

**Next Steps**:
- Customize the dashboard with your own data
- Add new features and components
- Implement user authentication
- Connect to real social media APIs

**Keep building! 🚀**
