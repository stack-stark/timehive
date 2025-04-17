import * as vscode from "vscode";
import { ReminderTreeDataProvider } from "./treeViewProvider";
import { Reminder } from "./types";
import { presetReminders } from "./constants/presetReminders";
import { CommandHandler } from "./commands/CommandHandler";
import { StorageService } from "./services/StorageService";
import { ReminderService } from "./services/ReminderService";

export function activate(context: vscode.ExtensionContext) {
  // 初始化核心服务
  const storageService = new StorageService(context);
  const reminderService = new ReminderService();
  
  // 获取提醒数据
  const customReminders: Reminder[] = storageService.getCustomReminders();
  const reminders: Reminder[] = [
    ...presetReminders.map((r) => ({ ...r, isActive: true })),
    ...customReminders,
  ];

  // 初始化所有提醒任务
  reminderService.initializeReminders(reminders);

  // 创建提醒事项树视图提供者实例，传入当前所有提醒事项
  const treeDataProvider = new ReminderTreeDataProvider(reminders);
  // 注册树视图提供者到VS Code窗口，使用timehive.view.reminders作为视图ID
  vscode.window.registerTreeDataProvider(
    "timehive.view.reminders",
    treeDataProvider
  );

  // 创建命令处理器并注册命令
  const commandHandler = new CommandHandler(
    context,
    reminderService,
    storageService,
    reminders,
    treeDataProvider
  );
  commandHandler.registerAddCommand();

  // 切换任务状态
  context.subscriptions.push(
    vscode.commands.registerCommand("timehive.toggleReminder", async (item) => {
      const index = reminders.findIndex(r => r.id === item.reminder.id);
      if (index !== -1) {
        const reminder = reminders[index];
        reminder.isActive = !reminder.isActive;
        reminderService.toggleTask(reminder.id, reminder);
        await storageService.updateCustomReminders(customReminders);
        treeDataProvider.setReminderActiveStatus(index, reminder.isActive);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("timehive.deleteReminder", async (item) => {
      const index = reminders.findIndex(r => r.id === item.reminder.id);
      if (index !== -1) {
        // 停止并删除对应的定时任务
        reminderService.stopAndRemoveTask(reminders[index].id);

        // 从主提醒列表中删除该项
        reminders.splice(index, 1);

        // 更新树视图
        treeDataProvider.removeReminder(index);
      }
    })
  );

  context.subscriptions.push({
    dispose: () => reminderService.dispose(),
  });

  const timer = setInterval(() => treeDataProvider.refresh(), 1000 * 60);
  context.subscriptions.push({
    dispose: () => clearInterval(timer),
  });
}

export function deactivate() {}
