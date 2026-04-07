import "./globals.css";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      {/* 使用淡蓝色/紫色渐变背景，衬托毛玻璃效果 */}
      <body className="bg-linear-to-br from-blue-50 to-violet-50 min-h-screen flex flex-col items-center pt-32 pb-12 gap-8">
        
        {/* 1. 顶部导航 (已有的 Navbar) */}
        <Navbar />

        {/* 2. 主体框 (Main Container) 
            - max-w-7xl: 稍微宽一点，增加视觉稳重感
            - bg-white/40: 与 Navbar 一致的半透明度
            - rounded-[3rem]: 超大圆角呼应胶囊形状
        */}
        <main className="w-[94%] max-w-7xl flex-1 
                         bg-white/40 backdrop-blur-xl 
                         rounded-[3rem] border border-violet-100/50 
                         shadow-xl shadow-violet-200/20
                         p-10 transition-all duration-500">
          {children}
        </main>

        {/* 3. 底部菜单 (Footer) */}
        <Footer />

      </body>
    </html>
  );
}