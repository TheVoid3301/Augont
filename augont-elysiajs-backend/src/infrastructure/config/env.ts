const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[env] Missing required environment variable: ${name}`);
  }
  return value;
};

const withDefault = (name: string, fallback: string): string => {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }
  return value;
};

const optional = (name: string): string | undefined => {
  const value = process.env[name];
  if (!value) {
    return undefined;
  }
  return value;
};

const numberWithDefault = (name: string, fallback: number): number => {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`[env] Invalid number for environment variable: ${name}`);
  }

  return parsed;
};

export const env = {
  DATABASE_URL: required('DATABASE_URL'),
  BETTER_AUTH_SECRET: required('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: withDefault('BETTER_AUTH_URL', 'http://localhost:3000'),
  AUTH_SESSION_EXPIRES_IN: numberWithDefault('AUTH_SESSION_EXPIRES_IN', 60 * 60 * 24 * 10),
  AUTH_SESSION_UPDATE_AGE: numberWithDefault('AUTH_SESSION_UPDATE_AGE', 60 * 60 * 24),
  UPLOAD_ROOT: withDefault('UPLOAD_ROOT', './storage/uploads'),
  UPLOAD_MAX_SIZE_MB: numberWithDefault('UPLOAD_MAX_SIZE_MB', 20),
  REDIS_URL: optional('REDIS_URL'),
  REDIS_KEY_PREFIX: withDefault('REDIS_KEY_PREFIX', 'augont')
} as const;
