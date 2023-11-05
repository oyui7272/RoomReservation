import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import { SideBar } from "./components/SideBar";
import { AllRoom } from "./components/AllRoom";
import { F601Detail } from "./components/F601Detail";
import { F602Detail } from "./components/F602Detail";
import { F612Detail } from "./components/F612Detail";
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
  async function setRoomStatus(roomName: string) {
    try {
      let nextEvent: Event | null | undefined;
      nextEvent = await getNextEvent(roomName);

      let roomStatus = "空室";
      // 状態を判断
      if (nextEvent !== null && nextEvent !== undefined) {
        if (nextEvent.startTime !== null && nextEvent.endTime !== null) {
          let diff1_ms =
            updatedDateTime.getTime() - nextEvent.startTime.getTime();
          let diff2_ms =
            nextEvent.endTime.getTime() - updatedDateTime.getTime();
          if (diff1_ms > 0 && diff2_ms > 0) {
            roomStatus = "使用不可";
            if (nextEvent.description.includes("入室可能")) {
              roomStatus = "使用中";
            }
          }
        }
      }
      if (roomName === "F601") {
        setF601Status(roomStatus);
      } else if (roomName === "F602") {
        setF602Status(roomStatus);
      } else {
        setF612Status(roomStatus);
      }
      await serverFunctions.writeRoomStatus(roomName, roomStatus);
    } catch (error) {
      console.error(error);
    }
  }
  // 部屋の今日の次の予定取得
  async function setTodayNextEvent(roomName: string) {
    let result: Event | null | undefined;
    let todayNextEvent: Event | null = null;

    result = await getNextEvent(roomName);
    if (result == undefined) {
      console.log("resultがundefinedでした");
    } else {
      if (result !== null && result !== undefined) {
        // 開始日時が今日の場合
        if (nowDateTime.getDate() === result?.startTime?.getDate()) {
          todayNextEvent = result;
        } else {
          todayNextEvent = null;
        }
      } else {
        todayNextEvent = null;
      }
      // useStateに登録
      if (roomName === "F601") {
        setF601TodayNextEvent(todayNextEvent);
      } else if (roomName === "F602") {
        setF602TodayNextEvent(todayNextEvent);
      } else if (roomName === "F612") {
        setF612TodayNextEvent(todayNextEvent);
      }
    }
    return todayNextEvent;
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

    // 部屋の次の予定や状態を更新
    const updateStatusandNextEvent = async () => {
      try {
        // 1週間の予定をスプレッドシートに書き込み
        await writeWeekEvent();
        // 部屋の状態取得
        setRoomStatus("F601");
        setRoomStatus("F602");
        setRoomStatus("F612");
        // 本日の次の予定を取得
        setTodayNextEvent("F601");
        setTodayNextEvent("F602");
        setTodayNextEvent("F612");
      } catch (error) {
        console.error(error);
      }
    };
    updateStatusandNextEvent();
  }, []);

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
                  nowDateTime={dateTimeToString(nowDateTime)}
                  updatedDateTime={dateTimeToString(updatedDateTime)}
                  F601Status={F601Status}
                  F602Status={F602Status}
                  F612Status={F612Status}
                  F601TodayNextEvent={F601TodayNextEvent}
                  F602TodayNextEvent={F602TodayNextEvent}
                  F612TodayNextEvent={F612TodayNextEvent}
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
