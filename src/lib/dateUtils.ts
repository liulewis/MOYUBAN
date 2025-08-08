/**
 * 日期工具函数 - 用于计算"摸鱼办"提醒中的各种倒计时
 */

// 格式化日期为"YYYY年MM月DD日"格式
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

// 获取星期几的中文名称
export function getWeekdayName(date: Date): string {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekdays[date.getDay()];
}

// 计算两个日期之间的天数差
function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // 毫秒数
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.ceil(diffTime / oneDay);
  return diffDays < 0 ? diffDays + 365 : diffDays; // 如果是过去的日期，计算明年的
}

// 计算距离发工资的天数
export function getPaydayCountdowns(currentDate: Date = new Date()): Record<string, number> {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  
  const payDays = [1, 5, 8, 10, 15, 20, 25, 30];
  const countdowns: Record<string, number> = {};
  
  payDays.forEach(day => {
    // 创建当月的发薪日
    const payday = new Date(currentYear, currentMonth, day);
    
    // 如果发薪日已过，则计算下个月的
    if (payday < currentDate) {
      payday.setMonth(payday.getMonth() + 1);
    }
    
    const daysDiff = getDaysDifference(currentDate, payday);
    countdowns[day < 10 ? `0${day}` : day.toString()] = daysDiff;
  });
  
  return countdowns;
}

// 计算距离周末的天数
export function getWeekendCountdowns(currentDate: Date = new Date()): { doubleWeekend: number, singleWeekend: number } {
  const dayOfWeek = currentDate.getDay(); // 0是星期日，6是星期六
  
  // 计算距离双休周末(周六和周日)的天数
  const doubleWeekendDays = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
  
  // 计算距离单休周末(仅周日)的天数
  const singleWeekendDays = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
  
  return {
    doubleWeekend: doubleWeekendDays,
    singleWeekend: singleWeekendDays
  };
}

// 计算距离节假日的天数
export function getHolidayCountdowns(currentDate: Date = new Date()): Record<string, number> {
  const currentYear = currentDate.getFullYear();
  
  // 定义固定节假日日期
  const holidays: Record<string, [number, number]> = {
    '国庆': [9, 30], // 10月1日
    '中秋': [8, 14], // 农历节日，这里简化为固定日期
  };
  
  const countdowns: Record<string, number> = {};
  
  Object.entries(holidays).forEach(([name, [month, day]]) => {
    const holiday = new Date(currentYear, month, day);
    
    // 如果节日已过，则计算明年的
    if (holiday < currentDate) {
      holiday.setFullYear(currentYear + 1);
    }
    
    countdowns[name] = getDaysDifference(currentDate, holiday);
  });
  
  return countdowns;
}

// 计算距离年底和新年的天数
export function getYearEndCountdowns(currentDate: Date = new Date()): { nextYear: number, nextChineseNewYear: number } {
  const currentYear = currentDate.getFullYear();
  
  // 距离下一年的天数
  const nextYear = new Date(currentYear + 1, 0, 1);
  const nextYearDays = getDaysDifference(currentDate, nextYear);
  
  // 距离下次过年的天数(简化为固定日期2月10日)
  const nextChineseNewYear = new Date(
    currentDate.getMonth() > 1 || (currentDate.getMonth() === 1 && currentDate.getDate() > 10)
      ? currentYear + 1
      : currentYear, 
    1, 10
  );
  const nextChineseNewYearDays = getDaysDifference(currentDate, nextChineseNewYear);
  
  return {
    nextYear: nextYearDays,
    nextChineseNewYear: nextChineseNewYearDays
  };
}

// 生成完整的提醒文本
export function generateReminderText(currentDate: Date = new Date()): string {
  const dateStr = formatDate(currentDate);
  const weekday = getWeekdayName(currentDate);
  const paydays = getPaydayCountdowns(currentDate);
  const weekends = getWeekendCountdowns(currentDate);
  const holidays = getHolidayCountdowns(currentDate);
  const yearEnds = getYearEndCountdowns(currentDate);
  
  // 生成问候语(根据时间段)
  const hour = currentDate.getHours();
  let greeting = "早上好";
  if (hour >= 12 && hour < 18) {
    greeting = "下午好";
  } else if (hour >= 18) {
    greeting = "晚上好";
  }
  
  // 构建文本内容
  let text = `【摸鱼办】提醒您：
今天是${dateStr}，${weekday}。${greeting}，摸鱼人！即使今天是开工第天，也一定不要忘记摸鱼哦！有事没事起身去茶水间，去厕所，去廊道走走，别总在工位上坐着，钱是老板的，但健康是自己的。
温馨提示：
`;
  
  // 添加发工资倒计时
  Object.entries(paydays).forEach(([day, days]) => {
    text += `离【${day}号发工资】：${days}天
`;
  });
  
  // 添加周末倒计时
  text += `离【双休周末】还有：${weekends.doubleWeekend}天
离【单休周末】还有：${weekends.singleWeekend}天
`;
  
  // 添加节假日倒计时
  Object.entries(holidays).forEach(([name, days]) => {
    text += `距离【 ${name} 】还有：${days}天
`;
  });
  
  // 添加年底倒计时
  text += `距离【${currentDate.getFullYear() + 1}年】还有：${yearEnds.nextYear}天
距离【下次过年】还有：${yearEnds.nextChineseNewYear}天`;
  
  return text;
}