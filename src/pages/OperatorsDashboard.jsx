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
import Loader from "../components/Loader"; // importing the loader from the component 
import ScrollingText from "../components/ScrollingText";

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
  const [loading, setLoading] = useState(true);  // adding the load state 

  useEffect(() => {
    const fetchData = () => {
      setLoading(true); // shows the loader before fetching the data
      floorList()
        .then((response) => {
          setFloorData(response);
          setLoading(false); // hidding the loader after the data fetch
        })
        .catch((error) => {
          console.error("Error fetching floor data:", error);
          setLoading(false); //Hidding the loader even there is error 
        });
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 500000000000); // Fetch every 500ms, need to change later

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

    // Function to handle tab click
  const handleTabClick = (floorName) => {
    window.location.href = `floorwise?floor=${floorName}`;
  };


    // console.log(floorData);
    return (
      <>
      {loading && <Loader />}  
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
            <HvTypography variant="title3" >
                <ScrollingText/>
            </HvTypography>
            <HorizontalDivider />
            </Box>

            <Box display="flex" mt={2} flexDirection="column" alignItems="center">
                {/* Pass floorData to FloorTabs */}
                <Box width="100%">
                    <FloorTabs floorData={floorData} onTabChange={handleTabClick} />
                </Box>

        {/* Pass floorData to FloorCards */}
        <Box width="100%" mt={2}>
          <FloorCards floorData={floorData} />
        </Box>

        {/* Add Bottom Gap */}
        <Box mt={1} />
      </Box>
    </Box>
    </>
  );
};

export default OperatorDashboard;
