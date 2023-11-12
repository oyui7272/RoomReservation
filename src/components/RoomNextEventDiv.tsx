import React from "react";
import { Event } from "./EventClass";

type RoomNextEventDivProp = {
  roomNextEvent: Event | null;
  roomNameDisplay: boolean;
  isUsingNow: boolean;
};

export const RoomNextEventDiv = ({
  roomNextEvent,
  roomNameDisplay,
  isUsingNow,
}: RoomNextEventDivProp) => {
  if (roomNextEvent === null) {
    return (
      <div className="room-schedule">
        <p className="room-schedule-ptitle">次の予約</p>
        <div className="room-schedule-detail">
          <div>
            <p className="event-time">本日の予約なし</p>
            <p className="no-schedule">Not scheduled to be used today</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="room-schedule">
        {isUsingNow && <p className="room-schedule-ptitle">予約内容</p>}
        {!isUsingNow && <p className="room-schedule-ptitle">次の予約</p>}
        <div className="room-schedule-detail">
          <div>
            <p className="event-time">{roomNextEvent.ToDisplayTime()}</p>
            <p className="event-title">{roomNextEvent.title}</p>

            {roomNextEvent.creator && (
              <div className="event-creator">
                <i className="fa-solid fa-user"></i>
                <p>{roomNextEvent.creator}</p>
              </div>
            )}
            {!roomNameDisplay && roomNextEvent.creator && (
              <div className="event-creator">
                <i className="fa-solid fa-align-left"></i>
                <p>{roomNextEvent.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
