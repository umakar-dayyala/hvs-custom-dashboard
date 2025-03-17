import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { MyContext } from "../context/MyContext";

const FloorTabs = ({ floorData }) => {
  const { value } = useContext(MyContext);

  return (
    <Box width="100%" display="flex" justifyContent="space-between" flexWrap="nowrap">
      {floorData.map((floor, index) => (
        <Button
          key={index}
          variant="outlined"
          sx={{
            flex: 1,
            color: value[index], // Ensure index does not go out of bounds
            borderColor: value[index],
            textTransform: "none",
            margin: "2px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: value[index],
              color: "#FFFFFF",
            },
          }}
        >
          {floor.floor === "First Floor" ? floor.floor : floor.floor.replace(" Floor", "")}
        </Button>
      ))}

      {/* View All Alarms Button */}
      <Button
        variant="outlined"
        sx={{
          flex: 1,
          color: value[1], // Use an appropriate value for this button
          borderColor: value[1],
          textTransform: "none",
          margin: "2px",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: value[1],
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
