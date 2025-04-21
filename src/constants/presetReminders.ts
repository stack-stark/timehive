import { Reminder } from '../types';

export const presetReminders: Reminder[] = [
    {
      id: "9d9ce6c4-4bd5-9626-bb6b-dca212860616",
      time: "30 8-17 * * 1-5",
      message: "🍵 喝水时间到，请注意补充水分！",
      remark: "周一到周五每30分钟",
    },
    {
      id: "987da5aa-85da-dee2-4140-2e9b0dcca0aa",
      time: "25 9 * * 1-5",
      message: "💴 股市即将开盘，请做好准备",
      remark: "周一到周五9:25",
    },
    {
      id: "05646102-abb8-a8af-b936-288394bc22e9",
      time: "55 11 * * 1-5",
      message: "🍜 准备下班吃饭",
      remark: "周一到周五9:25",
    },
    {
      id: "4a3bc56d-00b9-9d62-ce56-45fc4e675ba3",
      time: "45 14 * * 1-5",
      message: "💰️ 距离收盘还有15分钟，请注意操作",
      remark: "周一到周五14:45",
    },
    {
      id: "ec8e7c2a-88ab-db30-a96b-a5d573cda04a",
      time: "0 18 * * 1-5",
      message: "👨‍💻 下班时间到，请检查今日工作进度",
      remark: "周一到周五18:00",
    },
    {
      id: "f2c6bae2-221e-d6e6-6e5e-0799e329670b",
      time: "0 10 * * 5",
      message: "🎮️ 记得领取本周Epic免费游戏！",
      remark: "周五10:00",
    },
    // {
    //   id: "a5ae52eb-4a89-3393-cc49-24c89efb424b",
    //   time: "* * * * *",
    //   message: "🍉 测试一下默认一分钟是否正常",
    //   remark: "默认一分钟",
    // },
  ];