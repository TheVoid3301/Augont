'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import UserAvatar from './UserAvatar'

export default function Navbar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      {/* 统一的容器：无论在哪个页面，胶囊背景始终一致 */}
        <div className="group flex items-center justify-between h-16 px-10 
                        /* 改为 10% 到 20% 的透明度，背景色深一点以衬托白色文字 */
                        bg-linear-to-r from-blue-500/10 to-violet-500/10 
                        backdrop-blur-2xl border border-white/20 
                        rounded-full shadow-2xl shadow-blue-950/20">
        
        {/* 左侧 Logo */}
        <div className="flex items-center gap-2 font-black text-xl text-violet-700">
          <span>TheVoid3301</span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 
                        bg-blue-50/50 dark:bg-blue-950/20 rounded-full border border-blue-100/50 shadow-inner">
          
          <Link 
            href="/" 
            className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-300
              ${isActive('/') 
                ? 'bg-violet-600 text-white shadow-md' 
                : 'text-violet-500 hover:text-violet-800 hover:bg-violet-200/30'}`}
          >
            首页
          </Link>

          {/* 工作台：只有它被激活时才变紫色实心 */}
          <Link 
            href="/augont" 
            className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-300
              ${isActive('/augont') 
                ? 'bg-violet-600 text-white shadow-md' 
                : 'text-violet-500 hover:text-violet-800 hover:bg-violet-200/30'}`}
          >
            Augont
          </Link>
        </div>

        {/* 右侧头像 */}
        <div className="flex items-center">
           <UserAvatar />
        </div>
      </div>
    </nav>
  )
}