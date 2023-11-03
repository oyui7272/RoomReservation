import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import { SideBar } from "./components/SideBar";
import { AllList } from "./components/AllList";
import { F601Detail } from "./components/F601Detail";
import { F602Detail } from "./components/F602Detail";
import { F612Detail } from "./components/F612Detail";

import { GASClient } from "gas-client";
import * as server from "../server/code";
const { serverFunctions } = new GASClient<typeof server>();

function App() {
  // 部屋の状態を表す変数
  const [F601Status, setF601Status] = useState("");
  const [F602Status, setF602Status] = useState("");
  const [F612Status, setF612Status] = useState("");

  // 現在の日時および更新日時の取得
  const [nowDateTime, setNowDateTime] = useState("");
  const [updatedDateTime, setUpdatedDateTime] = useState("");

  const dateTimeToString = (d: Date) => {
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours().toString().padStart(2, "0");
    let minute = d.getMinutes().toString().padStart(2, "0");
    return `${year}年${month}月${day}日 ${hour}:${minute}`;
  };
  // 最初のrender時のみ変更する
  useEffect(() => {
    // 更新日時の設定
    let updated_d = new Date();
    setUpdatedDateTime(dateTimeToString(updated_d));

    // 現在日時の取得
    setInterval(() => {
      let now_d = new Date();
      setNowDateTime(dateTimeToString(now_d));
    }, 1000);

    // 部屋の状態取得
    async function fetchRoomStatus() {
      try {
        const F601Status = await serverFunctions.getRoomStatus("F601");
        const F602Status = await serverFunctions.getRoomStatus("F602");
        const F612Status = await serverFunctions.getRoomStatus("F612");
        // const appURL = await serverFunctions.getAppUrl();
        setF601Status(F601Status);
        setF602Status(F602Status);
        setF612Status(F612Status);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRoomStatus();
  }, []);

  // 部屋の使用状況に合わせて、CardのHTMLコードを返す関数
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
            <div className="room-schedule">
              <p className="room-schedule-ptitle">次の予定</p>
              <div className="room-schedule-event">
                <p className="no-used-today">
                  本日使用なし
                  <span>Not scheduled</span>
                  <span>to be used today</span>
                </p>
              </div>
            </div>
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
            <div className="room-schedule">
              <p className="room-schedule-ptitle">予約内容</p>
              <div className="room-schedule-event">
                <p>
                  9:00 ~ 10:30<span>サーバ復旧作業</span>
                </p>
              </div>
            </div>
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
            <div className="room-schedule">
              <p className="room-schedule-ptitle">予約内容</p>
              <div className="room-schedule-event">
                <p>
                  9:00 ~ 10:00<span>PDA打ち合わせ</span>
                </p>
              </div>
            </div>
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
                <AllList
                  updateRoomCard={updateRoomCard}
                  nowDateTime={nowDateTime}
                  updatedDateTime={updatedDateTime}
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
