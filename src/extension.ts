import * as vscode from "vscode";
const cron = require("node-cron");
import { ReminderTreeDataProvider } from "./treeViewProvider";

export const reminders = [
  { time: "30 8-17 * * 1-5", message: "🍵 喝水时间到，请注意补充水分！", remark: "周一到周五每30分钟" },
  { time: "25 9 * * 1-5", message: "💰️ 股市即将开盘，请做好准备", remark: "周一到周五9:25" },
  { time: "45 14 * * 1-5", message: "💰️ 距离收盘还有15分钟，请注意操作", remark: "周一到周五14:45" },
  { time: "0 18 * * 1-5", message: "👨‍💻 下班时间到，请检查今日工作进度", remark: "周一到周五18:00" },
  { time: "0 10 * * 5", message: "🎮️ 记得领取本周Epic免费游戏！", remark: "周五10:00"},
  { time: "* * * * *", message: "这是调试提醒", debug: true, remark: "每1分钟" },
];

export function activate(context: vscode.ExtensionContext) {
  const jobs = reminders.map((reminder) => {
    return cron.schedule(reminder.time, () => {
      if (reminder.debug || isWorkingHours()) {
        vscode.window.showInformationMessage(reminder.message);
      }
    });
  });

  context.subscriptions.push({
    dispose: () => jobs.forEach((job) => job.stop()),
  });

  const treeDataProvider = new ReminderTreeDataProvider();
  vscode.window.registerTreeDataProvider(
    "timehive.view.reminders",
    treeDataProvider
  );

  // 添加定时刷新
  const timer = setInterval(() => treeDataProvider.refresh(), 1000 * 60);
  context.subscriptions.push({
    dispose: () => clearInterval(timer),
  });
}

function isWorkingHours() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const day = now.getDay();

  // 周一至周五（1-5）且时间在8:30-18:00之间
  return (
    day >= 1 &&
    day <= 5 &&
    (hours > 8 || (hours === 8 && minutes >= 30)) &&
    hours < 18
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
