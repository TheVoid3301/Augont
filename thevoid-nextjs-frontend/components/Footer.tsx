export default function Footer() {
  return (
    <footer className="w-[94%] max-w-7xl 
                       bg-violet-50/40 backdrop-blur-xl 
                       rounded-[2.5rem] border border-violet-100/50 
                       p-8 shadow-lg shadow-violet-200/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* 左侧：Logo 缩减版 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center border border-violet-100">
            <img src="/favicon.ico" className="w-5 h-5 opacity-80" alt="logo" />
          </div>
          <span className="font-black text-lg text-violet-700 tracking-tighter">TheVoid3301</span>
        </div>

        {/* 中间：链接组 */}
        <div className="flex items-center gap-8 text-sm font-bold text-violet-500/80">
          <a href="/about" className="hover:text-violet-800 transition-colors">关于我们</a>
          <a href="/privacy" className="hover:text-violet-800 transition-colors">隐私政策</a>
          <a href="https://beian.miit.gov.cn/" target="_blank" className="hover:text-violet-800 transition-colors">
            某ICP备12345678号
          </a>
        </div>

        {/* 右侧：状态指示 */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/50 rounded-full border border-violet-100 text-xs text-violet-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          System Normal
        </div>
        
      </div>
    </footer>
  );
}