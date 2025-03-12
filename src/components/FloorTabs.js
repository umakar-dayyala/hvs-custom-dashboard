import React from "react";
import { Box, Button } from "@mui/material";

const FloorTabs = ({ floorData }) => {
  return (
    <Box width="100%" display="flex" justifyContent="space-between" flexWrap="nowrap">
      {floorData.map((floor, index) => (
        <Button key={index} variant="contained" color="success" sx={{ flex: 1, margin: '0 4px' }}>
          {floor.name === "First Floor" ? floor.name : floor.name.replace(" Floor", "")}
        </Button>
      ))}
      <Button variant="contained" color="success" sx={{ flex: 1, margin: '0 4px' }}>
        View All Alarms
      </Button>
    </Box>
  );
};

export default FloorTabs;
