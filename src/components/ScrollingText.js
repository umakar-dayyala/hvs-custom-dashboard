import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getSensorData } from "../service/summaryServices";
import "../css/ScrollingText.css"; // import the styles

const ScrollingText = () => {
  const [hasAlarm, setHasAlarm] = useState(false);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      const data = await getSensorData();
      const alarmExists = data.some(
        (card) => card.title === "CBRN Alarms" && Number(card.value) > 0
      );
      setHasAlarm(alarmExists);
    };

    fetchData();
    interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const fullText = hasAlarm ? "Alarm Detected" : "No Alarm Detected";

  return (
    <div className={`container ${hasAlarm ? "alarm" : "no-alarm"}`}>
      <div className="scroll-wrapper">
        <Typography variant="h6" className="scrolling-text">
          {fullText}
        </Typography>
      </div>
    </div>
  );
};

export default ScrollingText;
