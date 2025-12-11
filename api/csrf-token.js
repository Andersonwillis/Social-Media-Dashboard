import { doubleCsrf } from 'csrf-csrf';

// Configure CSRF protection using csrf-csrf
const { generateToken } = doubleCsrf({
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

export default function handler(req, res) {
  // Enable CORS - allow credentials for cookie-based CSRF
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Generate CSRF token using csrf-csrf
  const csrfToken = generateToken(req, res);
  
  return res.status(200).json({ csrfToken });
}
