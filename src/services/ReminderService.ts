import * as vscode from 'vscode';
import * as cron from 'node-cron';
import { Reminder } from '../types';

type ScheduledTask = cron.ScheduledTask;

/**
 * 提醒任务服务类，封装任务调度相关逻辑
 */
export class ReminderService {
  private jobs = new Map<string, ScheduledTask>();

  /**
   * 初始化预设提醒任务
   * @param reminders 提醒任务数组
   * @param checkWorkingHours 工作时间检查函数
   */
  initializeReminders(
    reminders: Reminder[]
  ) {
    reminders.forEach((reminder) => {
      if (reminder.isActive !== false) {
        this.scheduleTask(reminder.id, reminder);
      }
    });
  }

  /**
   * 调度单个提醒任务
   * @param index 任务索引
   * @param reminder 提醒任务配置
   * @param checkWorkingHours 工作时间检查函数
   */
  public scheduleTask(
    id: string,
    reminder: Reminder,
  ) {
    this.jobs.set(
      reminder.id,
      cron.schedule(reminder.time, () => {
        const now = new Date().toLocaleString();
        console.log(`[${now}] 触发提醒任务 ${reminder.id}: ${reminder.message}`);
        vscode.window.showInformationMessage(reminder.message);
      }, {
        scheduled: true,
        timezone: 'Asia/Shanghai'
      })
    );
    console.log(`[调度成功] ${reminder.id} 表达式: ${reminder.time}`);
    console.log('当前活跃任务:', Array.from(this.jobs.keys()).join(', '));
    console.log('当前任务列表:', Array.from(this.jobs.keys()));
  }

  /**
   * 切换任务状态
   * @param index 任务索引
   * @param reminder 提醒任务配置
   * @param checkWorkingHours 工作时间检查函数
   */
  stopAndRemoveTask(id: string) {
    console.log(`强制停止任务 ${id}`);
    const job = this.jobs.get(id);
    if (job) {
      job.stop();
      this.jobs.delete(id);
      console.log('当前任务列表:', Array.from(this.jobs.keys()));
    }
  }

  toggleTask(
    id: string,
    reminder: Reminder
  ) {
    if (!reminder.isActive) {
      console.log(`停止任务 ${id}: ${reminder.message}`);
      console.log('停止前任务列表:', Array.from(this.jobs.keys()));
      this.jobs.get(id)?.stop();
      this.jobs.delete(id);
      console.log('停止后任务列表:', Array.from(this.jobs.keys()));
    } else {
      console.log(`启动任务 ${id}: ${reminder.message}`);
      this.scheduleTask(id, reminder);
    }
  }

  /**
   * 停止所有任务
   */
  dispose() {
    this.jobs.forEach(task => task.stop());
    this.jobs.clear();
  }
}