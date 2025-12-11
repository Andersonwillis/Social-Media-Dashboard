import { randomBytes } from 'crypto';
import cookie from 'cookie';

// In-memory token store (for demo purposes - in production use Redis or a database)
const tokenStore = new Map();
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of tokenStore.entries()) {
    if (now > expiry) {
      tokenStore.delete(token);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

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

  // Generate CSRF token
  const csrfToken = randomBytes(32).toString('hex');
  const expiry = Date.now() + TOKEN_EXPIRY;
  tokenStore.set(csrfToken, expiry);

  // Set CSRF token in a cookie
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: TOKEN_EXPIRY / 1000, // in seconds
    path: '/'
  };

  res.setHeader('Set-Cookie', cookie.serialize('_csrf', csrfToken, cookieOptions));
  
  return res.status(200).json({ csrfToken });
}

// Export token store for validation in other handlers
export function validateCsrfToken(token) {
  const expiry = tokenStore.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    tokenStore.delete(token);
    return false;
  }
  return true;
}
