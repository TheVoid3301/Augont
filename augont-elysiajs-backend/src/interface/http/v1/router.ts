import { Elysia } from 'elysia'
import { userRouter } from './controller/user'

export const v1Router = new Elysia({
                            prefix: '/v1'
                        })
                        .use(userRouter);