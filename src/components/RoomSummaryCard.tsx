import React from "react";
import { RoomNextEventDiv } from "./RoomNextEventDiv";
import { Event } from "./EventClass";
import "./style/RoomSummaryCard.css";

type RoomSummaryCardProp = {
  roomName: string;
  roomStatus: string;
  roomNextEvent: Event | null;
  roomNameDisplay: boolean;
};

// 部屋の使用状況のCard型のHTMLコードを返すコンポーネント
export const RoomSummaryCard = ({
  roomName,
  roomStatus,
  roomNextEvent,
  roomNameDisplay,
}: RoomSummaryCardProp) => {
  if (roomStatus === "使用不可") {
    return (
      <>
        <div className="room-card room-status-unavailable">
          {roomNameDisplay && <p className="room-name">{roomName}</p>}
          <div className="room-status">
            <p>
              使用不可<span>In Use Not available now</span>
            </p>
          </div>
          <RoomNextEventDiv
            roomNextEvent={roomNextEvent}
            roomNameDisplay={roomNameDisplay}
            isUsingNow={true}
          />
        </div>
      </>
    );
  } else if (roomStatus === "使用中") {
    return (
      <>
        <div className="room-card room-status-using">
          {roomNameDisplay && <p className="room-name">{roomName}</p>}
          <div className="room-status">
            <p>
              使用中<span>In Use but you can enter</span>
            </p>
          </div>
          <RoomNextEventDiv
            roomNextEvent={roomNextEvent}
            roomNameDisplay={roomNameDisplay}
            isUsingNow={true}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="room-card room-status-available">
          {roomNameDisplay && <p className="room-name">{roomName}</p>}
          <div className="room-status">
            <p>
              使用可能<span>available</span>
            </p>
          </div>
          <RoomNextEventDiv
            roomNextEvent={roomNextEvent}
            roomNameDisplay={roomNameDisplay}
            isUsingNow={false}
          />
        </div>
      </>
    );
  }
};
