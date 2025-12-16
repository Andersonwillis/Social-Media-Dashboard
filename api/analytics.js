import { join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Initialize the database
const file = join(process.cwd(), 'Server', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      return res.status(404).json({ error: 'Analytics data not found' });
    }
    
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}
