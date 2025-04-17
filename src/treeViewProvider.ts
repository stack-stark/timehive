import * as vscode from "vscode";
import { Reminder } from "./types";

class ReminderTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly cronExpression: string,
    public readonly message: string,
    public readonly remark: string,
    public readonly reminder: Reminder
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${this.label}【${this.remark}】`;
    this.description = reminder.isActive ? '✅ 运行中' : '⏸️ 已暂停';
  }
}

export class ReminderTreeDataProvider
  implements vscode.TreeDataProvider<ReminderTreeItem>
{
  private reminders: Reminder[];

  constructor(reminders: Reminder[]) {
    this.reminders = reminders;
  }

  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ReminderTreeItem): vscode.TreeItem {
    element.contextValue = element.reminder.isActive ? 'active' : 'inactive';
    return element;
  }

  setReminderActiveStatus(index: number, isActive: boolean) {
    this.reminders[index].isActive = isActive;
    this.refresh();
  }

  removeReminder(index: number) {
    this.reminders.splice(index, 1);
    this.refresh();
  }

  getChildren(): Thenable<ReminderTreeItem[]> {
    return Promise.resolve(
        this.reminders.map(
        (reminder) =>
          new ReminderTreeItem(
            `${reminder.message}`,
            reminder.time,
            reminder.message,
            reminder.remark,
            reminder
          )
      )
    );
  }
}
