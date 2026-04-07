import { create } from 'zustand'
import { User } from '@/types/user'

// 定义仓库的数据结构和操作方法
interface UserState {
  user: User | null;
  isLogin: boolean;
  loading: boolean;
  // Actions: 修改数据的方法
  setUser: (userData: User | null) => void;
  setLoading: (status: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // 1. 初始状态
  user: null,
  isLogin: false,
  loading: true,

  // 2. 实现 Actions
  setUser: (userData) => set({ 
    user: userData, 
    isLogin: !!userData, 
    loading: false 
  }),
  
  setLoading: (status) => set({ loading: status }),

  logout: () => set({ user: null, isLogin: false }),
}))