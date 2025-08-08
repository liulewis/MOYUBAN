import WorkShirkingReminder from '@/components/WorkShirkingReminder';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Home() {
  useEffect(() => {
    // 页面加载时的欢迎提示
    toast.info('欢迎使用摸鱼办提醒工具，每日更新，轻松摸鱼！');
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-[clamp(1.8rem,5vw,2.5rem)] font-bold text-gray-800 mb-2">
            摸鱼办提醒工具
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            每日自动更新，轻松复制，让你的摸鱼生活更有规划
          </p>
        </div>
        
        {/* 主内容区 */}
        <WorkShirkingReminder />
        
        {/* 页脚信息 */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>摸鱼办 © {new Date().getFullYear()} | 工作再忙，也要记得休息</p>
          <div className="mt-2 flex justify-center space-x-4">
            <span className="inline-flex items-center"><i className="fa-solid fa-coffee mr-1"></i> 摸鱼愉快</span>
            <span className="inline-flex items-center"><i className="fa-solid fa-heart mr-1"></i> 健康第一</span>
          </div>
        </footer>
      </div>
    </div>
  );
}