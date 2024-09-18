import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import MicrosoftProvider from 'next-auth/providers/microsoft';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // For password hashing

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Validate user credentials
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValidPassword) {
          throw new Error('Incorrect password');
        }

        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    error: '/error', // Custom error page
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user = user;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
