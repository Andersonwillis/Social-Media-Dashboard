import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#0f172a'
    }}>
      <SignUp 
        appearance={{
          elements: {
            rootBox: {
              margin: '0 auto'
            }
          }
        }}
      />
    </div>
  );
}
