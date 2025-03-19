import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import FloorTabs from "../components/FloorTabs";
import FloorCards from "../components/FloorCards";
import SensorStatusCards from "../components/SensorStatusCards";
import { floorList } from "../service/summaryServices";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";
import ToggleButtons from "../components/ToggleButtons";
import HorizontalDivider from "../components/HorizontalDivider";

const OperatorDashboard = () => {
  const [floorData, setFloorData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      floorList()
        .then((response) => {
          setFloorData(response);
        })
        .catch((error) => {
          console.error("Error fetching floor data:", error);
        });
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 500000000000); // Fetch every 500ms, need to change later

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box height="100vh" display="flex" flexDirection="column" overflow="hidden">
      {/* Sticky Header Section */}
      <Box position="sticky" top={0} zIndex={1000}>
        {/* Breadcrumbs and Toggle Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
          <Breadcrumbs />
          <Box display="flex">
            <SensorLegend />
            {/* <ToggleButtons /> */}
          </Box>
        </Box>

        <HorizontalDivider />

        {/* Sensor Status Cards */}
        <Box p={1}>
          <SensorStatusCards />
        </Box>

        <HorizontalDivider />

        {/* Page Title */}
        <HvTypography variant="title3" style={{ padding: "0 16px", marginBottom: "1rem" }}>
          Operators Dashboard - Main Page
        </HvTypography>
      </Box>

      {/* Scrollable Content Section */}
      <Box flex={1} overflow="auto">
        {/* Pass floorData to FloorTabs */}
        <Box width="100%">
          <FloorTabs floorData={floorData} />
        </Box>

        {/* Pass floorData to FloorCards */}
        <Box width="100%" mt={2}>
          <FloorCards floorData={floorData} />
        </Box>
      </Box>
    </Box>
  );
};

export default OperatorDashboard;
