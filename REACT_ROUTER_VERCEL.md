# React Router with Vercel Deployment

## Overview

This application uses **React Router v6** for client-side routing and is fully compatible with Vercel deployment.

## Current Routes

### Public Routes
- **`/sign-in`** - Sign in page (Clerk authentication)
- **`/sign-up`** - Sign up page (Clerk authentication)

### Protected Routes
- **`/`** - Dashboard (requires authentication)
  - Automatically redirects to `/sign-in` if not authenticated
  - Shows follower cards and overview stats
  - Allows stat editing when signed in

## Vercel Configuration

### vercel.json Setup

The `vercel.json` file includes a critical rewrite rule for client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

**What this does:**
- Rewrites all non-API routes to `index.html`
- Allows React Router to handle routing on the client side
- Preserves API routes (anything starting with `/api/`)
- Prevents 404 errors when users refresh or directly access routes like `/sign-in`

### How It Works

1. **Initial Load**: User visits any URL (e.g., `https://your-app.vercel.app/sign-in`)
2. **Vercel Routing**: Vercel sees it's not an API route, serves `index.html`
3. **React Router**: The React app loads and React Router handles the `/sign-in` route
4. **Client-Side Navigation**: All subsequent navigation is handled by React Router without page reloads

## Adding New Routes

To add new routes to your application:

### 1. Create the Page Component

```jsx
// Client/src/pages/NewPage.jsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

### 2. Add the Route in main.jsx

```jsx
import NewPage from "./pages/NewPage.jsx";

// In RootLayout component:
<Routes>
  <Route path="/new-page" element={<NewPage />} />
  {/* ... other routes */}
</Routes>
```

### 3. Navigate to the Route

```jsx
import { Link, useNavigate } from 'react-router-dom';

// Using Link component
<Link to="/new-page">Go to New Page</Link>

// Using useNavigate hook
const navigate = useNavigate();
navigate('/new-page');
```

## Protected Routes

To create protected routes that require authentication:

```jsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function ProtectedPage() {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" />;
  
  return <div>Protected Content</div>;
}
```

## Environment Variables for Vercel

Make sure to set these environment variables in your Vercel project settings:

- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `VITE_API_BASE` - API base URL (e.g., `/api` for same domain)
- `ALLOWED_ORIGIN` - Frontend URL for CORS (e.g., `https://your-app.vercel.app`)
- `CSRF_SECRET` - Secret key for CSRF protection
- `NODE_ENV` - Set to `production`

## Testing Locally

```bash
# Development server with hot reload
npm run dev

# Build and preview (simulates production)
npm run build
npm run preview
```

## Deployment Checklist

- ✅ React Router installed (`react-router-dom`)
- ✅ Routes defined in `main.jsx`
- ✅ `vercel.json` configured with rewrite rule
- ✅ Environment variables set in Vercel dashboard
- ✅ Build command: `npm install && npm run build --workspace=Client`
- ✅ Output directory: `Client/dist`

## Common Issues & Solutions

### Issue: 404 on page refresh
**Solution**: Ensure the rewrite rule in `vercel.json` is present

### Issue: API routes not working
**Solution**: The rewrite rule uses `(?!api)` to exclude API routes from being rewritten

### Issue: Clerk authentication not working
**Solution**: Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set in Vercel environment variables

## Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [Vercel SPA Configuration](https://vercel.com/docs/frameworks/vite#single-page-applications)
- [Clerk with React Router](https://clerk.com/docs/references/react/custom-flows)
