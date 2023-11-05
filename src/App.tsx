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
  async function setRoomStatus() {
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
  async function setNextEvent(roomName: string) {
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
    const updateStatusandNextEvent = async () => {
      try {
        await writeWeekEvent();
        // 部屋の状態取得
        setRoomStatus();
        // 本日の次の予定を取得
        setNextEvent("F601");
        setNextEvent("F602");
        setNextEvent("F612");
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
                  F601NextEvent={F601NextEvent}
                  F602NextEvent={F602NextEvent}
                  F612NextEvent={F612NextEvent}
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
