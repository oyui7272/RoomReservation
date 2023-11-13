import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import { SideBar } from "./components/SideBar";
import { AllRoom } from "./components/AllRoom";
import { RoomDashboard } from "./components/RoomDashboard";
import { Event } from "./components/EventClass";

import { GASClient } from "gas-client";
import * as server from "../server/code";
const { serverFunctions } = new GASClient<typeof server>();

function App() {
  // 部屋の状態を表すstate変数
  const [F601Status, setF601Status] = useState("");
  const [F602Status, setF602Status] = useState("");
  const [F612Status, setF612Status] = useState("");

  // 部屋の今日の次の予定を表すstate変数
  const [F601TodayNextEvent, setF601TodayNextEvent] = useState<Event | null>(
    null
  );
  const [F602TodayNextEvent, setF602TodayNextEvent] = useState<Event | null>(
    null
  );
  const [F612TodayNextEvent, setF612TodayNextEvent] = useState<Event | null>(
    null
  );

  // 部屋の1週間の予定を表すstate変数
  const [F601WeekEvents, setF601WeekEvents] = useState<Event[]>([]);
  const [F602WeekEvents, setF602WeekEvents] = useState<Event[]>([]);
  const [F612WeekEvents, setF612WeekEvents] = useState<Event[]>([]);

  // 現在の日時および更新日時のstate変数
  const [nowDateTime, setNowDateTime] = useState(new Date());
  const [updatedDateTime, setUpdatedDateTime] = useState(new Date());

  /**
   * 日時を表示用に（-年-月-日-:-)の形に表す関数
   * ・引数   d: 変換したい日時
   * ・戻り値 -年-月-日-:-の文字列
   */
  const dateTimeToString = (d: Date) => {
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours().toString().padStart(2, "0");
    let minute = d.getMinutes().toString().padStart(2, "0");
    return `${year}年${month}月${day}日 ${hour}:${minute}`;
  };

  /**
   * 1週間の予約を取得し、Google Spreadsheetに書き込む関数
   */
  async function writeWeekEvent() {
    try {
      await serverFunctions.writeWeekEvent("F601");
      await serverFunctions.writeWeekEvent("F602");
      await serverFunctions.writeWeekEvent("F612");
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 部屋の次の予約を取得する関数
   * ・引数 roomName: 部屋名（F601, F602, F612のいずれか)
   * ・戻り値 部屋の次のイベントEventインスタンス(もし次のイベントがない場合はnull)
   */
  function getNextEvent(roomName: string) {
    let nextEvent: Event | null = null;
    if (roomName === "F601") {
      nextEvent = F601WeekEvents[0] || null;
    } else if (roomName === "F602") {
      nextEvent = F602WeekEvents[0] || null;
    } else if (roomName === "F612") {
      nextEvent = F612WeekEvents[0] || null;
    }
    return nextEvent;
  }

  /**
   * 部屋の現在の状態を取得する関数
   * ・引数 roomName: 部屋名（F601, F602, F612のいずれか)
   * ・戻り値 部屋の現在の状態(使用可能, 使用中, 使用不可のいずれか)
   */
  function getRoomStatus(roomName: string) {
    let nextEvent: Event | null = null;
    if (roomName === "F601") {
      nextEvent = F601TodayNextEvent;
    } else if (roomName === "F602") {
      nextEvent = F602TodayNextEvent;
    } else if (roomName === "F612") {
      nextEvent = F612TodayNextEvent;
    }

    let roomStatus = "使用可能";
    // 状態を判断
    if (nextEvent !== null) {
      let diff1_ms = updatedDateTime.getTime() - nextEvent.startTime.getTime();
      let diff2_ms = nextEvent.endTime.getTime() - updatedDateTime.getTime();
      if (diff1_ms > 0 && diff2_ms > 0) {
        roomStatus = nextEvent.eventStatus;
      }
    }
    return roomStatus;
  }

  /**
   * 部屋の現在の状態をstate変数に保存したのち、Google Spreadsheetにも書き込む関数
   * ・引数 roomName: 部屋名（F601, F602, F612のいずれか)
   * ・戻り値 なし
   */
  async function setRoomStatus(roomName: string) {
    let roomStatus = getRoomStatus(roomName);
    if (roomName === "F601") {
      setF601Status(roomStatus);
    } else if (roomName === "F602") {
      setF602Status(roomStatus);
    } else if (roomName === "F612") {
      setF612Status(roomStatus);
    }
    serverFunctions.writeRoomStatus(roomName, roomStatus);
  }

  /**
   * 部屋の本日の次の予約を取得する関数
   * ・引数 roomName: 部屋名（F601, F602, F612のいずれか)
   * ・戻り値 部屋の本日の次の予約Eventインスタンス(本日の次の予約がない時はnullを返す)
   */
  function getTodayNextEvent(roomName: string) {
    let nextEvent: Event | null;
    let todayNextEvent: Event | null = null;

    nextEvent = getNextEvent(roomName);
    if (nextEvent !== null) {
      // 開始日時が今日の場合
      if (nowDateTime.getDate() === nextEvent.startTime.getDate()) {
        todayNextEvent = nextEvent;
      }
    }
    return todayNextEvent;
  }

  /**
   * 部屋の本日の次のイベントをstate変数に保存する関数
   * ・引数 roomName: 部屋名（F601, F602, F612のいずれか)
   * ・戻り値 なし
   */
  function setTodayNextEvent(roomName: string) {
    let todayNextEvent = getTodayNextEvent(roomName);
    if (roomName === "F601") {
      setF601TodayNextEvent(todayNextEvent);
    } else if (roomName === "F602") {
      setF602TodayNextEvent(todayNextEvent);
    } else if (roomName === "F612") {
      setF612TodayNextEvent(todayNextEvent);
    }
  }

  /**
   * 部屋の1週間の予約を取得する関数
   * ・引数 roomName: 部屋名（F601, F602, F612のいずれか)
   * ・戻り値
   * 部屋の1週間の予約のリスト
   * (Eventインスタンスのリスト、もし予約がない場合は空の配列を返す)
   */
  async function getWeekEvents(roomName: string) {
    let weekEvents: Event[] = [];
    try {
      let result = await serverFunctions.getWeekEvents(roomName);
      let eMaxNum = result.length / 5;
      for (let eNum = 0; eNum < eMaxNum; eNum++) {
        let title = result[eNum * 5];
        let description = result[eNum * 5 + 1];
        let startTime = new Date(result[eNum * 5 + 2]);
        let endTime = new Date(result[eNum * 5 + 3]);
        let creator = result[eNum * 5 + 4];

        let eventStatus = "使用不可";
        if (description.includes("入室可能")) {
          eventStatus = "使用中";
        }

        let addEvent = new Event(
          title,
          description,
          startTime,
          endTime,
          eventStatus,
          creator
        );

        weekEvents.push(addEvent);
      }
    } catch (error) {
      console.log(error);
    }
    return weekEvents;
  }

  /**
   * 部屋の1週間のイベントをstate変数に保存する関数
   * ・引数 roomName: 部屋名（F601, F602, F612のいずれか)
   * ・戻り値 なし
   */
  async function setWeekEvents(roomName: string) {
    let weekEvents = await getWeekEvents(roomName);
    if (roomName === "F601") {
      setF601WeekEvents(weekEvents);
    } else if (roomName === "F602") {
      setF602WeekEvents(weekEvents);
    } else if (roomName === "F612") {
      setF612WeekEvents(weekEvents);
    }
  }

  /**
   * 更新を行う関数
   * ・引数 なし  ・戻り値 なし
   */
  async function reloadNextEvent() {
    try {
      // 更新日時の設定
      let updated_d = new Date();
      setUpdatedDateTime(updated_d);
      // 1週間の予定をスプレッドシートに書き込み
      await writeWeekEvent();
      // 1週間の次の予定を取得し、UseStateに更新
      setWeekEvents("F601");
      setWeekEvents("F602");
      setWeekEvents("F612");
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 最初のレンダー時のみ行う処理
   */
  useEffect(() => {
    // 現在日時の取得
    setInterval(() => {
      let now_d = new Date();
      setNowDateTime(now_d);
    }, 1000);
    // 更新を行う
    reloadNextEvent();
  }, []);

  /**
   * 部屋の本日の次の予定が変更されたら行う処理
   * → 部屋の状態を更新
   */
  useEffect(() => {
    setRoomStatus("F601");
  }, [F601TodayNextEvent]);
  useEffect(() => {
    setRoomStatus("F602");
  }, [F602TodayNextEvent]);
  useEffect(() => {
    setRoomStatus("F612");
  }, [F612TodayNextEvent]);

  /**
   * 部屋の1週間の予定が変更されたら行う処理
   * → 部屋の次の予定を変更
   */
  useEffect(() => {
    setTodayNextEvent("F601");
  }, [F601WeekEvents]);
  useEffect(() => {
    setTodayNextEvent("F602");
  }, [F602WeekEvents]);
  useEffect(() => {
    setTodayNextEvent("F612");
  }, [F612WeekEvents]);

  return (
    <>
      <div className="container">
        <SideBar />
        <div className="main-content">
          <Routes>
            <Route
              path={`/f601Dashboard`}
              element={
                <RoomDashboard
                  roomName="F601"
                  nowDateTime={dateTimeToString(nowDateTime)}
                  updatedDateTime={dateTimeToString(updatedDateTime)}
                  roomStatus={F601Status}
                  roomTodayNextEvent={F601TodayNextEvent}
                  roomWeekEvents={F601WeekEvents}
                  reloadNextEvent={reloadNextEvent}
                />
              }
            />
            <Route
              path={`/f602Dashboard`}
              element={
                <RoomDashboard
                  roomName="F602"
                  nowDateTime={dateTimeToString(nowDateTime)}
                  updatedDateTime={dateTimeToString(updatedDateTime)}
                  roomStatus={F602Status}
                  roomTodayNextEvent={F602TodayNextEvent}
                  roomWeekEvents={F602WeekEvents}
                  reloadNextEvent={reloadNextEvent}
                />
              }
            />
            <Route
              path={`/f612Dashboard`}
              element={
                <RoomDashboard
                  roomName="F612"
                  nowDateTime={dateTimeToString(nowDateTime)}
                  updatedDateTime={dateTimeToString(updatedDateTime)}
                  roomStatus={F612Status}
                  roomTodayNextEvent={F612TodayNextEvent}
                  roomWeekEvents={F612WeekEvents}
                  reloadNextEvent={reloadNextEvent}
                />
              }
            />
            <Route
              path={`/*`}
              element={
                <AllRoom
                  nowDateTime={dateTimeToString(nowDateTime)}
                  updatedDateTime={dateTimeToString(updatedDateTime)}
                  F601Status={F601Status}
                  F602Status={F602Status}
                  F612Status={F612Status}
                  F601TodayNextEvent={F601TodayNextEvent}
                  F602TodayNextEvent={F602TodayNextEvent}
                  F612TodayNextEvent={F612TodayNextEvent}
                  reloadNextEvent={reloadNextEvent}
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
