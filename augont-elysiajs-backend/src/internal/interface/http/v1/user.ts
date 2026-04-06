import { Elysia, t } from 'elysia'

export const userRouter = new Elysia({ prefix: '/product' })
  .get('/list', () => {
    return { data: ['商品A', '商品B'], total: 2 }
  })
  .post('/create', ({ body }) => {
    // 这里可以调用 app/ 层的业务逻辑
    return { message: '创建成功', id: 1 }
  }, {
    // 大厂必备：数据校验（Schema Validation）
    body: t.Object({
      name: t.String(),
      price: t.Number()
    })
  })