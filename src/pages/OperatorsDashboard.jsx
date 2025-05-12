import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import { useNavigate } from "react-router-dom";
import FloorTabs from "../components/FloorTabs";
// import FloorCards from "../components/FloorCards";
import FloorCards from "../components/FloorCardsNew";
import SensorStatusCards from "../components/SensorStatusCards";
import { floorList,summaryData } from "../service/summaryServices";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";
import HorizontalDivider from "../components/HorizontalDivider";
import { css } from "@emotion/react";
import Loader from "../components/Loader"; // importing the loader from the component 
import ScrollingText from "../components/ScrollingText";
import { isEqual } from "lodash";
import SummaryCards from "../components/SummaryCards"; 

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
  const [sensorSummaryData, setSensorSummaryData] = useState([]); 
  const [loading, setLoading] = useState(true);  // adding the load state 
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let timeout;
    let isFirstLoad = true;
  
    const fetchData = async () => {
      if (isFirstLoad) {
        setLoading(true);
      }
  
      try {
        const response = await floorList();
        const isChanged = !isEqual(response, floorData);  
        if (isChanged) {
          setFloorData(response);
        }
        const data = await summaryData();
        const isDataChanged = !isEqual(data, sensorSummaryData);  
        if (isDataChanged) {
          setSensorSummaryData(data);
        }
        
      } catch (error) {
        console.error("Error fetching floor data:", error);
      } finally {
        if (isMounted) {
          if (isFirstLoad) {
            setLoading(false);
            isFirstLoad = false;
          }
  
          // Wait 500ms AFTER the response finishes before next call
          timeout = setTimeout(fetchData, 500);
        }
      }
    };
  
    fetchData(); // Initial fetch
  
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);
  
   

    // Function to handle tab click
  const handleTabClick = (floorName) => {
     navigate(`floorwise?floor=${floorName}`);
  };


    // console.log(floorData);
    return (
      <>
      {loading && <Loader />}  
        <Box css={scrollContainer}>
            {/* Sticky Header Section */}
            <Box position="sticky" top={0} zIndex={1000} bgcolor={"#f0f1f6"}>
                {/* Breadcrumbs and Toggle Section */}
                {/* <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
                <Breadcrumbs />
                <Box display="flex">
                    <SensorLegend />
                </Box>
                </Box> */}

                {/* <HorizontalDivider /> */}

                {/* Sensor Status Cards */}
                <Box p={1}>
                {/* <SensorStatusCards /> */}
                <SummaryCards /> 
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
