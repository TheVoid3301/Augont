# Prisma + BetterAuth Integration Guide

## 1. 目标与当前实现

这份文档说明当前后端里 Prisma 与 BetterAuth 是如何在 DDD 分层下串起来的，以及如何从 HTTP 请求开始做端到端测试。

当前关键文件：

- `src/main.ts`
- `src/app.ts`
- `src/interface/router.ts`
- `src/interface/http/v1/router.ts`
- `src/interface/http/v1/controller/auth.ts`
- `src/infrastructure/libs/auth.ts`
- `src/infrastructure/persistance/db/prisma/client.ts`
- `src/infrastructure/persistance/db/prisma/schema.prisma`
- `prisma.config.ts`

## 2. DDD 分层职责

### Interface 层

- 接收 HTTP 请求
- 将 `/api/v1/auth/*` 交给 BetterAuth 的 handler
- 提供额外接口 `GET /api/v1/auth/session`（用于项目统一返回格式）

对应文件：

- `src/interface/http/v1/controller/auth.ts`

### Infrastructure 层

- 维护 Prisma Client（数据库访问入口）
- 初始化 BetterAuth（认证能力）
- 通过 `prismaAdapter` 把 BetterAuth 的数据操作接到 Prisma

对应文件：

- `src/infrastructure/persistance/db/prisma/client.ts`
- `src/infrastructure/libs/auth.ts`

### Application/Domain 层

- 当前认证主流程主要由 BetterAuth 承担
- 业务能力后续可通过 Application Service 再包一层（例如 `CurrentUserService`）

## 3. 从 HTTP 到数据库的完整链路

下面以 `POST /api/v1/auth/sign-in/email` 为例。

1. 请求进入 Elysia 启动实例  
   `src/main.ts` -> `createApp()` (`src/app.ts`)

2. 进入总路由  
   `src/interface/router.ts` 把前缀固定为 `/api`

3. 进入 v1 路由  
   `src/interface/http/v1/router.ts` 前缀 `/v1`

4. 命中 Auth Controller  
   `src/interface/http/v1/controller/auth.ts` 的 `.all('/auth/*', ...)`

5. 转交 BetterAuth  
   `auth.handler(request)` 执行认证 endpoint 逻辑

6. BetterAuth 使用 Prisma Adapter  
   `src/infrastructure/libs/auth.ts` 中：
   - `database: prismaAdapter(prisma, { provider: 'postgresql', transaction: true })`

7. Prisma Adapter 调用 Prisma Client  
   `src/infrastructure/persistance/db/prisma/client.ts` 中的 `prisma`

8. Prisma Client 访问数据库  
   根据 `schema.prisma` 模型操作 `User / Session / Account / Verification` 表

## 4. 配置与数据模型

### 4.1 环境变量

`.env` 里至少需要：

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

对应校验文件：`src/infrastructure/config/env.ts`

### 4.2 Prisma 配置入口

Prisma 不使用根目录 `prisma/`，统一走：

- `prisma.config.ts`

其中：

- `schema` -> `./src/infrastructure/persistance/db/prisma/schema.prisma`
- `migrations` -> `./src/infrastructure/persistance/db/prisma/migrations`

### 4.3 BetterAuth 基础配置

`src/infrastructure/libs/auth.ts`：

- `basePath: '/api/v1/auth'`
- `emailAndPassword.enabled: true`

因此内建 endpoint 的最终访问路径是：

- `POST /api/v1/auth/sign-up/email`
- `POST /api/v1/auth/sign-in/email`
- `POST /api/v1/auth/sign-out`
- `GET /api/v1/auth/get-session`

此外，我们额外提供：

- `GET /api/v1/auth/session`（内部调用 `auth.api.getSession`）

## 5. 如何测试

### 5.1 准备阶段

在 `augont-elysiajs-backend` 目录执行：

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```

如果你用 Bun，也可以：

```bash
bun run prisma:generate
bun run prisma:migrate:dev
bun run dev
```

服务启动后，默认地址：`http://localhost:3000`

### 5.2 核心用例（推荐顺序）

### 用例 A：注册

```bash
curl -i -X POST "http://localhost:3000/api/v1/auth/sign-up/email" -H "Content-Type: application/json" -d "{\"name\":\"demo\",\"email\":\"demo@example.com\",\"password\":\"Passw0rd!\"}"
```

预期：

- 返回 200/201（具体状态码由 BetterAuth 实现决定）
- 数据库新增 `User`
- 可能写入 `Session` 与 `Set-Cookie`

### 用例 B：登录

```bash
curl -i -X POST "http://localhost:3000/api/v1/auth/sign-in/email" -H "Content-Type: application/json" -d "{\"email\":\"demo@example.com\",\"password\":\"Passw0rd!\"}"
```

预期：

- 返回成功状态
- 响应头包含 `Set-Cookie`

### 用例 C：查询当前会话（内建）

把上一步响应里的 cookie 带上：

```bash
curl -i "http://localhost:3000/api/v1/auth/get-session" -H "Cookie: <粘贴你的cookie>"
```

预期：

- 返回当前 session + user

### 用例 D：查询当前会话（项目包装接口）

```bash
curl -i "http://localhost:3000/api/v1/auth/session" -H "Cookie: <粘贴你的cookie>"
```

预期：

- 返回统一结构：`{ "data": ... }`

### 用例 E：登出

```bash
curl -i -X POST "http://localhost:3000/api/v1/auth/sign-out" -H "Cookie: <粘贴你的cookie>"
```

预期：

- 会话失效
- 再请求 `get-session` / `session` 应为空或未登录

### 5.3 数据库验证点

登录/注册后重点看：

- `User`：用户主数据
- `Session`：会话 token、过期时间、userId
- `Account`：邮箱密码登录时会有 provider/account 关联记录
- `Verification`：部分验证码/验证流程使用

## 6. 常见问题排查

### 问题 1：`@prisma/client` 没有导出 `PrismaClient`

已通过“本地生成客户端”规避：

- `schema.prisma` 使用 `output = "./generated"`
- 代码从 `./generated` 导入 `PrismaClient`

如果编辑器仍报错，重启 TypeScript Server。

### 问题 2：缺表或迁移错误

确认执行：

```bash
npm run prisma:migrate:dev
```

并确保 `DATABASE_URL` 正确可连接。

### 问题 3：会话总是拿不到

优先检查：

- 登录响应是否有 `Set-Cookie`
- 后续请求是否带了同一 cookie
- 前后端域名/端口是否一致（本地建议同域同端口先跑通）

## 7. 推荐回归清单

每次调整 Auth 或 Prisma 后，至少回归以下四步：

1. `prisma:generate` 成功
2. `prisma:migrate:dev` 成功
3. `sign-in/email` 成功并有 cookie
4. `get-session` 与项目接口 `/auth/session` 均能读出 session
