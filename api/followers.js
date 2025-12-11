import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { doubleCsrf } from 'csrf-csrf';

const DB_PATH = '/tmp/db.json';

// Configure CSRF protection
const { validateRequest } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'your-secret-key-change-in-production',
  cookieName: '_csrf',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

function getDB() {
  if (!existsSync(DB_PATH)) {
    const initialData = {
      followers: [
        { id: "fb", platform: "Facebook", username: "@nathanf", count: 1987, today: 12, trend: "up" },
        { id: "tw", platform: "Twitter", username: "@nathanf", count: 1044, today: 99, trend: "up" },
        { id: "ig", platform: "Instagram", username: "@realnathanf", count: 11734, today: 1099, trend: "up" },
        { id: "yt", platform: "YouTube", username: "Nathan F.", count: 8239, today: -144, trend: "down" }
      ],
      overview: []
    };
    writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
  return JSON.parse(readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  // Enable CORS
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getDB();

  // GET /api/followers
  if (req.method === 'GET') {
    return res.status(200).json(db.followers);
  }

  // PATCH /api/followers (assuming body has id)
  if (req.method === 'PATCH') {
    // Validate CSRF token for state-changing operations
    try {
      validateRequest(req);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    const { id, ...patch } = req.body;
    const item = db.followers.find(f => f.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }
    Object.assign(item, patch);
    saveDB(db);
    return res.status(200).json(item);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
