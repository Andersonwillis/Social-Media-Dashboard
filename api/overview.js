import { readFileSync, writeFileSync, existsSync } from 'fs';

const DB_PATH = '/tmp/db.json';

function getDB() {
  if (!existsSync(DB_PATH)) {
    const initialData = {
      followers: [],
      overview: [
        { id: "fb-likes", platform: "Facebook", metric: "Page Views", count: 87, change: 3, trend: "up" },
        { id: "fb-likes2", platform: "Facebook", metric: "Likes", count: 52, change: -2, trend: "down" },
        { id: "ig-likes", platform: "Instagram", metric: "Likes", count: 5462, change: 2257, trend: "up" },
        { id: "ig-profile", platform: "Instagram", metric: "Profile Views", count: 52000, change: 1375, trend: "up" },
        { id: "tw-retweets", platform: "Twitter", metric: "Retweets", count: 117, change: 303, trend: "up" },
        { id: "tw-likes", platform: "Twitter", metric: "Likes", count: 507, change: 553, trend: "up" },
        { id: "yt-likes", platform: "YouTube", metric: "Likes", count: 107, change: -19, trend: "down" },
        { id: "yt-views", platform: "YouTube", metric: "Total Views", count: 1407, change: -12, trend: "down" }
      ]
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getDB();

  // GET /api/overview
  if (req.method === 'GET') {
    return res.status(200).json(db.overview);
  }

  // PATCH /api/overview (assuming body has id)
  if (req.method === 'PATCH') {
    const { id, ...patch } = req.body;
    const item = db.overview.find(o => o.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }
    Object.assign(item, patch);
    saveDB(db);
    return res.status(200).json(item);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
