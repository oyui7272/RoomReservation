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
  // 部屋の状態を表す変数
  const [F601Status, setF601Status] = useState("");
  const [F602Status, setF602Status] = useState("");
  const [F612Status, setF612Status] = useState("");

  // 部屋の今日の次の予定を表す変数
  const [F601TodayNextEvent, setF601TodayNextEvent] = useState<Event | null>(
    null
  );
  const [F602TodayNextEvent, setF602TodayNextEvent] = useState<Event | null>(
    null
  );
  const [F612TodayNextEvent, setF612TodayNextEvent] = useState<Event | null>(
    null
  );

  // 部屋の一週間の予定を表す変数
  const [F601WeekEvents, setF601WeekEvents] = useState<Event[]>([]);
  const [F602WeekEvents, setF602WeekEvents] = useState<Event[]>([]);
  const [F612WeekEvents, setF612WeekEvents] = useState<Event[]>([]);

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

  async function getNextEvent(roomName: string) {
    try {
      // 予定の取得
      let {
        nextEvent_startTime,
        nextEvent_endTime,
        nextEvent_title,
        nextEvent_description,
      } = await serverFunctions.getNextEvent(roomName);

      let nextEvent: Event;
      let result: Event | null;

      // 予定があるかどうかを確認
      // ・予定がない場合 → nullを返す
      // ・予定がある場合 → 次の予定の情報を含むEventインスタンスを返す
      if (nextEvent_startTime !== "" && nextEvent_endTime !== "") {
        let startTime_date = new Date(nextEvent_startTime);
        let endTime_date = new Date(nextEvent_endTime);
        nextEvent = new Event(
          nextEvent_title,
          nextEvent_description,
          startTime_date,
          endTime_date
        );
        result = nextEvent;
      } else {
        result = null;
      }
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  // 部屋の状態取得
  function getRoomStatus(roomName: string) {
    let nextEvent: Event | null = null;
    if (roomName === "F601") {
      nextEvent = F601TodayNextEvent;
    } else if (roomName === "F602") {
      nextEvent = F602TodayNextEvent;
    } else if (roomName === "F612") {
      nextEvent = F612TodayNextEvent;
    }

    let roomStatus = "空室";
    // 状態を判断
    if (nextEvent !== null) {
      if (nextEvent.startTime !== null && nextEvent.endTime !== null) {
        let diff1_ms =
          updatedDateTime.getTime() - nextEvent.startTime.getTime();
        let diff2_ms = nextEvent.endTime.getTime() - updatedDateTime.getTime();
        if (diff1_ms > 0 && diff2_ms > 0) {
          roomStatus = "使用不可";
          if (nextEvent.description.includes("入室可能")) {
            roomStatus = "使用中";
          }
        }
      }
    }
    return roomStatus;
  }

  async function setRoomStatus(roomName: string) {
    let roomStatus = getRoomStatus(roomName);
    if (roomName === "F601") {
      setF601Status(roomStatus);
    } else if (roomName === "F602") {
      setF602Status(roomStatus);
    } else {
      setF612Status(roomStatus);
    }
    await serverFunctions.writeRoomStatus(roomName, roomStatus);
  }

  // 部屋の今日の次の予定取得
  async function getTodayNextEvent(roomName: string) {
    let result: Event | null | undefined;
    let todayNextEvent: Event | null = null;

    result = await getNextEvent(roomName);
    if (result === null || result === undefined) {
      todayNextEvent = null;
    } else {
      if (result !== null) {
        // 開始日時が今日の場合
        if (nowDateTime.getDate() === result?.startTime?.getDate()) {
          todayNextEvent = result;
        } else {
          todayNextEvent = null;
        }
      }
    }
    return todayNextEvent;
  }

  // useStateに登録
  async function setTodayNextEvent(roomName: string) {
    let todayNextEvent = await getTodayNextEvent(roomName);
    if (roomName === "F601") {
      setF601TodayNextEvent(todayNextEvent);
    } else if (roomName === "F602") {
      setF602TodayNextEvent(todayNextEvent);
    } else if (roomName === "F612") {
      setF612TodayNextEvent(todayNextEvent);
    }
  }

  // 1週間の予定取得
  async function getWeekEvents(roomName: string) {
    let weekEvents: Event[] = [];
    try {
      let result = await serverFunctions.getWeekEvents(roomName);
      let eMaxNum = result.length / 4;
      for (let eNum = 0; eNum < eMaxNum; eNum++) {
        let title = result[eNum * 4];
        let description = result[eNum * 4 + 1];
        let startTime = new Date(result[eNum * 4 + 2]);
        let endTime = new Date(result[eNum * 4 + 3]);

        let eventStatus = "使用不可";
        if (description.includes("入室可能")) {
          eventStatus = "使用中";
        }

        let addEvent = new Event(title, description, startTime, endTime);
        addEvent.setEventStatus(eventStatus);

        weekEvents.push(addEvent);
      }
      return weekEvents;
    } catch (error) {
      console.log(error);
    }
    return weekEvents;
  }

  // useStateに登録
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

  async function reloadNextEvent() {
    try {
      // 更新日時の設定
      let updated_d = new Date();
      setUpdatedDateTime(updated_d);
      // 1週間の予定をスプレッドシートに書き込み
      await writeWeekEvent();
      // 本日の次の予定を取得し、UseStateに更新
      setTodayNextEvent("F601");
      setTodayNextEvent("F602");
      setTodayNextEvent("F612");

      // 1週間の次の予定を取得し、UseStateに更新
      setWeekEvents("F601");
      setWeekEvents("F602");
      setWeekEvents("F612");
    } catch (error) {
      console.error(error);
    }
  }

  // 最初のrender時のみ変更する
  useEffect(() => {
    // 現在日時の取得
    setInterval(() => {
      let now_d = new Date();
      setNowDateTime(now_d);
    }, 1000);

    reloadNextEvent();
  }, []);

  // F601 / F602 / F612の今日の次の予定が変更されたら > 部屋の状態更新
  useEffect(() => {
    setRoomStatus("F601");
  }, [F601TodayNextEvent]);
  useEffect(() => {
    setRoomStatus("F602");
  }, [F602TodayNextEvent]);
  useEffect(() => {
    setRoomStatus("F612");
  }, [F612TodayNextEvent]);

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
