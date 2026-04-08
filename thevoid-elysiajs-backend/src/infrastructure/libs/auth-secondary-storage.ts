import type { SecondaryStorage } from '@better-auth/core/db';
import { env } from '../config/env';
import { getRedisPool, withRedis } from '../persistance/db/redis/client';

export const createSecondaryStorage = (): SecondaryStorage | undefined => {
  const client = getRedisPool();

  if (!client) {
    return undefined;
  }

  return {
    async get(key: string) {
      return withRedis(client =>
        client.get(`${env.REDIS_KEY_PREFIX}:${key}`)
      );
    },

    async set(key: string, value: string, ttl?: number) {
      return withRedis(client => {
        const namespacedKey = `${env.REDIS_KEY_PREFIX}:${key}`;
        if (typeof ttl === 'number' && ttl > 0) {
          return client.set(namespacedKey, value, 'EX', ttl);
        }
        return client.set(namespacedKey, value);
      });
    },

    async delete(key: string) {
      await withRedis(client =>
        client.del(`${env.REDIS_KEY_PREFIX}:${key}`)
      );
    }
  };
};
