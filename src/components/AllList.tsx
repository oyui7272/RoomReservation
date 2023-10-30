import React, { ReactNode } from "react";

type AllListProps = {
  updateRoomCard: (roomName: string) => ReactNode;
};

export const AllList = ({ updateRoomCard }: AllListProps) => {
  const F601Card = updateRoomCard("F601");
  const F602Card = updateRoomCard("F602");
  const F612Card = updateRoomCard("F612");

  return (
    <>
      <h3>Today's Schedule</h3>
      <div className="cards">
        <div className="room-card">
          {F601Card}
          <div className="room-schedule">
            <p className="room-schedule-ptitle">next</p>
            <div className="room-schedule-event">
              <p className="no-used-today">
                本日使用なし
                <span>Not scheduled</span>
                <span>to be used today</span>
              </p>
            </div>
          </div>
        </div>
        <div className="room-card">
          {F602Card}
          <div className="room-schedule">
            <p className="room-schedule-ptitle">next</p>
            <div className="room-schedule-event">
              <p>
                9:00 ~ 10:30<span>サーバ復旧作業</span>
              </p>
            </div>
          </div>
        </div>
        <div className="room-card">
          {F612Card}
          <div className="room-schedule">
            <p className="room-schedule-ptitle">next</p>
            <div className="room-schedule-event">
              <p>
                9:00 ~ 10:00<span>PDA打ち合わせ</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
