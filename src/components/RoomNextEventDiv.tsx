import React from "react";
import { Event } from "./EventClass";

type RoomNextEventDivProp = {
  roomNextEvent: Event | null;
};

export const RoomNextEventDiv = ({ roomNextEvent }: RoomNextEventDivProp) => {
  if (roomNextEvent === null) {
    return (
      <div className="room-schedule">
        <p className="room-schedule-ptitle">次の予約</p>
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
            {roomNextEvent.ToDisplayTime()}
            <span>{roomNextEvent.title}</span>
          </p>
        </div>
      </div>
    );
  }
};
