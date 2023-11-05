import React from "react";

// 予約内容を表すクラス
export class Event {
  title: string = "";
  description: string = "";
  startTime: Date | null = null;
  endTime: Date | null = null;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }

  setStartandEndTime(startTime: Date, endTime: Date) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  TODisplayTime() {
    if (this.startTime !== null && this.endTime !== null) {
      let displayStartTime = `${this.startTime.getHours()}:${this.startTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      let displayEndTime = `${this.endTime.getHours()}:${this.endTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      return `${displayStartTime} ~ ${displayEndTime}`;
    }
    return "";
  }
}
