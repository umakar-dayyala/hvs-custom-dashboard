import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";

const FloorTabs = ({ floorData, onTabChange  }) => {
  const { value } = useContext(MyContext);
  const navigate = useNavigate();

  const goToFloor = (floor) => {
    window.location.href = `floorwise?floor=${floor}`;
  };

  const goToAllAlarms = () => {
    navigate("/allalerts");
  }

  return (
    <Box width="100%" display="flex" justifyContent="space-between" flexWrap="nowrap">
      {floorData.map((floor, index) => (
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
              color: "#FFFFFF",
            },
          }}
          onClick={() => onTabChange(floor.floor)}
        >
          {floor.floor === "First Floor" ? floor.floor : floor.floor.replace(" Floor", "")}
        </Button>
      ))}

      {/* View All Alarms Button */}
      <Button
        variant="outlined"
        sx={{
          flex: 1,
          color: value[1] || "green",
          borderColor: value[1] || "green",
          textTransform: "none",
          margin: "2px",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: value[1] || "green",
            color: "#FFFFFF",
          },
        }}
        onClick={() => goToAllAlarms()}
      >
        View All Alarms
      </Button>
    </Box>
  );
};

export default FloorTabs;
