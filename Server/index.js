import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { db, initDB } from './db.js';
import { doubleCsrf } from 'csrf-csrf';

const app = express();

// Configure CORS to allow requests from the frontend
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'http://localhost:5174', // Local development (alternative port)
  'https://social-media-dashboard-kappa-rosy.vercel.app', // Production Vercel
  process.env.ALLOWED_ORIGIN // Custom origin from env variable
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or matches Vercel preview deployments
    if (allowedOrigins.includes(origin) || (origin && origin.includes('.vercel.app'))) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['set-cookie']
}));

// Additional CORS headers for preflight requests
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// Configure CSRF protection with proper error handling
const CSRF_SECRET = process.env.CSRF_SECRET || 'social-media-dashboard-csrf-secret-2025-production';

let generateToken, doubleCsrfProtection;

try {
  // Initialize CSRF protection
  const csrfMethods = doubleCsrf({
    getSecret: () => CSRF_SECRET,
    cookieName: '__Host-csrf',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  });
  
  generateToken = csrfMethods.generateToken;
  doubleCsrfProtection = csrfMethods.doubleCsrfProtection;
  
  console.log('✅ CSRF Protection: ENABLED');
} catch (error) {
  console.error('❌ CSRF initialization failed:', error.message);
  console.log('⚠️  Running without CSRF protection - FOR DEVELOPMENT ONLY');
  
  // Fallback functions
  generateToken = (req, res) => 'fallback-token';
  doubleCsrfProtection = (req, res, next) => next();
}

// Simple request logger to help debug which paths the client requests
app.use((req, _res, next) => {
  const now = new Date().toISOString();
  // log basic request immediately
  console.log(`[${now}] ${req.method} ${req.path}`);
  // also log response status and content-type when the response finishes
  const start = Date.now();
  const res = _res;
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode} ${res.get('Content-Type') || ''} (${ms}ms)`);
  });
  next();
});

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// CSRF Token endpoint - allows clients to fetch the token
app.get('/api/csrf-token', (req, res) => {
  // Explicitly set CORS headers for this endpoint
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

// Followers
app.get('/api/followers', async (_req, res) => {
  await db.read();
  res.json(db.data.followers);
});

app.patch('/api/followers/:id', doubleCsrfProtection, async (req, res) => {
  const { id } = req.params;
  const patch = req.body;
  await db.read();
  const item = db.data.followers.find(f => f.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  Object.assign(item, patch);
  await db.write();
  res.json(item);
});

// Overview
app.get('/api/overview', async (_req, res) => {
  await db.read();
  res.json(db.data.overview);
});

app.patch('/api/overview/:id', doubleCsrfProtection, async (req, res) => {
  const { id } = req.params;
  const patch = req.body;
  await db.read();
  const item = db.data.overview.find(o => o.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  Object.assign(item, patch);
  await db.write();
  res.json(item);
});

// Computed total followers
app.get('/api/total-followers', async (_req, res) => {
  await db.read();
  const total = db.data.followers.reduce((sum, f) => sum + (Number(f.count) || 0), 0);
  res.json({ total });
});

// Analytics historical data
app.get('/api/analytics', async (req, res) => {
  try {
    await db.read();
    
    // Get the time range from query params (default to 'week')
    const { range = 'week' } = req.query;
    
    // Validate range
    const validRanges = ['week', 'month', 'year', 'inception'];
    if (!validRanges.includes(range)) {
      return res.status(400).json({ 
        error: 'Invalid range parameter',
        validRanges 
      });
    }
    
    // Get the analytics data for the requested range
    const analyticsData = db.data.analytics?.[range];
    
    if (!analyticsData) {
      return res.status(404).json({ error: 'Analytics data not found for range: ' + range });
    }
    
    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Simple root handler to avoid browser "Cannot GET /" confusion during development
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'API running. Use /api/* endpoints.' });
});

const PORT = process.env.PORT || 5174;
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 CORS allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`📡 Available endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/csrf-token`);
    console.log(`   GET  /api/followers`);
    console.log(`   PATCH /api/followers/:id`);
    console.log(`   GET  /api/overview`);
    console.log(`   PATCH /api/overview/:id`);
    console.log(`   GET  /api/total-followers`);
    console.log(`   GET  /api/analytics?range=[week|month|year|inception]`);
    console.log('='.repeat(60));
  });
});