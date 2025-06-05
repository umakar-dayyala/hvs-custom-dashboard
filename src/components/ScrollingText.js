import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { getRedisAlarms } from "../service/IncidentService";

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
    const fetchAlarms = async () => {
      try {
        const response = await getRedisAlarms();
        const count = response?.devices?.devices?.count || 0;
        setHasAlarm(count > 0); // Set true if count > 0
      } catch (error) {
        console.error("Error fetching alarms:", error);
      }
    };

    fetchAlarms();
    const interval = setInterval(fetchAlarms, 3000);
    return () => clearInterval(interval);
  }, []);

  const fullText = hasAlarm ? "Alarm Detected" : "No Alarm Detected";

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: hasAlarm ? "#E30613" : "#008000",
        padding: "8px",
        position: "relative",
        height: "48px",
        border: hasAlarm ? "2px solid red" : "2px solid green",
        borderRadius: "5px",
        color: "white",
        textAlign: "center",
        animation: hasAlarm ? `${blinkAnimation} 1s infinite` : "none",
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
            animation: `${scrollText} 25s linear infinite`,
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
