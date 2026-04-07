import { createApp } from './app';

const app = createApp().listen(3000);

console.log(
  `Augont is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;