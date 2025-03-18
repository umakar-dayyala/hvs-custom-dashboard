import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import FloorTabs from "../components/FloorTabs";
import SensorStatusCards from '../components/SensorStatusCards';
import FilterBar from "../components/FintersInFloorWise";
import DataTable from "../components/FloorWiseDataTable";
import FloorSummary from "../components/FloorSummary";
import { floorList, getFloorSummary, GetSensorSummary } from "../service/summaryServices";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";


// Example sensor data
const FloorWiseDashboard = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [floorData, setFloorData] = useState([]);
    const [sensorSummary, setSensorSummary] = useState([]);
    const [floorSummaryData, setFloorSummaryData] = useState([]);

    const queryParams = new URLSearchParams(window.location.search);
    const floor = queryParams.get("floor") || "ALL";



    useEffect(() => {
        const fetchData = async () => {
            await getFloorSummary(`param_floor=${floor}&param_zone=ALL&param_location=ALL&param_sensor_type=ALL&param_sensor_name=ALL&param_sensor_status=ALL`)
                .then((response) => {
                    setFloorSummaryData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching floor data:", error);
                });
        };

        fetchData(); // Initial fetch

    }, []);


    useEffect(() => {
        const fetchData = async () => {
            await GetSensorSummary(`param_floor=${floor}`)
                .then((response) => {
                    const jsonData = response;
                    const summedData = jsonData.data.reduce((acc, curr) => {
                        for (const key in curr) {
                            if (key !== "floor") {
                                acc[key] = (acc[key] || 0) + curr[key];
                            }
                        }
                        return acc;
                    }, {});

                    setSensorSummary(summedData);
                })
                .catch((error) => {
                    console.error("Error fetching floor data:", error);
                });
        };

        fetchData(); // Initial fetch

    }, []);

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

    console.log('sensorSummary', sensorSummary);

    const [filters, setFilters] = useState({
        viewBy: "Location",
        sensorType: [],
        sensor: [],
        sensorStatus: []
    });


    const handleFilterChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
    };

    return (
        <Box>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Breadcrumbs />
                <div style={{ display: "flex", gap: "10px" }}>
                    <SensorLegend />
                    {/* <ToggleButtons /> */}
                </div>
            </div>
            <Divider style={{ border: "1px solid #E8E8E8", margin: "8px 0" }} />
            <div>
                <SensorStatusCards />
            </div>
            <Divider style={{ border: "1px solid #70707059", margin: "8px 0", marginTop: "2rem" }} />

            <Box width="100%">
                {/* Pass floorSummaryData to FloorSummary */}
                <FloorSummary data={sensorSummary} />

                <Box width="100%">
                    <FloorTabs floorData={floorData} />
                </Box>

                {/* Filters */}
                <FilterBar filters={filters} onFilterChange={handleFilterChange} />

                {/* Data Table */}
                <DataTable data={floorSummaryData} />
            </Box>
        </Box>
    );
};

export default FloorWiseDashboard;
