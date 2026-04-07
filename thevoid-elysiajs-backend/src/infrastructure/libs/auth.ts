import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { env } from '../config/env';
import { createSecondaryStorage } from './auth-secondary-storage';
import { prisma } from '../persistance/db/prisma/client';

const secondaryStorage = createSecondaryStorage();

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/v1/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    transaction: true
  }),
  secondaryStorage,
  session: {
    expiresIn: env.AUTH_SESSION_EXPIRES_IN,
    updateAge: env.AUTH_SESSION_UPDATE_AGE,
    storeSessionInDatabase: true
  },
  rateLimit: {
    storage: secondaryStorage ? 'secondary-storage' : 'memory'
  },
  emailAndPassword: {
    enabled: true
  }
});
