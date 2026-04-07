import { Elysia } from 'elysia';
import { authRouter } from './controller/auth';
import { fileRouter } from './controller/file';
import { userRouter } from './controller/user';

export const v1Router = new Elysia({
                            prefix: '/v1'
                        })
                        .use(authRouter)
                        .use(fileRouter)
                        .use(userRouter);
