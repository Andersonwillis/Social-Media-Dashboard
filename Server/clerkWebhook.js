import express from 'express';
import { Webhook } from 'svix';

const app = express();

// Clerk webhook endpoint
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  // Get webhook secret from Clerk Dashboard → Webhooks
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  // Get Svix headers for verification
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(req.body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the webhook
  const { type, data } = evt;

  if (type === 'user.created') {
    // Get total user count
    const users = await clerkClient.users.getUserList();
    
    // Assign role based on whether they're the first user
    const role = users.length === 1 ? 'admin' : 'viewer';
    
    await clerkClient.users.updateUserMetadata(data.id, {
      publicMetadata: { role }
    });
  }

  res.json({ success: true });
});

export default app;

/* 
SETUP INSTRUCTIONS:

1. In Clerk Dashboard, go to Webhooks
2. Click "Add Endpoint"
3. Enter your endpoint URL: https://your-domain.com/api/webhooks/clerk
4. Subscribe to event: user.created
5. Copy the Signing Secret
6. Add to .env: CLERK_WEBHOOK_SECRET=whsec_your_secret_here
7. Deploy and test

This will automatically:
- Make the first user an admin
- Make all subsequent users viewers
- Admins can then promote other users as needed
*/
