import { Elysia } from 'elysia'
import { TotalRouter } from './internal/interface/router'

const app = new Elysia()
                .use(TotalRouter)
                .listen(3000);

console.log(
  `Augont is running at ${app.server?.hostname}:${app.server?.port}`
);