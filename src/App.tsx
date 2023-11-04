import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import { SideBar } from "./components/SideBar";
import { AllRoom } from "./components/AllRoom";
import { F601Detail } from "./components/F601Detail";
import { F602Detail } from "./components/F602Detail";
import { F612Detail } from "./components/F612Detail";

import { GASClient } from "gas-client";
import * as server from "../server/code";
const { serverFunctions } = new GASClient<typeof server>();

function App() {
  // 予約内容を表すクラス
  class Event {
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

  // 部屋の状態を表す変数
  const [F601Status, setF601Status] = useState("");
  const [F602Status, setF602Status] = useState("");
  const [F612Status, setF612Status] = useState("");

  // 部屋の今日の次の予定を表す変数
  const [F601NextEvent, setF601NextEvent] = useState<Event | null>(null);
  const [F602NextEvent, setF602NextEvent] = useState<Event | null>(null);
  const [F612NextEvent, setF612NextEvent] = useState<Event | null>(null);

  // 現在の日時および更新日時の取得
  const [nowDateTime, setNowDateTime] = useState(new Date());
  const [updatedDateTime, setUpdatedDateTime] = useState(new Date());

  const dateTimeToString = (d: Date) => {
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours().toString().padStart(2, "0");
    let minute = d.getMinutes().toString().padStart(2, "0");
    return `${year}年${month}月${day}日 ${hour}:${minute}`;
  };

  // 部屋の状態取得
  async function fetchRoomStatus() {
    try {
      let F601Status = await serverFunctions.getRoomStatus("F601");
      let F602Status = await serverFunctions.getRoomStatus("F602");
      let F612Status = await serverFunctions.getRoomStatus("F612");
      setF601Status(F601Status);
      setF602Status(F602Status);
      setF612Status(F612Status);
    } catch (error) {
      console.error(error);
    }
  }

  // 1週間の予定をスプレッドシートに書き込む
  async function writeWeekEvent() {
    try {
      await serverFunctions.writeWeekEvent("F601");
      await serverFunctions.writeWeekEvent("F602");
      await serverFunctions.writeWeekEvent("F612");
    } catch (error) {
      console.error(error);
    }
  }

  // 部屋の今日の次の予定取得
  async function fetchNextEvent(roomName: string) {
    try {
      // 予定の取得
      let {
        nextEvent_startTime,
        nextEvent_endTime,
        nextEvent_title,
        nextEvent_description,
      } = await serverFunctions.getNextEvent(roomName);

      let nextEvent = new Event(nextEvent_title, nextEvent_description);
      let result: Event | null;

      // 予定があるかどうかを確認
      // ・予定がない場合 or 開始日時が今日ではない場合→今日の予定ではないとする
      // ・その他→ 次の予定とする

      // 予定がある場合
      if (nextEvent_startTime !== "" && nextEvent_endTime !== "") {
        let startTime_date = new Date(nextEvent_startTime);
        let endTime_date = new Date(nextEvent_endTime);
        nextEvent.setStartandEndTime(startTime_date, endTime_date);
      }
      if (nextEvent.startTime !== null && nextEvent.endTime !== null) {
        // 開始日時が今日の場合
        if (nowDateTime.getDate() === nextEvent.startTime.getDate()) {
          result = nextEvent;
        } else {
          result = null;
        }
      } else {
        // 予定がない or 開始日時が今日ではない場合
        result = null;
      }

      // useStateに登録
      if (roomName === "F601") {
        setF601NextEvent(result);
      } else if (roomName === "F602") {
        setF602NextEvent(result);
      } else if (roomName === "F612") {
        setF612NextEvent(result);
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // 最初のrender時のみ変更する
  useEffect(() => {
    // 更新日時の設定
    let updated_d = new Date();
    setUpdatedDateTime(updated_d);

    // 現在日時の取得
    setInterval(() => {
      let now_d = new Date();
      setNowDateTime(now_d);
    }, 1000);

    // 1週間の予定をスプレッドシートに書き込み
    writeWeekEvent();

    // 部屋の状態取得
    fetchRoomStatus();

    // 本日の次の予定を取得
    fetchNextEvent("F601");
    fetchNextEvent("F602");
    fetchNextEvent("F612");
  }, []);

  // カード内の、本日の次の予定のHTMLコードを返すコンポーネント
  const updateNextEvent = (roomName: string) => {
    let nextEvent: Event | null = null;
    if (roomName === "F601") {
      nextEvent = F601NextEvent;
    } else if (roomName === "F602") {
      nextEvent = F602NextEvent;
    } else if (roomName === "F612") {
      nextEvent = F612NextEvent;
    }
    if (nextEvent === null) {
      return (
        <div className="room-schedule">
          <p className="room-schedule-ptitle">予約内容</p>
          <div className="room-schedule-event">
            <p className="no-used-today">
              本日の予約なし
              <span>Not scheduled</span>
              <span>to be used today</span>
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="room-schedule">
          <p className="room-schedule-ptitle">予約内容</p>
          <div className="room-schedule-event">
            <p>
              {nextEvent.TODisplayTime()}
              <span>{nextEvent.title}</span>
            </p>
          </div>
        </div>
      );
    }
  };

  // 部屋の使用状況のCard型のHTMLコードを返すコンポーネント
  const updateRoomCard = (roomName: string) => {
    let roomStatus;
    if (roomName === "F601") {
      roomStatus = F601Status;
    } else if (roomName === "F602") {
      roomStatus = F602Status;
    } else if (roomName === "F612") {
      roomStatus = F612Status;
    } else {
      console.error("updateRoomCard: 引数が無効です");
    }

    let roomNextEvent = updateNextEvent(roomName);

    if (roomStatus === "使用不可") {
      return (
        <>
          <div className="room-card room-status-unavailable">
            <p className="room-name">{roomName}</p>
            <div className="room-status">
              <p>
                使用不可<span>In Use Not available now</span>
              </p>
            </div>
            {roomNextEvent}
          </div>
        </>
      );
    } else if (roomStatus === "使用中") {
      return (
        <>
          <div className="room-card room-status-using">
            <p className="room-name">{roomName}</p>
            <div className="room-status">
              <p>
                作業中<span>In Use but you can enter</span>
              </p>
            </div>
            {roomNextEvent}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="room-card room-status-available">
            <p className="room-name">{roomName}</p>
            <div className="room-status">
              <p>
                使用可能<span>available</span>
              </p>
            </div>
            {roomNextEvent}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="container">
        <SideBar />
        <div className="main-content">
          <Routes>
            <Route path={`/f601Detail`} element={<F601Detail />} />
            <Route path={`/f602Detail`} element={<F602Detail />} />
            <Route path={`/f612Detail`} element={<F612Detail />} />
            <Route
              path={`/*`}
              element={
                <AllRoom
                  updateRoomCard={updateRoomCard}
                  nowDateTime={dateTimeToString(nowDateTime)}
                  updatedDateTime={dateTimeToString(updatedDateTime)}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
