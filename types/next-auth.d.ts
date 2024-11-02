// types/next-auth.d.ts
import type { DefaultSession } from 'next-auth';

export type UserRole = 'ADMIN' | 'USER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      shopifyCustomerId?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
    shopifyCustomerId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    shopifyCustomerId?: string;
  }
}
