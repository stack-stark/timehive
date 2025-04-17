import * as vscode from "vscode";
import cron from "node-cron";
import { Reminder } from "../types";
import { ReminderService } from "../services/ReminderService";
import { StorageService } from "../services/StorageService";
import { ReminderTreeDataProvider } from "../treeViewProvider";
import { isWorkingHours } from "../utils/timeUtils";
import { v4 as uuidv4 } from 'uuid';

/**
 * 命令处理器，封装所有命令操作逻辑
 */
export class CommandHandler {
  constructor(
    private context: vscode.ExtensionContext,
    private reminderService: ReminderService,
    private storageService: StorageService,
    private reminders: Reminder[],
    private treeDataProvider: ReminderTreeDataProvider
  ) {}

  /**
   * 注册添加提醒命令
   * 该命令会弹窗让用户输入cron表达式和提醒内容，然后创建新提醒
   */
  registerAddCommand() {
    // 将命令注册到VSCode的上下文订阅中
    this.context.subscriptions.push(
      vscode.commands.registerCommand("timehive.addReminder", async () => {
        // 获取用户输入的cron表达式
        const cronExpression = await this.getCronExpression();
        // 如果用户取消输入或输入无效，则直接返回
        if (!cronExpression) {
          return;
        }

        // 获取用户输入的提醒内容
        const message = await vscode.window.showInputBox({
          placeHolder: "请输入提醒内容",
        });

        // 如果用户输入了有效内容，则处理新提醒
        if (message) {
          await this.handleNewReminder(cronExpression, message);
        }
      })
    );
  }

  /**
   * 获取用户输入的cron表达式
   * @returns 返回用户输入的合法cron表达式，如果用户取消输入则返回undefined
   */
  private async getCronExpression(): Promise<string | undefined> {
    return vscode.window.showInputBox({
      placeHolder: "请输入cron表达式（如：0 12 * * *）",
      validateInput: (value) =>
        cron.validate(value) ? null : "无效的cron表达式",
    });
  }

  /**
   * 处理新增提醒逻辑
   * @param cronExpression cron表达式，用于设置提醒时间
   * @param message 提醒消息内容
   */
  private async handleNewReminder(cronExpression: string, message: string) {
    // 创建新的提醒对象
    const newReminder = {
      time: cronExpression,
      message,
      id: uuidv4(),
      remark: "自定义提醒", // 默认备注为"自定义提醒"
      isActive: true, // 默认激活状态为true
    };

    // 将新提醒添加到内存数组
    this.reminders.push(newReminder);
    // 将新提醒持久化存储
    await this.storageService.addReminder(
      { ...newReminder, isActive: true },
      this.storageService.getCustomReminders()
    );
    // 刷新树视图显示
    this.treeDataProvider.refresh();
    // 调度新提醒任务，只在工作时间触发
    try {
      this.reminderService.scheduleTask(
        newReminder.id,
        newReminder,
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(`调度失败: ${error.message}`);
    }
  }
}
