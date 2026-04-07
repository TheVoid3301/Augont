import { Elysia } from 'elysia';
import { auth } from '../../../../infrastructure/libs/auth';

export const authRouter = new Elysia()
  .get('/auth/session', async ({ request }) => {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    return {
      data: session ?? null
    };
  })
  .all('/auth/*', ({ request }) => auth.handler(request));
