import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import FloorTabs from "../components/FloorTabs";
import FloorCards from "../components/FloorCards";
import SensorStatusCards from '../components/SensorStatusCards';
import { floorList } from "../service/summaryServices";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";
import ToggleButtons from "../components/ToggleButtons";




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
        const interval = setInterval(fetchData, 500000000000); // Fetch every 500ms need to change later

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Function to handle tab click
  const handleTabClick = (floorName) => {
    window.location.href = `floorwise?floor=${floorName}`;
  };


    // console.log(floorData);
    return (
        <Box>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Breadcrumbs />
                <div style={{ display: "flex", gap: "10px" }}>
                    <SensorLegend />
                    <ToggleButtons />
                </div>
            </div>
            <Divider style={{ border: "1px solid #E8E8E8", margin: "8px 0" }} />
            <div>
                <SensorStatusCards />
            </div>
            <Divider style={{ border: "1px solid #70707059", margin: "8px 0", marginTop: "2rem" }} />
            <HvTypography variant="title3" >
                Operators Dashboard - Main Page
            </HvTypography>

            <Box display="flex" mt={2} flexDirection="column" alignItems="center">
                {/* Pass floorData to FloorTabs */}
                <Box width="100%">
                    <FloorTabs floorData={floorData} onTabChange={handleTabClick} />
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