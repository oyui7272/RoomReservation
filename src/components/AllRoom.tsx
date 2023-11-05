import React, { ReactNode } from "react";
import { TimeBlock } from "./TimeBlock";
import { RoomSummaryCard } from "./RoomSummaryCard";
import { Event } from "./EventClass";

type AllRoomProps = {
  nowDateTime: string;
  updatedDateTime: string;
  F601Status: string;
  F602Status: string;
  F612Status: string;
  F601NextEvent: Event | null;
  F602NextEvent: Event | null;
  F612NextEvent: Event | null;
};

export const AllRoom = ({
  nowDateTime,
  updatedDateTime,
  F601Status,
  F602Status,
  F612Status,
  F601NextEvent,
  F602NextEvent,
  F612NextEvent,
}: AllRoomProps) => {
  return (
    <>
      <h3>Today's Schedule</h3>
      <div className="cards">
        <RoomSummaryCard
          roomName="F601"
          roomStatus={F601Status}
          roomNextEvent={F601NextEvent}
        />
        <RoomSummaryCard
          roomName="F602"
          roomStatus={F602Status}
          roomNextEvent={F602NextEvent}
        />
        <RoomSummaryCard
          roomName="F612"
          roomStatus={F612Status}
          roomNextEvent={F612NextEvent}
        />
      </div>
      <TimeBlock nowDateTime={nowDateTime} updatedDateTime={updatedDateTime} />
    </>
  );
};
