import { Elysia } from 'elysia'
import { userRouter } from './user'

export const v1Router = new Elysia({
                            prefix: '/v1'
                        })
                        .use(userRouter);