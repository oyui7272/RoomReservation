import React, { ReactNode } from "react";

type AllListProps = {
  updateRoomCard: (roomName: string) => ReactNode;
  nowDateTime: string;
  updatedDateTime: string;
};

export const AllRoom = ({
  updateRoomCard,
  nowDateTime,
  updatedDateTime,
}: AllListProps) => {
  const F601Card = updateRoomCard("F601");
  const F602Card = updateRoomCard("F602");
  const F612Card = updateRoomCard("F612");

  return (
    <>
      <h3>Today's Schedule</h3>
      <div className="cards">
        {F601Card}
        {F602Card}
        {F612Card}
      </div>
      <div className="time-block">
        <p>
          <span>現在時刻</span>
          {nowDateTime}
        </p>
        <p>
          <span>更新時刻</span>
          {updatedDateTime}
        </p>
      </div>
    </>
  );
};
