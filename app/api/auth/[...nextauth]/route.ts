import NextAuth from 'next-auth/next';
import prisma from '../../../libs/prisma'; // Adjust the path if necessary
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { User as PrismaUser } from '@prisma/client'; // Ensure you import the correct User type

// Define User type
interface User {
  id: number;
  name: string;
  email: string;
  role: string; // Adjust based on your user model
  createdAt: Date;
  updatedAt: Date;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
        req: { body?: any; query?: any; headers?: any; method?: any }
      ): Promise<User | null> {
        // Check for email and password
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Verify user existence and password
        if (!user || !user.hashedPassword) {
          throw new Error('No user found');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        // Return user details if authorization is successful
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Ensure this is included in your User model
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } as User; // Cast to User type
      },
    }),
  ],
  secret: process.env.SECRET!,
  session: {
    strategy: 'jwt' as const,
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
