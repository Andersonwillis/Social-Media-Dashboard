// Auto-assign admin role to first user (optional enhancement)
// Add this to your server or use a Clerk webhook

import { clerkClient } from '@clerk/clerk-sdk-node';

export async function handleNewUser(userId) {
  // Check if this is the first user
  const users = await clerkClient.users.getUserList();
  
  if (users.length === 1) {
    // First user - make them admin
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'admin'
      }
    });
    console.log('First user assigned admin role');
  } else {
    // Default role for subsequent users
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'viewer'
      }
    });
    console.log('New user assigned viewer role');
  }
}

// Use this in a Clerk webhook for 'user.created' event
