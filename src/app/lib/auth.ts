import { betterAuth } from 'better-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: PrismaAdapter(prisma),
  email: {
    provider: 'resend',
    from: 'onboarding@resend.dev',
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },
  callbacks: {
    session: {
      callback: ({ session, user }) => {
        if (session && user) {
          session.user.id = user.id;
          session.user.email = user.email;
          session.user.name = user.name || undefined;
          session.user.image = user.image || undefined;
        }
        return session;
      },
    },
  },
  trustedOrigins: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'https://tournaments.example.com']
    : ['http://localhost:3000'],
});

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.signIn.email({
      email,
      password,
      rememberMe: true,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.signUp.user({
      email,
      password,
      name,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  await auth.signOut();
};

export const getSession = async () => {
  const session = await auth.getSession();
  return session;
};
