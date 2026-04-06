import { Elysia } from 'elysia'
import { v1Router } from './http/v1/router'

export const TotalRouter = new Elysia({
                            prefix: '/api'
                        })
                        .use(v1Router);