import React from "react";

/**
 * 予約内容を表すクラス
 */
export class Event {
  /**
   * title      : 予約タイトル
   * desctiption: 説明文
   * startTime  : 開始時間
   * endTime    : 終了時間
   * eventStatus: 「使用中」あるいは「使用不可」のいずれか
   *               説明文に入室可能の文字が含まれているかどうかで決定
   * creator    : イベント作成者
   */
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

  /**
   * 開始時間と終了時間を表示形式に変換するメソッド
   */
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
