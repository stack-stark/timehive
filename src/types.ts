export interface Reminder {
  id: string;
  time: string;
  message: string;
  remark: string;
  isActive?: boolean;
}