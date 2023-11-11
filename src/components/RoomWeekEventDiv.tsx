import React, { JSXElementConstructor, ReactNode } from "react";
import { Event } from "./EventClass";
import "./style/RoomWeekEventDiv.css";

type RoomWeekEventDivProp = {
  roomWeekEvents: Event[];
};

export const RoomWeekEventDiv = ({ roomWeekEvents }: RoomWeekEventDivProp) => {
  const dateTimeToString = (d: Date) => {
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours().toString().padStart(2, "0");
    let minute = d.getMinutes().toString().padStart(2, "0");
    return `${month}/${day} ${hour}:${minute}`;
  };

  let items = [];
  for (let eNum = 0; eNum < roomWeekEvents.length; eNum++) {
    let addEvent = roomWeekEvents[eNum];
    let title = addEvent.title;
    let description = addEvent.description;
    let startTime = addEvent.startTime;
    let endTime = addEvent.endTime;
    let eventStatus = addEvent.eventStatus;

    let item: ReactNode;
    if (eventStatus === "使用中") {
      item = (
        <div className="eventElement event-status-using">
          <div className="eventTime">
            <p>{dateTimeToString(startTime)}</p>
            <p>{dateTimeToString(endTime)}</p>
          </div>
          <div className="eventDescription">
            <p>{title}</p>
            <p>{description}</p>
          </div>
        </div>
      );
    } else if (eventStatus === "使用不可") {
      item = (
        <div className="eventElement event-status-unavailable">
          <div className="eventTime">
            <p>{dateTimeToString(startTime)}</p>
            <p>{dateTimeToString(endTime)}</p>
          </div>
          <div className="eventDescription">
            <p>{title}</p>
            <p>{description}</p>
          </div>
        </div>
      );
    }

    items.push(item);
  }

  if (items.length == 0) {
    items.push(<p className="event-end-mark">予約はありません</p>);
  } else {
    items.push(<p className="event-end-mark">以上です</p>);
  }

  return (
    <>
      <div className="roomWeekSchedule">
        <h4>1週間の予約</h4>
        {items}
      </div>
    </>
  );
};
