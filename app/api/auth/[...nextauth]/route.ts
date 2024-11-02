// File: app/api/auth/[...nextauth]/route.ts
import { authConfig } from '@/lib/auth/config';
import NextAuth from 'next-auth';

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
