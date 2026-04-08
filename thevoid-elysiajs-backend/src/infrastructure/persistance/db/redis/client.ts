import Redis from 'ioredis';
import { createPool, Pool } from 'generic-pool';
import { env } from '../../../config/env';

let redisPool: Pool<Redis> | null = null;

export const getRedisPool = (): Pool<Redis> | null => {
  if (!env.REDIS_URL) {
    return null;
  }

  if (redisPool) {
    return redisPool;
  }

  redisPool = createPool({
    create: async () => {
      const client = new Redis(env.REDIS_URL, {
        enableReadyCheck: true,
        lazyConnect: true,
        maxRetriesPerRequest: 2,
        retryStrategy: (times) => Math.min(times * 100, 3000),
      });

      client.on('error', (error) => {
        console.error('[redis] connection error:', error);
      });

      await client.connect();
      return client;
    },
    destroy: async (client) => {
      await client.quit();
    },
    validate: async (client) => {
      try {
        await client.ping();
        return true;
      } catch {
        return false;
      }
    },
  }, {
    min: env.REDIS_MIN_CONNECTION,
    max: env.REDIS_MAX_CONNECTION,
    idleTimeoutMillis: env.REDIS_IDLE_TIMEOUT_MILLIS,
    acquireTimeoutMillis: env.REDIS_ACQUIRE_TIMEOUT_MILLIS,
    testOnBorrow: true,
  });

  return redisPool;
}

export const withRedis = async <T>(fn: (client: Redis) => Promise<T>): Promise<T | null> => {
  const pool = getRedisPool();
  if (!pool) return null;

  const client = await pool.acquire();
  try {
    return await fn(client);
  } finally {
    pool.release(client);
  }
};

export const closeRedis = async (): Promise<void> => {
  if (!redisPool) return;
  await redisPool.drain();
  await redisPool.clear();
  redisPool = null;
}