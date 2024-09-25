import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../../libs/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile: (profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
      }),
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
      }),
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('No user found');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),
  ],
  secret: process.env.SECRET!,
  session: {
    strategy: 'jwt',
    maxAge: 60, // Session expires in 1 minute (60 seconds)
  },
  pages: {
    signIn: '/login',     // Custom login page
    newUser: '/register', // Custom registration page
    error: '/auth/error', // Error page
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user.email) {
          throw new Error('Email is required for sign-in');
        }

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: user.name || '',
                email: user.email,
                hashedPassword: '', // No password for OAuth users
                role: 'USER', // Default role for new users
              },
            });
          }
        } catch (error) {
          console.error('Error during OAuth user creation:', error);
          throw new Error('An error occurred while processing sign-in');
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
          });
         console.log(session.user)
         
          if (user) {
            (session.user as any).role = user.role; // Add role to the session
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/dashboard'; // Default to dashboard for all successful logins
    },
  },
  debug: true, // Enable debug logging
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
