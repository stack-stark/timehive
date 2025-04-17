import * as vscode from "vscode";
import { reminders } from "./extension";

class ReminderTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly cronExpression: string,
    public readonly message: string,
    public readonly remark: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${this.label}【${this.remark}】`;
    // this.description = this.remark;
  }
}

export class ReminderTreeDataProvider
  implements vscode.TreeDataProvider<ReminderTreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ReminderTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<ReminderTreeItem[]> {
    return Promise.resolve(
      reminders.map(
        (reminder) =>
          new ReminderTreeItem(
            `${reminder.message}`,
            reminder.time,
            reminder.message,
            reminder.remark
          )
      )
    );
  }
}
