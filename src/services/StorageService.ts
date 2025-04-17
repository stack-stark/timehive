import * as vscode from 'vscode';
import { Reminder } from '../types';

/**
 * 存储服务类，封装VS Code全局状态管理
 */
export class StorageService {
  constructor(private context: vscode.ExtensionContext) {}

  /**
   * 获取自定义提醒列表
   */
  getCustomReminders(): Reminder[] {
    return (this.context.globalState.get('customReminders', []) as Reminder[])
      .map(r => ({...r, isActive: r.isActive !== undefined ? r.isActive : true}));
  }

  /**
   * 更新自定义提醒列表
   * @param reminders 新的提醒任务数组
   */
  async updateCustomReminders(reminders: Reminder[]) {
    await this.context.globalState.update('customReminders', reminders);
  }

  /**
   * 添加单个提醒任务
   * @param reminder 要添加的提醒任务
   * @param reminders 现有提醒任务数组
   */
  async addReminder(reminder: Reminder, reminders: Reminder[]) {
    reminders.push(reminder);
    await this.updateCustomReminders(reminders);
  }

  /**
   * 删除指定提醒任务
   * @param index 任务索引
   * @param reminders 现有提醒任务数组
   */
  async deleteReminder(id: string, reminders: Reminder[]) {
    const index = reminders.findIndex(r => r.id === id);
    if(index === -1) {return;}
    reminders.splice(index, 1);
    await this.updateCustomReminders(reminders);
  }
}