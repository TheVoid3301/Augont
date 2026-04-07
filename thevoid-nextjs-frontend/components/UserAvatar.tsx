'use client'

import * as HoverCard from '@radix-ui/react-hover-card'
import { useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useUserStore } from '@/store/useUserStore' // 引入仓库
import { Result } from '@/types/result'
import { User } from '@/types/user'

export default function UserAvatar() {
  // 从全局仓库中提取需要的数据和方法
  const { user, loading, setUser, setLoading } = useUserStore();

  useEffect(() => {
    if (user) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Result<User>>('/api/user/info');
        if (res.data.success) {
          setUser(res.data.data); // 更新全局记忆
        }
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, [user, setUser, setLoading]);

  return (
    <HoverCard.Root openDelay={100} closeDelay={200}>
      <HoverCard.Trigger asChild>
        {/* 头像触发器：全透明毛玻璃边框 */}
        <div className="w-10 h-10 rounded-full cursor-pointer overflow-hidden 
                        border-2 border-white/30 hover:border-white/60 
                        bg-white/10 backdrop-blur-md transition-all duration-300">
          <img 
            src={user?.image || "/favicon.ico"} 
            alt="avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content 
          sideOffset={15}
          className="z-[100] w-72 p-0 rounded-3xl overflow-hidden
                     /* 全透明粉色毛玻璃核心：极低透明度 + 高模糊 */
                     bg-pink-200/10 backdrop-blur-2xl 
                     border border-white/20 shadow-2xl
                     animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300"
        >
          {/* 背景装饰：淡淡的粉色光晕 */}
          <div className="h-20 bg-linear-to-b from-pink-400/20 to-transparent" />
          
          <div className="px-6 pb-6 pt-0 -mt-10 flex flex-col items-center">
            {/* 大头像 */}
            <div className="w-20 h-20 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-white/10 backdrop-blur-lg">
               <img src={user?.image || "/favicon.ico"} alt="avatar" className="w-full h-full" />
            </div>

            <div className="mt-4 text-center w-full space-y-1">
              <div className="font-black text-xl text-black tracking-tight">
                {user ? user.name : "未登录用户"}
              </div>
              <div className="text-xs text-pink-200/80 font-medium uppercase tracking-widest pb-4">
                {user ? user.role : "GUEST ACCOUNT"}
              </div>
              
              {/* 下侧菜单：统一为胶囊状 */}
              <div className="flex flex-col gap-2 w-full">
                {user ? (
                  <>
                    <Link href="/settings" className="w-full py-2.5 text-sm font-bold text-white bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-all">
                      个人设置
                    </Link>
                    <button className="w-full py-2.5 text-sm font-bold text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-full border border-red-400/20 transition-all">
                      退出登录
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="w-full py-3 text-sm font-black text-white bg-pink-500/40 hover:bg-pink-500/60 rounded-full border border-pink-400/30 shadow-lg transition-all animate-pulse">
                    点击登录
                  </Link>
                )}
              </div>
            </div>
          </div>
          <HoverCard.Arrow className="fill-white/10 backdrop-blur-2xl" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}