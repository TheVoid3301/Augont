// src/api/user.ts
import http, { Result } from '@/lib/http';

// 手动定义 User 类型（对应后端的 Prisma Model）
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export const userApi = {
  // 使用 Result<User> 包装，确保 data 属性有智能提示
  getUserInfo: (id: string) => 
    http.get<Result<User>>(`/user/${id}`).then(res => res.data),
    
  updateUser: (data: Partial<User>) => 
    http.post<Result<boolean>>('/user/update', data).then(res => res.data),
};