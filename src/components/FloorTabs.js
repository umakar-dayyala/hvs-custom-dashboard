import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";

const FloorTabs = ({ floorData, onTabChange }) => {
  const { value } = useContext(MyContext);
  const navigate = useNavigate();
  //Using for changing the color of all alerts tabs
  const hasAnyAlarm = value.includes("#E30613");

  const goToFloor = (floor) => {
    window.location.href = `floorwise?floor=${floor}`;
  };

  const goToAllAlarms = () => {
    navigate("/allalerts");
  }

  return (
    <Box width="100%" display="flex" justifyContent="flex-end" alignItems="center">
      {/* {floorData.map((floor, index) => (
        <Button
          key={index}
          variant="outlined"
          sx={{
            flex: 1,
            color: value[index] || "green", // Avoid out-of-bounds errors
            borderColor: value[index] || "green",
            textTransform: "none",
            margin: "2px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: value[index] || "green",
              borderColor: value[index] || "green",
              color: "#FFFFFF",
            },
          }}
          onClick={() => {
            const hasAlarm =
              (floor.biological_alarms || 0) > 0 ||
              (floor.chemical_alarms || 0) > 0 ||
              (floor.radiological_alarms || 0) > 0;

            if (hasAlarm) {
              navigate(`/floorwiseAlarms?floor=${encodeURIComponent(floor.floor)}`);
            } else {
              onTabChange(floor.floor);
            }
          }}

        >
          {floor.floor === "First Floor" ? floor.floor : floor.floor.replace(" Floor", "")}
        </Button>
      ))} */}

      {/* View All Alarms Button */}
      <Button
        variant="outlined"
        sx={{
          color: hasAnyAlarm ? "#E30613" : "#28A745",
          borderColor: hasAnyAlarm ? "#E30613" : "#28A745",
          textTransform: "none",
          margin: "4px",
          fontWeight: "bold",
          minWidth: "150px", // Optional: Ensures consistent button width
          "&:hover": {
            backgroundColor: hasAnyAlarm ? "#E30613" : "#28A745",
            borderColor: hasAnyAlarm ? "#E30613" : "#28A745",
            color: "#FFFFFF",
          },
        }}
        onClick={goToAllAlarms}
      >
        All Alarms & Alerts
      </Button>
    </Box>
  );
};

export default FloorTabs;
