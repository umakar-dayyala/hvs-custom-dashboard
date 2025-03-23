import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { getSensorData } from "../service/summaryServices";


const scrollText = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100vw);
  }
`;

const ScrollingText = () => {
  const [hasAlarm, setHasAlarm] = useState(false);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      const data = await getSensorData();
      const alarmExists = data.some(
        (card) =>
          (card.title === "Unhealthy Sensors" && card.value.split("/")[0] > 0) ||
          (!["Total Sensor", "Inactive Sensor", "Active Sensor"].includes(card.title) && Number(card.value) > 0)
      );
      setHasAlarm(alarmExists);
    };

    fetchData(); // Initial call
    interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fullText = hasAlarm ? "Alarm Detected" : "No Alarm Detected";

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: "transparent", // Made background transparent
        padding: "8px",
        position: "relative",
        border: hasAlarm ? "2px solid red" : "1px solid black", // Border changes dynamically
        borderRadius: "5px",
        color: hasAlarm ? "red" : "green",
        textAlign: "center",
        boxShadow: hasAlarm
          ? "rgba(255, 0, 0, 0.5) 0px 4px 12px"
          : "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        marginTop: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: `${scrollText} 10s linear infinite`, // Slowed down the animation
          }}
        >
          {fullText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ScrollingText;
