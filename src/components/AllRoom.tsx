import React, { ReactNode } from "react";
import { TimeBlock } from "./TimeBlock";
import { RoomSummaryCard } from "./RoomSummaryCard";
import { Event } from "./EventClass";
import "./style/AllRoom.css";

type AllRoomProps = {
  nowDateTime: string;
  updatedDateTime: string;
  F601Status: string;
  F602Status: string;
  F612Status: string;
  F601TodayNextEvent: Event | null;
  F602TodayNextEvent: Event | null;
  F612TodayNextEvent: Event | null;
  reloadNextEvent: () => Promise<void>;
};

export const AllRoom = ({
  nowDateTime,
  updatedDateTime,
  F601Status,
  F602Status,
  F612Status,
  F601TodayNextEvent,
  F602TodayNextEvent,
  F612TodayNextEvent,
  reloadNextEvent,
}: AllRoomProps) => {
  return (
    <>
      <h3>Today's Schedule</h3>
      <div className="cards">
        <RoomSummaryCard
          roomName="F601"
          roomStatus={F601Status}
          roomNextEvent={F601TodayNextEvent}
          roomNameDisplay={true}
        />
        <RoomSummaryCard
          roomName="F602"
          roomStatus={F602Status}
          roomNextEvent={F602TodayNextEvent}
          roomNameDisplay={true}
        />
        <RoomSummaryCard
          roomName="F612"
          roomStatus={F612Status}
          roomNextEvent={F612TodayNextEvent}
          roomNameDisplay={true}
        />
      </div>
      <TimeBlock
        nowDateTime={nowDateTime}
        updatedDateTime={updatedDateTime}
        reloadNextEvent={reloadNextEvent}
      />
    </>
  );
};
