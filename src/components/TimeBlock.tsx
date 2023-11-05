import React from "react";

type TimeBlockProps = {
  nowDateTime: string;
  updatedDateTime: string;
};

export const TimeBlock = ({ nowDateTime, updatedDateTime }: TimeBlockProps) => {
  return (
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
  );
};
