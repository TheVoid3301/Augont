import { Elysia } from 'elysia';
import { auth } from '../../../../infrastructure/libs/auth';
import { fail } from '../../../../domain/shared/result';

type SessionPayload = Awaited<ReturnType<typeof auth.api.getSession>>;

const protectedPrefixes = ['/api/v1/file'];

export const authInterceptor = new Elysia({ name: 'auth-interceptor' })
  .decorate('authSession', null as SessionPayload | null)
  .onBeforeHandle(async (context) => {
    const requestPath = new URL(context.request.url).pathname;
    const needsAuth = protectedPrefixes.some((prefix) => requestPath.startsWith(prefix));

    if (!needsAuth) {
      return;
    }

    const session = await auth.api.getSession({
      headers: context.request.headers
    });

    if (!session) {
      context.set.status = 401;
      return fail(null, 'Unauthorized');
    }

    context.authSession = session;
  });
