import React from "react";

// 予約内容を表すクラス
export class Event {
  title: string = "";
  description: string = "";
  startTime: Date;
  endTime: Date;
  eventStatus: string = "";
  creator: string = "";

  constructor(
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    eventStatus: string,
    creator: string
  ) {
    this.title = title;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.eventStatus = eventStatus;
    this.creator = creator;
  }

  ToDisplayTime() {
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
