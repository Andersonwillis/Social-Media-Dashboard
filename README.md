# Social Media Dashboard with Theme Switcher

A full-stack social media analytics dashboard built with React, Express, and a theme switcher feature. This project is based on a [Frontend Mentor](https://www.frontendmentor.io) challenge, enhanced with a backend API and persistent data storage.

![Design preview](other/preview.jpg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## 🎯 Overview

This dashboard displays social media statistics across multiple platforms (Facebook, Twitter, Instagram, YouTube) with:
- Real-time follower counts and engagement metrics
- Dark/light theme toggle with smooth transitions
- Responsive design for mobile and desktop
- RESTful API backend with persistent JSON storage
- Editable statistics via API endpoints

**Live Demo**: https://social-media-dashboard-kappa-rosy.vercel.app  
**API Endpoint**: https://social-media-dashboard-production-7619.up.railway.app

---

## ✨ Features

### Core Features
- ✅ **Theme Switcher**: Toggle between light and dark modes with localStorage persistence
- ✅ **Responsive Design**: Mobile-first approach with custom CSS
- ✅ **Real-time Updates**: Fetch and display data from backend API
- ✅ **RESTful API**: Express.js backend with CRUD operations
- ✅ **Data Persistence**: LowDB for JSON-based data storage
- ✅ **Modern Stack**: React 18, Vite, Express, and Clerk Authentication
- ✅ **CORS Support**: Configured for cross-origin requests
- ✅ **Error Handling**: Comprehensive error handling on both client and server

### Advanced Features
- 📊 **Analytics Dashboard**: Multi-line growth trend graphs with historical data (week/month/year/all-time)
- 🎯 **Goals Tracking**: Set and track follower/engagement goals with progress visualization
  - Auto-filled current values from dashboard data
  - Boost, complete, and remove goal functionality
  - Status indicators (ahead, on-track, at-risk, behind)
- 📈 **Reports Generation**: Create and download performance reports
  - Multiple report templates (summary, engagement, growth, comparison)
  - Filter by time period and platform
  - Recent reports history
- 🔐 **Authentication**: Clerk-powered sign-in/sign-up with role-based access control
- 👁️ **View-Only Mode**: Guest access to explore dashboard without signing in
- ⚙️ **Settings Page**: User profile management and preferences
- 🧭 **Navigation**: Centralized navigation bar with theme toggle and user controls

---

## 🛠 Tech Stack

### Frontend (Client)
- **React 18** - UI library with hooks
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing (7 pages)
- **Clerk React** - Authentication and user management
- **Custom CSS** - Responsive styling with CSS variables

### Backend (Server)
- **Express.js** - Web framework
- **LowDB 7** - JSON database with ESM support
- **CORS** - Cross-Origin Resource Sharing middleware
- **CSRF Protection** - Security with double-submit cookie pattern
- **Nodemon** - Auto-restart during development

### Deployment
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend API hosting

---

## 📁 Project Structure

```
social-media-dashboard/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx       # Main navigation bar
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── FollowerCard.jsx
│   │   │   └── OverviewCard.jsx
│   │   ├── pages/         # Route pages
│   │   │   ├── AnalyticsPage.jsx    # Growth trend graphs
│   │   │   ├── GoalsPage.jsx        # Goal tracking
│   │   │   ├── ReportsPage.jsx      # Report generation
│   │   │   ├── SettingsPage.jsx     # User settings
│   │   │   ├── SignInPage.jsx       # Authentication
│   │   │   └── SignUpPage.jsx       # Registration
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useRole.js           # RBAC hook
│   │   ├── api.js         # API client functions
│   │   ├── App.jsx        # Dashboard page
│   │   ├── main.jsx       # Entry point & routing
│   │   └── styles.css     # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── Server/                # Backend Express API
│   ├── index.js          # Express server setup
│   ├── db.js             # Database configuration
│   ├── db.json           # Data storage (followers, overview, analytics)
│   ├── autoAssignRole.js # Clerk role management
│   ├── clerkWebhook.js   # Webhook handler
│   ├── package.json
│   └── nodemon.json
│
├── api/                  # Vercel serverless functions
│   ├── analytics.js      # Historical data endpoint
│   ├── followers.js
│   ├── overview.js
│   └── total-followers.js
│
├── images/               # Static assets
├── package.json          # Root package (workspace management)
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Andersonwillis/Social-Media-Dashboard.git
   cd Social-Media-Dashboard
   ```

2. **Install all dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd Client
   npm install

   # Install server dependencies
   cd ../Server
   npm install
   cd ..
   ```

   Or use the convenience script:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Client** (`Client/.env.local`):
   ```bash
   VITE_API_BASE=http://localhost:5174/api
   ```

   **Server** (`Server/.env`):
   ```bash
   PORT=5174
   ALLOWED_ORIGIN=http://localhost:5173
   ```

   You can copy from the example files:
   ```bash
   cp Client/.env.example Client/.env.local
   cp Server/.env.example Server/.env
   ```

---

## 💻 Development

### Running Locally

The project has **two separate servers** that run independently:

#### Option 1: Run Both Servers Simultaneously (Development)
```bash
# From the root directory
npm run dev
```
This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5174

#### Option 2: Run Servers Separately

**Terminal 1 - Backend Server**:
```bash
cd Server
npm run dev
```

**Terminal 2 - Frontend Client**:
```bash
cd Client
npm run dev
```

### Why Separate Servers?

The frontend and backend run on different ports to:
1. ✅ Simulate production environment where they're on different domains
2. ✅ Enable independent deployment to different hosting services
3. ✅ Allow CORS configuration testing during development
4. ✅ Support scalable architecture patterns

**⚠️ Important for Production**: In production, the frontend (Vercel) and backend (Railway/Render) are deployed to **completely separate servers**. This is the industry-standard approach for full-stack applications.

### Development Workflow

1. **Start both servers** using `npm run dev` from the root directory
2. **Frontend will automatically reload** on file changes (Hot Module Replacement)
3. **Backend will automatically restart** on file changes (Nodemon)
4. **Test your changes** at http://localhost:5173
5. **Check API responses** at http://localhost:5174/api/health

### Available Scripts

#### Root Directory
```bash
npm run dev              # Start both client and server
npm run dev:client       # Start only the client
npm run dev:server       # Start only the server
npm run install:all      # Install all dependencies
```

#### Client Directory
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

#### Server Directory
```bash
npm run dev              # Start with Nodemon (auto-reload)
npm start                # Start production server
```

---

## 🌐 Deployment

### Quick Deployment Overview

1. **Backend First**: Deploy the Express API to Railway, Render, or Heroku
2. **Frontend Second**: Deploy the React app to Vercel with the backend URL
3. **Update CORS**: Configure backend to allow requests from your Vercel domain

### Detailed Instructions

For complete deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

The deployment guide covers:
- ✅ Step-by-step deployment for Railway, Render, and Heroku
- ✅ Environment variable configuration
- ✅ CORS setup for production
- ✅ Troubleshooting common issues
- ✅ Continuous deployment setup
- ✅ Cost estimates and platform comparisons

### Quick Deploy Links

**Backend Options**:
- [Deploy to Railway](https://railway.app)
- [Deploy to Render](https://render.com)
- [Deploy to Heroku](https://heroku.com)

**Frontend**:
- [Deploy to Vercel](https://vercel.com)

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5174/api`
- **Production**: `https://your-backend.railway.app/api`

### Endpoints

#### Health Check
```http
GET /api/health
```
Response:
```json
{
  "ok": true
}
```

#### Get All Followers
```http
GET /api/followers
```
Response:
```json
[
  {
    "id": "facebook",
    "platform": "Facebook",
    "username": "@nathanf",
    "count": 1987,
    "change": 12,
    "isUp": true
  },
  ...
]
```

#### Get Overview Stats
```http
GET /api/overview
```
Response:
```json
[
  {
    "id": "facebook-page-views",
    "platform": "Facebook",
    "label": "Page Views",
    "count": 87,
    "change": 3,
    "isUp": true
  },
  ...
]
```

#### Get Total Followers
```http
GET /api/total-followers
```
Response:
```json
{
  "total": 23004
}
```

#### Update Follower Count
```http
PATCH /api/followers/:id
Content-Type: application/json

{
  "count": 2000,
  "change": 15
}
```

#### Update Overview Stat
```http
PATCH /api/overview/:id
Content-Type: application/json

{
  "count": 100,
  "change": 5
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Project Notes

### Architecture Decisions

- **Separate Deployments**: Frontend and backend are deployed independently to follow modern full-stack architecture patterns
- **JSON Database**: Using LowDB for simplicity - easily upgradeable to PostgreSQL/MongoDB for production
- **Environment Variables**: All environment-specific configuration is externalized
- **CORS Configuration**: Properly configured to only allow requests from authorized origins

### Known Limitations

- LowDB is file-based and not suitable for high-traffic production use
- No authentication/authorization implemented
- No rate limiting on API endpoints

### Future Enhancements

- [ ] Add user authentication
- [ ] Implement real OAuth connections to social media APIs
- [ ] Add PostgreSQL/MongoDB for production database
- [ ] Implement Redis caching layer
- [ ] Add comprehensive test coverage
- [ ] Add API rate limiting
- [ ] Implement WebSocket for real-time updates

---

## 📄 License

This project is based on a Frontend Mentor challenge and is provided as-is for educational purposes.

---

## 🙏 Acknowledgments

- Design by [Frontend Mentor](https://www.frontendmentor.io)
- Icons from the Frontend Mentor design files
- Built as part of a web development course project

---

## 📞 Contact

**Repository**: [github.com/Andersonwillis/Social-Media-Dashboard](https://github.com/Andersonwillis/Social-Media-Dashboard)

**Issues**: [Report a bug](https://github.com/Andersonwillis/Social-Media-Dashboard/issues)

---

**Happy Coding! 🚀**

This repository contains a small React (Vite) frontend and an Express prototype backend that serves a lowdb JSON database. The app is a Frontend Mentor coding challenge implementation that shows social media follower counts and overview metrics with a light/dark theme toggle.

Live preview: (this is a local project — run it locally; see "Run locally" below)

Key features
- React + Vite frontend
- Express backend (Node) with lowdb JSON datastore
- Theme switch (light / dark)
- Dashboard cards for followers and overview stats

Project structure

```
/
	Client/                # Vite React app
		src/
			components/       # UI components (Header, FollowerCard, OverviewCard, ThemeToggle)
			App.jsx
			main.jsx
			styles.css
		package.json
	Server/                # Prototype API
		index.js             # Express routes: /api/followers, /api/overview, /api/total-followers
		db.js                # lowdb initialization
		db.json              # sample data
		package.json
	images/                # assets
	README-template.md
	README.md              # this file
```

Requirements
- Node.js 16+ (recommended 18+)

Run locally (development)

1) Start the backend API

```bash
cd Server
npm install
npm run dev    # starts nodemon -> node index.js
```

You should see: "API running on http://localhost:5174"

Quick API checks

```bash
curl -i http://localhost:5174/
curl -i http://localhost:5174/api/overview
curl -i http://localhost:5174/api/followers
curl -i http://localhost:5174/api/total-followers
```

2) Start the client

```bash
cd Client
npm install
npm run dev    # starts Vite dev server (default port 5173)
```

Open the app in your browser at the Vite URL (usually http://localhost:5173).

Notes on development
- The client uses `VITE_API_BASE` to configure the API base URL. For local development the project provides `Client/.env` with `VITE_API_BASE=/api` and a Vite proxy in `Client/vite.config.js` that forwards `/api/*` to `http://localhost:5174`.
- If you change environment variables or Vite config, restart the Vite dev server so the new config takes effect.
- If you see proxy errors like `ECONNREFUSED` in the Vite terminal, make sure the backend is started and listening on port 5174.

Testing & debugging
- Server logs incoming requests (timestamp, method, path, status and Content-Type) to help debug API calls.
- Client API helpers (Client/src/api.js) check `Content-Type` and will throw detailed errors if the API returns non-JSON responses.

Git & deployment
- This project is intended to be submitted from a feature/dev branch (for example `dev-malachi`). Make sure your branch is pushed to a public GitHub repo for submission.

**Production Deployment (Vercel - Full Stack):**
- This project is configured for **one-click Vercel deployment** with both frontend and backend
- The `/api` folder contains Vercel serverless functions that replace the Express server in production
- Simply run `npx vercel --prod` from the root directory
- The app will be fully functional with a working API at your Vercel URL

**Alternative Deployment:**
- Client only: Build the Vite app (`npm run build` in `Client`) and host the `dist/` output on Netlify or GitHub Pages
- Backend separately: Deploy `Server/` to platforms that support Node (Render, Railway, Fly.io)
- Note: For split deployment, update `Client/.env` with your backend URL

What to improve (suggestions)
- Add an About route and navigation if you want multiple pages.
- Add authentication or a real database for a production-ready backend.
- Add unit tests and a CI workflow if you want a stronger submission.

Contact / Author
- Project coded by Malachi Anderson & Evan Bellig (as provided in the challenge template).

License
- This project is provided as-is for the Frontend Mentor challenge.
