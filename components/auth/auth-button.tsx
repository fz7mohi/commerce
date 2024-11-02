// File: components/auth/auth-button.tsx
'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { AuthModal } from './auth-modal';

export function AuthButton() {
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (session) {
    return (
      <Button variant="ghost" onClick={() => signOut()}>
        Sign Out
      </Button>
    );
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
        Sign In
      </Button>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
