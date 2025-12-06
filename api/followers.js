import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = '/tmp/db.json';

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
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
