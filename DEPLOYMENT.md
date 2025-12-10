# Deployment Guide

This project consists of two separate applications that need to be deployed independently:
- **Frontend (Client)**: React application built with Vite
- **Backend (Server)**: Express.js API server with JSON database

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Vercel        │         │  Railway/Render │
│   (Frontend)    │────────▶│   (Backend)     │
│   React + Vite  │  HTTPS  │   Express API   │
└─────────────────┘         └─────────────────┘
```

**Important**: The frontend and backend must be deployed separately. The frontend is deployed to Vercel, and the backend should be deployed to a Node.js hosting service like Railway, Render, or Heroku.

---

## Backend Deployment

### Option 1: Railway (Recommended)

Railway is a modern platform with excellent Node.js support and automatic deployments from GitHub.

#### Steps:

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Choose the `Server` folder as the root directory

3. **Configure Environment Variables**
   - In the Railway dashboard, go to your service
   - Click on "Variables"
   - Add the following variables:
     ```
     PORT=5174
     ALLOWED_ORIGIN=https://your-vercel-app.vercel.app
     ```
   - Replace `your-vercel-app.vercel.app` with your actual Vercel domain

4. **Configure Build Settings**
   - Railway should auto-detect Node.js
   - Start Command: `npm start`
   - Build Command: `npm install`
   - Root Directory: `/Server`

5. **Deploy**
   - Railway will automatically deploy your app
   - You'll get a URL like: `https://your-app.railway.app`
   - Copy this URL - you'll need it for the frontend deployment

---

### Option 2: Render

Render is another excellent platform with a generous free tier.

#### Steps:

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo

3. **Configure the Service**
   - **Name**: `social-media-dashboard-api` (or your choice)
   - **Root Directory**: `Server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add:
     ```
     PORT=5174
     ALLOWED_ORIGIN=https://your-vercel-app.vercel.app
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (first deployment takes a few minutes)
   - Copy your Render URL: `https://your-app.onrender.com`

---

### Option 3: Heroku

Heroku is a classic platform with extensive documentation.

#### Steps:

1. **Install Heroku CLI**
   ```bash
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a New App**
   ```bash
   cd Server
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set ALLOWED_ORIGIN=https://your-vercel-app.vercel.app
   heroku config:set PORT=5174
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix Server heroku main
   ```
   Or use Heroku's GitHub integration for automatic deployments.

6. **Get Your URL**
   - Your app will be at: `https://your-app-name.herokuapp.com`

---

## Frontend Deployment (Vercel)

### Prerequisites
- Backend must be deployed first
- You need the backend URL from above

### Steps:

1. **Install Vercel CLI** (optional, can also deploy via web)
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment Variables**
   - Create a `.env.production` file in the `Client` folder:
     ```
     VITE_API_BASE=https://your-backend-url.railway.app/api
     ```
   - Replace with your actual backend URL

3. **Deploy via Vercel Dashboard** (Recommended)
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `Client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variable:
     - Key: `VITE_API_BASE`
     - Value: `https://your-backend-url.railway.app/api`
   - Click "Deploy"

4. **Deploy via CLI** (Alternative)
   ```bash
   cd Client
   vercel --prod
   ```

5. **Update Backend CORS**
   - Once you have your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Update the backend's `ALLOWED_ORIGIN` environment variable:
     - Railway: Update in Variables section
     - Render: Update in Environment tab
     - Heroku: `heroku config:set ALLOWED_ORIGIN=https://your-app.vercel.app`

---

## Post-Deployment Testing

1. **Test Backend**
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```
   Should return: `{"ok":true}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Check browser console for errors
   - Verify data loads correctly

3. **Common Issues**
   - **CORS Errors**: Make sure `ALLOWED_ORIGIN` matches your Vercel URL exactly
   - **API Not Found**: Verify `VITE_API_BASE` includes `/api` at the end
   - **500 Errors**: Check backend logs in Railway/Render dashboard

---

## Environment Variables Summary

### Backend (Server)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (set by hosting platform) | `5174` |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | `https://your-app.vercel.app` |

### Frontend (Client)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API URL | `https://your-backend.railway.app/api` |

---

## Continuous Deployment

Both platforms support automatic deployments:

- **Railway**: Automatically deploys on push to `main` branch
- **Render**: Automatically deploys on push to selected branch
- **Vercel**: Automatically deploys on push to any branch (preview) and `main` (production)

To enable:
1. Connect your GitHub repository
2. Select the branch to deploy
3. Future pushes will trigger automatic deployments

---

## Monitoring & Logs

### Railway
- View logs in dashboard under "Deployments" → "View Logs"
- Set up notifications for deployment failures

### Render
- View logs in dashboard under "Logs" tab
- Enable email notifications

### Vercel
- View logs in dashboard under "Deployments" → Click deployment → "Logs"
- Function logs available for serverless functions

---

## Cost Estimates

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Railway | $5 credit/month | $5/month per service |
| Render | 750 hours/month | $7/month |
| Heroku | 1000 hours/month | $7/month |
| Vercel | Unlimited | $20/month (Pro) |

**Note**: Free tiers may have limitations like cold starts or sleep after inactivity.

---

## Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl https://your-backend-url/api/health

# Common fixes:
# 1. Ensure PORT environment variable is set
# 2. Verify package.json has correct start script
# 3. Check logs for errors
```

### Frontend Issues
```bash
# Verify environment variables are set
cat Client/.env.production

# Rebuild with correct API URL
cd Client
npm run build

# Common fixes:
# 1. Ensure VITE_API_BASE includes /api
# 2. Check browser console for CORS errors
# 3. Verify backend URL is accessible
```

---

## Security Notes

1. **Never commit `.env` files** - Only commit `.env.example`
2. **Use HTTPS** - Both frontend and backend should use HTTPS in production
3. **Configure CORS properly** - Only allow your frontend domain
4. **Protect sensitive data** - Don't expose database credentials in client code

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Heroku Docs: https://devcenter.heroku.com

---

**Pro Tip**: Deploy the backend first, then use its URL when deploying the frontend. This ensures the frontend can connect to the API immediately after deployment.
