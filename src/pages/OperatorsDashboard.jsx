import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import FloorTabs from "../components/FloorTabs";
import FloorCards from "../components/FloorCards";
import SensorStatusCards from "../components/SensorStatusCards";
import { floorList } from "../service/summaryServices";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";
import HorizontalDivider from "../components/HorizontalDivider";
import { css } from "@emotion/react";

const scrollContainer = css`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    overflow: auto;
  }

  /* Hide scrollbar in Firefox */
  scrollbar-width: none;
  /* Hide scrollbar in IE and Edge */
  -ms-overflow-style: none;

  /* Hide scrollbar in WebKit browsers */
  &::-webkit-scrollbar {
    width: 0px;
  }

  /* Show scrollbar on hover */
  &:hover::-webkit-scrollbar {
    width: 8px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #d3d3d3;
    border-radius: 4px;
  }
`;

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
    <Box css={scrollContainer}>
      {/* Sticky Header Section */}
      <Box position="sticky" top={0} zIndex={1000} bgcolor={"#f0f1f6"}>
        {/* Breadcrumbs and Toggle Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
          <Breadcrumbs />
          <Box display="flex">
            <SensorLegend />
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
      <Box flexGrow={1} display="flex" flexDirection="column">
        {/* Pass floorData to FloorTabs */}
        <Box width="100%">
          <FloorTabs floorData={floorData} />
        </Box>

        {/* Pass floorData to FloorCards */}
        <Box width="100%" mt={2}>
          <FloorCards floorData={floorData} />
        </Box>

        {/* Add Bottom Gap */}
        <Box mt={1} />
      </Box>
    </Box>
  );
};

export default OperatorDashboard;
