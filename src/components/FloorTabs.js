import React from "react";
import { Box, Button } from "@mui/material";

const FloorTabs = ({ floorData }) => {
  // Check for any alerts across all floors to set the border color for "View All Alarms"
  const hasGlobalAlert = floorData.some(
    (floor) =>
      (floor.noOfIncidents && floor.noOfIncidents > 0) ||
      (floor.detectedAlarms && floor.detectedAlarms > 0) ||
      (floor.typeOfAlarms && floor.typeOfAlarms > 0)
  );

  const globalBorderColor = hasGlobalAlert ? "#E30613" : "#28A745";

  return (
    <Box width="100%" display="flex" justifyContent="space-between" flexWrap="nowrap">
      {floorData.map((floor, index) => {
        const hasAlert =
          (floor.noOfIncidents && floor.noOfIncidents > 0) ||
          (floor.detectedAlarms && floor.detectedAlarms > 0) ||
          (floor.typeOfAlarms && floor.typeOfAlarms > 0);

        const borderColor = hasAlert ? "#E30613" : "#28A745";

        return (
          <Button
            key={index}
            variant="outlined"
            sx={{
              flex: 1,
              color: borderColor,
              borderColor: borderColor,
              textTransform: "none",
              margin: "2px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: borderColor,
                color: "#FFFFFF",
              },
            }}
          >
            {floor.name === "First Floor" ? floor.name : floor.name.replace(" Floor", "")}
          </Button>
        );
      })}

      {/* View All Alarms Button with Global Alert Color */}
      <Button
        variant="outlined"
        sx={{
          flex: 1,
          color: globalBorderColor,
          borderColor: globalBorderColor,
          textTransform: "none",
          margin: "2px",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: globalBorderColor,
            color: "#FFFFFF",
          },
        }}
      >
        View All Alarms
      </Button>
    </Box>
  );
};

export default FloorTabs;


