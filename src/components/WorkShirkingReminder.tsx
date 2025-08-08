import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { generateReminderText } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

export default function WorkShirkingReminder() {
  const [reminderText, setReminderText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 生成提醒文本
  useEffect(() => {
    setReminderText(generateReminderText(currentDate));
    
    // 设置每天自动更新
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msToMidnight = tomorrow.getTime() - now.getTime();
    
    const updateTimer = setTimeout(() => {
      setCurrentDate(new Date());
    }, msToMidnight);
    
    return () => clearTimeout(updateTimer);
  }, [currentDate]);
  
  // 复制文本到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(reminderText).then(() => {
      setIsCopied(true);
      toast.success('文本已复制到剪贴板！');
      
      // 2秒后重置复制状态
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      toast.error('复制失败，请手动复制');
      console.error('复制失败:', err);
    });
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* 头部区域 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <i className="fa-solid fa-coffee mr-3"></i>摸鱼办提醒
          </h1>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            每日更新
          </span>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-6 min-h-[400px] transition-all duration-200 hover:bg-gray-100">
          {reminderText || '加载中...'}
        </div>
        
        {/* 复制按钮 */}
        <button
          onClick={copyToClipboard}
          className={cn(
            "w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]",
            isCopied 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-blue-500 hover:bg-blue-600 text-white"
          )}
        >
          {isCopied ? (
            <>
              <i className="fa-solid fa-check-circle"></i>
              <span>已复制到剪贴板</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-copy"></i>
              <span>复制文本内容</span>
            </>
          )}
        </button>
      </div>
      
      {/* 页脚提示 */}
      <div className="bg-gray-50 px-6 py-3 text-center text-xs text-gray-500 border-t border-gray-100">
        <p>今日摸鱼指数：★★★★☆ 适度摸鱼，工作更高效</p>
      </div>
    </div>
  );
}