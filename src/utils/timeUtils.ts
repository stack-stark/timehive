/**
 * 工作时间检查工具函数
 * @returns 当前是否处于工作日的工作时间段（周一至周五 8:30-18:00）
 */
export function isWorkingHours(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const day = now.getDay();

  return (
    day >= 1 &&
    day <= 5 &&
    (hours > 8 || (hours === 8 && minutes >= 30)) &&
    hours < 18
  );
}