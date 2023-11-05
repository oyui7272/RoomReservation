import React from "react";
import "./style/TimeBlock.css";

type TimeBlockProps = {
  nowDateTime: string;
  updatedDateTime: string;
  reloadNextEvent: () => Promise<void>;
};

export const TimeBlock = ({
  nowDateTime,
  updatedDateTime,
  reloadNextEvent,
}: TimeBlockProps) => {
  return (
    <div className="time-block">
      <p>
        <span>現在時刻</span>
        {nowDateTime}
      </p>
      <div className="updatetime-div">
        <p>
          <span>更新時刻</span>
          {updatedDateTime}
        </p>
        <button id="reload-button" onClick={reloadNextEvent}>
          今すぐ更新<i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
    </div>
  );
};
