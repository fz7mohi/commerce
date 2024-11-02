// File: components/auth/user-menu.tsx
'use client';

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react';
import { Heart, LogOut, Settings, ShoppingBag, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { AuthModal } from './auth-modal';

export function UserMenu() {
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!session) {
    return (
      <>
        <Button
          variant="light"
          onPress={() => setShowAuthModal(true)}
          startContent={<User className="h-5 w-5" />}
        ></Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          src={session.user?.image || undefined}
          name={session.user?.name || 'User'}
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User actions">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">{session.user?.name}</p>
          <p className="text-default-500 text-sm">{session.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="orders" startContent={<ShoppingBag className="h-4 w-4" />}>
          Orders
        </DropdownItem>
        <DropdownItem key="wishlist" startContent={<Heart className="h-4 w-4" />}>
          Wishlist
        </DropdownItem>
        <DropdownItem key="settings" startContent={<Settings className="h-4 w-4" />}>
          Settings
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          startContent={<LogOut className="h-4 w-4" />}
          onPress={() => signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
