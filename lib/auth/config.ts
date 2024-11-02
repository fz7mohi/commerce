// File: lib/auth/config.ts
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import ShopifyProvider from './shopify-provider';

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            image: true,
            role: true,
            shopifyCustomerId: true
          }
        });

        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          shopifyCustomerId: user.shopifyCustomerId
        };
      }
    }),
    ShopifyProvider({
      clientId: process.env.SHOPIFY_CLIENT_ID!,
      clientSecret: process.env.SHOPIFY_CLIENT_SECRET!,
      storeDomain: process.env.SHOPIFY_STORE_DOMAIN!
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.shopifyCustomerId = user.shopifyCustomerId;
      }

      // If it's a Shopify sign-in, update the token with Shopify data
      if (account?.provider === 'shopify') {
        token.shopifyCustomerId = account.providerAccountId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.shopifyCustomerId = token.shopifyCustomerId as string | undefined;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'shopify') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (existingUser) {
            // Update existing user with Shopify data
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                shopifyCustomerId: account.providerAccountId,
                name: user.name || existingUser.name,
                image: user.image || existingUser.image
              }
            });
          } else {
            // Create new user from Shopify data
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                shopifyCustomerId: account.providerAccountId,
                role: 'USER'
              }
            });
          }
        }
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};
