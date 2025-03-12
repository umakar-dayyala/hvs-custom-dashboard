import React from "react";
import { Box, Typography,Divider } from "@mui/material";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import FloorTabs from "../components/FloorTabs";
import FloorCards from "../components/FloorCards";
import SensorStatusCards from '../components/SensorStatusCards';

const floorData = [
    { "name": "Lower Ground Floor", "totalZones": 6, "totalSensors": 24, "noOfIncidents": "NA", "detectedAlarms": "NA", "typeOfAlarms": "NA" },
    { "name": "Under Ground Floor", "totalZones": 6, "totalSensors": 24, "noOfIncidents": 2, "detectedAlarms": "NA", "typeOfAlarms": "NA" },
    { "name": "First Floor", "totalZones": 6, "totalSensors": 24, "noOfIncidents": 3, "detectedAlarms": "NA", "typeOfAlarms": "NA" },
    { "name": "Terrace", "totalZones": 6, "totalSensors": 24, "noOfIncidents": 4, "detectedAlarms": "NA", "typeOfAlarms": "NA" },
    { "name": "North Utility", "totalZones": 6, "totalSensors": 24, "noOfIncidents": 5, "detectedAlarms": "NA", "typeOfAlarms": "NA" },
    { "name": "South Utility", "totalZones": 6, "totalSensors": 24, "noOfIncidents": "06", "detectedAlarms": "NA", "typeOfAlarms": "NA" },
    { "name": "Iron Gate", "totalZones": 6, "totalSensors": 24, "noOfIncidents": "07", "detectedAlarms": "NA", "typeOfAlarms": "NA" },
    { "name": "QRT 01", "totalZones": 6, "totalSensors": 24, "noOfIncidents": "NA", "detectedAlarms": "NA", "typeOfAlarms": "NA", "status": "Active" },
    { "name": "QRT 02", "totalZones": 6, "totalSensors": 24, "noOfIncidents": "NA", "detectedAlarms": "NA", "typeOfAlarms": "NA", "status": "Active" },
    { "name": "LAB", "totalZones": 6, "totalSensors": 24, "noOfIncidents": "NA", "detectedAlarms": "NA", "typeOfAlarms": "NA", "status": "Active" }
];

const OperatorDashboard = () => {
    return (
        <Box>
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
