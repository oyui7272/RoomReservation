import React, { useState, useEffect } from "react";
import "./App.css";

import { SideBar } from "./components/SideBar";
import { AllList } from "./components/AllList";

import { GASClient } from "gas-client";
import * as server from "../server/code";
const { serverFunctions } = new GASClient<typeof server>();

function App() {
  const [F601Status, setF601Status] = useState("");
  const [F602Status, setF602Status] = useState("");
  const [F612Status, setF612Status] = useState("");

  useEffect(() => {
    async function fetchRoomStatus() {
      try {
        const F601Status = await serverFunctions.getRoomStatus("F601");
        const F602Status = await serverFunctions.getRoomStatus("F602");
        const F612Status = await serverFunctions.getRoomStatus("F612");
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
          <p className="room-name room-status-unavailable">{roomName}</p>
          <div className="room-status">
            <p>
              使用不可<span>In Use Not available now</span>
            </p>
          </div>
        </>
      );
    } else if (roomStatus === "使用中") {
      return (
        <>
          <p className="room-name room-status-using">{roomName}</p>
          <div className="room-status">
            <p>
              作業中<span>In Use but you can enter</span>
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <p className="room-name room-status-available">{roomName}</p>
          <div className="room-status">
            <p>
              使用可能<span>available</span>
            </p>
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
          <AllList updateRoomCard={updateRoomCard} />
        </div>
      </div>
    </>
  );
}

export default App;
