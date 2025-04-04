import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import FloorTabs from "../components/FloorTabs";
import SensorStatusCards from "../components/SensorStatusCards";
import AllAlertsFloorWiseTable from "../components/AllAlertsFloorWiseTable";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";
import { floorList, getFloorAlartList } from "../service/summaryServices";
import Loader from "../components/Loader";

const FloorWiseAlarms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const initialFloor = queryParams.get("floor") || "ALL";

  // State
  const [floor, setFloor] = useState(initialFloor);
  const [floorData, setFloorData] = useState([]);
  const [floorWiseAlertsData, setFloorWiseAlertsData] = useState([]);

  // Fetch list of floors
  const fetchFloorList = async () => {
    try {
      const response = await floorList();
      setFloorData(response);
    } catch (error) {
      console.error("Error fetching floor list:", error);
    }
  };

  // Fetch alerts based on selected floor
  const fetchFloorAlertList = async (selectedFloor) => {
    try {
      const response = await getFloorAlartList(); // API call
      const floorData = response.data;

      const filtered = floorData.find((item) => {
        const cleanFloor = item.floorName.split("|").pop().trim(); 
        return cleanFloor === selectedFloor;
      });
        // Check if filtered data is empty or undefined
      setFloorWiseAlertsData(filtered ? [filtered] : []);
    } catch (error) {
      console.error("Error fetching floor alerts:", error);
    }
  };

  // Handle floor tab click
  const handleTabClick = (floorName) => {
    setFloor(floorName);
    // Navigate to the "floorwise" route with the floor parameter
    navigate(`/floorwise?floor=${encodeURIComponent(floorName)}`, { replace: true });
  };

  useEffect(() => {
    setFloor(initialFloor);
  }, [initialFloor]);

  // Initial + floor change effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      await fetchFloorList();
      await fetchFloorAlertList(floor); // pass current floor to fetch data
      setLoading(false);
    };

    fetchData();
  }, [floor]);

  return (
    <Box>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Top Header with Breadcrumbs & Legend */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Breadcrumbs />
            <div style={{ display: "flex", gap: "10px" }}>
              <SensorLegend />
            </div>
          </div>

          {/* Sensor Status Cards */}
          <SensorStatusCards />

          {/* Divider */}
          <Divider style={{ border: "1px solid #70707059", margin: "8px 0", marginTop: "2rem" }} />

          {/* Floor Tabs */}
          <Box width="100%">
            <FloorTabs floorData={floorData} onTabChange={handleTabClick} />
          </Box>

          {/* Alerts Table */}
          <AllAlertsFloorWiseTable floorWiseAlertsData={floorWiseAlertsData} />
        </>
      )}
    </Box>
  );
};

export default FloorWiseAlarms;
