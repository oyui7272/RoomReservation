import { TimeBlock } from "./TimeBlock";
import { RoomSummaryCard } from "./RoomSummaryCard";
import { Event } from "./EventClass";
import "./style/RoomDashboard.css";

type RoomDashboardProps = {
  roomName: string;
  nowDateTime: string;
  updatedDateTime: string;
  roomStatus: string;
  roomTodayNextEvent: Event | null;
  reloadNextEvent: () => Promise<void>;
};

export const RoomDashboard = ({
  roomName,
  nowDateTime,
  updatedDateTime,
  roomStatus,
  roomTodayNextEvent,
  reloadNextEvent,
}: RoomDashboardProps) => {
  return (
    <>
      <h3>{roomName}Dashboard</h3>
      <div className="room-dashboard">
        <div>
          <RoomSummaryCard
            roomName={roomName}
            roomStatus={roomStatus}
            roomNextEvent={roomTodayNextEvent}
            roomNameDisplay={false}
          />
          <TimeBlock
            nowDateTime={nowDateTime}
            updatedDateTime={updatedDateTime}
            reloadNextEvent={reloadNextEvent}
          />
        </div>
        <div className="roomWeekSchedule">
          <h4>1週間の予約</h4>
        </div>
      </div>
    </>
  );
};
