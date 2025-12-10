# CSRF Protection Configuration for Railway Deployment

## Overview
CSRF (Cross-Site Request Forgery) protection has been implemented on all PATCH routes using `csurf` middleware with cookie-based tokens.

## Changes Made

### Server (`/Server/index.js`)
1. **Added Dependencies:**
   - `cookie-parser` - Required by csurf for cookie handling

2. **CSRF Configuration:**
   - Cookie settings optimized for cross-site deployment on Railway:
     - `httpOnly: true` - Prevents JavaScript access to the cookie
     - `secure: true` (in production) - Ensures cookies only sent over HTTPS
     - `sameSite: 'none'` (in production) - Allows cross-site cookie transmission
     - `sameSite: 'lax'` (in development) - For local testing

3. **Protected Routes:**
   - `PATCH /api/followers/:id` - Now requires CSRF token
   - `PATCH /api/overview/:id` - Now requires CSRF token

4. **New Endpoint:**
   - `GET /api/csrf-token` - Returns CSRF token to clients

### Client (`/Client/src/api.js`)
1. **Added CSRF Token Management:**
   - `getCsrfToken()` - Fetches and caches CSRF token from server
   - Token is included in all PATCH requests via `CSRF-Token` header
   - `credentials: 'include'` ensures cookies are sent with requests
   - Token cache is cleared on 403 errors for automatic retry

## Railway Deployment Checklist

### Environment Variables
Set these on Railway:
```
NODE_ENV=production
ALLOWED_ORIGIN=https://your-frontend-domain.com
```

### Important Notes
1. **HTTPS Required:** The `secure: true` cookie setting requires HTTPS in production. Railway provides this by default.

2. **CORS Configuration:** The `ALLOWED_ORIGIN` must match your frontend domain exactly for the credentials to work.

3. **Cookie Domain:** Cookies will automatically work across subdomains (e.g., `api.yourdomain.com` and `app.yourdomain.com`) when deployed on Railway.

4. **Testing in Production:** 
   - Ensure your frontend can reach the `/api/csrf-token` endpoint
   - Verify PATCH requests include the `CSRF-Token` header
   - Check browser DevTools → Network → Cookies to see the CSRF cookie

### Local Development
The configuration automatically uses `sameSite: 'lax'` in development, which works for same-origin requests (e.g., proxied through Vite).

## Security Benefits
- Prevents unauthorized state-changing operations
- Works seamlessly with cross-origin deployments
- Automatic token rotation on error
- HTTP-only cookies prevent XSS attacks
- Secure cookies in production prevent MITM attacks

## Troubleshooting

### "ForbiddenError: invalid csrf token"
- Client failed to include the token or cookie
- Check that `credentials: 'include'` is set on fetch requests
- Verify CORS `credentials: true` is enabled on server

### Token not being set
- Ensure the `/api/csrf-token` endpoint is called first
- Check browser console for CORS errors
- Verify `NODE_ENV` and cookie settings match deployment environment
