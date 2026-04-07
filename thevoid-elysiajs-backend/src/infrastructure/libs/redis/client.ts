import Redis from 'ioredis';
import { env } from '../../config/env';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!env.REDIS_URL) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(env.REDIS_URL, {
    enableReadyCheck: true,
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000);
      return delay;
    }
  });

  redisClient.on('error', (error) => {
    console.error('[redis] connection error:', error);
  });

  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (!redisClient) {
    return;
  }

  await redisClient.quit();
  redisClient = null;
};
