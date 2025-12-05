import express from 'express';
import cors from 'cors';
import { db, initDB } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

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

// Followers
app.get('/api/followers', async (_req, res) => {
  await db.read();
  res.json(db.data.followers);
});

app.patch('/api/followers/:id', async (req, res) => {
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

app.patch('/api/overview/:id', async (req, res) => {
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

// Simple root handler to avoid browser "Cannot GET /" confusion during development
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'API running. Use /api/* endpoints.' });
});

const PORT = process.env.PORT || 5174;
initDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});