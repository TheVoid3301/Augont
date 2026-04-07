import type { SecondaryStorage } from '@better-auth/core/db';
import { env } from '../config/env';
import { getRedisClient } from '../persistance/db/redis/client';

export const createSecondaryStorage = (): SecondaryStorage | undefined => {
  const redis = getRedisClient();

  if (!redis) {
    return undefined;
  }

  return {
    async get(key: string) {
      await redis.connect().catch(() => undefined);
      return redis.get(`${env.REDIS_KEY_PREFIX}:${key}`);
    },
    async set(key: string, value: string, ttl?: number) {
      await redis.connect().catch(() => undefined);
      const namespacedKey = `${env.REDIS_KEY_PREFIX}:${key}`;
      if (typeof ttl === 'number' && ttl > 0) {
        await redis.set(namespacedKey, value, 'EX', ttl);
        return;
      }
      await redis.set(namespacedKey, value);
    },
    async delete(key: string) {
      await redis.connect().catch(() => undefined);
      return redis.del(`${env.REDIS_KEY_PREFIX}:${key}`);
    }
  };
};
