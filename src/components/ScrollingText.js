import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { getSensorData } from "../service/summaryServices";

// Define the scrolling animation
const scrollText = keyframes`
  0% {
    transform: translateX(100vw);
  }
  100% {
    transform: translateX(-100%);
  }
`;

// Define the blinking animation for alarms and normal state
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  30% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const ScrollingText = () => {
  const [hasAlarm, setHasAlarm] = useState(false);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      const data = await getSensorData();
      const alarmExists = data.some(
        (card) =>
            card.title === "CBRN Alarms" && Number(card.value) > 0
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
        backgroundColor: hasAlarm ? "#E30613" : "#008000", // Red for alarm, Green for no alarm
        padding: "8px",
        position: "relative",
        border: hasAlarm ? "2px solid red" : "2px solid green", // Red border for alarm, Green for no alarm
        borderRadius: "5px",
        color: "white", // Text is always white
        textAlign: "center",
        animation: `${blinkAnimation} 1s infinite`, // Blinking applies to both states
        // marginTop: "10px",
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
            animation: `${scrollText} 10s linear infinite`,
            fontWeight: "bold",
          }}
        >
          {fullText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ScrollingText;
