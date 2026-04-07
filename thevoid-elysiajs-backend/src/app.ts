import { Elysia } from 'elysia';
import { prisma } from './infrastructure/persistance/db/prisma/client';
import { cors } from '@elysiajs/cors'
import { TotalRouter } from './interface/router';
import { authInterceptor } from './interface/http/v1/middleware/auth-interceptor';
import { closeRedis } from './infrastructure/persistance/db/redis/client';

export const createApp = () =>
  new Elysia()
    .use(cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))
    .use(authInterceptor)
    .use(TotalRouter)
    .onStop(async () => {
      await prisma.$disconnect();
      await closeRedis();
    });
