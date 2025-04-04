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
  
  const fetchFloorList = async () => {
    try {
      const response = await floorList();
      setFloorData(response);
    } catch (error) {
      console.error("Error fetching floor list:", error);
    }
  };

  const fetchFloorAlertList = async (initialFloor) => {
    try {
      const response = await getFloorAlartList(); // API call
      const floorData = response.data;
  
      // Match the floor by trimming off the prefix
      const filtered = floorData.find((item) => {
        const cleanFloor = item.floorName.split("|").pop().trim(); // Gets "First Floor"
        return cleanFloor === floor;
      });
  
      console.log("Filtered Floor Alerts:", filtered);
      setFloorWiseAlertsData(filtered ? [filtered] : []);
    } catch (error) {
      console.error("Error fetching floor alerts:", error);
    }
  };
  

  const handleTabClick = (floorName) => {
    setFloor(floorName);
    // Navigate to the "floorwise" route with the floor parameter
    navigate(`/floorwise?floor=${encodeURIComponent(floorName)}`, { replace: true });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      await fetchFloorList();
      await fetchFloorAlertList();
      setLoading(false); // Stop loading after both API calls are done
    };

    fetchData();
  }, [floor]);

  return (
    <Box>
      {loading ? (
        <Loader /> // Display loader while fetching data
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Breadcrumbs />
            <div style={{ display: "flex", gap: "10px" }}>
              <SensorLegend />
            </div>
          </div>
          {/* Sensor Status Cards */}
          <SensorStatusCards />
          <Divider style={{ border: "1px solid #70707059", margin: "8px 0", marginTop: "2rem" }} />

          {/* Floor Tabs */}
          <Box width="100%">
            <FloorTabs floorData={floorData} onTabChange={handleTabClick} />
          </Box>

          <AllAlertsFloorWiseTable floorWiseAlertsData={floorWiseAlertsData} />
        </>
      )}
    </Box>
  );
};

export default FloorWiseAlarms;
