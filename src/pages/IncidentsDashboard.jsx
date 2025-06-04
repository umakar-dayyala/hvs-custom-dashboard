import React, { useEffect, useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isEqual } from "lodash";

import { floorList, summaryData, getFloorSummary } from "../service/summaryServices";
import HorizontalDivider from "../components/HorizontalDivider";
import Loader from "../components/Loader";
import SummaryCards from "../components/SummaryCards";
import IncidentMapView from "../components/IncidentMapView";
import IncidentSatelliteView from "../components/IncidentSatelliteView";
import IncidentAlertPanal from "../components/IncidentAlertPanal";
import Breadcrumbs from "../components/Breadcrumbs";

const IncidentDashboard = () => {
  const [floorData, setFloorData] = useState([]);
  const [sensorSummaryData, setSensorSummaryData] = useState([]);
  const [incidentData, setIncidentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("satellite");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let timeout;
    let isFirstLoad = true;

    const defaultParams = {
      param_floor: "ALL",
      param_zone: "ALL",
      param_location: "ALL",
      param_sensor_type: "ALL",
      param_sensor_name: "ALL",
      param_sensor_status: "ALL",
    };

    const fetchData = async () => {
      if (isFirstLoad) setLoading(true);

      try {
        // Fetch floor list
        const floorResponse = await floorList();
        const isFloorChanged = !isEqual(floorResponse, floorData);
        if (isFloorChanged) setFloorData(floorResponse);

        // Fetch summary data
        const summaryResponse = await summaryData();
        const isSummaryChanged = !isEqual(summaryResponse, sensorSummaryData);
        if (isSummaryChanged) setSensorSummaryData(summaryResponse);

        // Fetch incident data with default parameters
        const incidentResponse = await getFloorSummary(defaultParams);
        const isIncidentChanged = !isEqual(incidentResponse, incidentData);

        if (isIncidentChanged) setIncidentData(incidentResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          if (isFirstLoad) {
            setLoading(false);
            isFirstLoad = false;
          }
          timeout = setTimeout(fetchData, 5000); // 5-second polling
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const incidentDatatest = [
    { "s_no": { "s_no": 1, "device_id": 1168, "alarm_status": "No Alarm", "zone": "1", "location": "At Makar Dwar (Left side)", "detector_type": "Radiation", "detector": "PRM", "status": "Active", "last_updated": "2025-05-14 15:55:48.393", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 2, "device_id": 49, "alarm_status": "Alarm", "zone": "1", "location": "At Makar Dwar (Right side)", "detector_type": "Radiation", "detector": "AGM", "status": "Active", "last_updated": "2025-05-14 15:55:48.400", "alarm_start_timestamp": "2025-05-14T15:55:48.400Z" } },
    { "s_no": { "s_no": 3, "device_id": 1159, "alarm_status": "Alarm", "zone": "2", "location": "Near Control Room", "detector_type": "Chemical", "detector": "FCAD", "status": "Active", "last_updated": "2025-05-14 15:55:48.410", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 4, "device_id": 15, "alarm_status": "Alarm", "zone": "2", "location": "Behind Main Gate", "detector_type": "Radiation", "detector": "PRM", "status": "Active", "last_updated": "2025-05-14 15:55:48.420", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 1, "device_id": 1168, "alarm_status": "No Alarm", "zone": "1", "location": "At Makar Dwar (Left side)", "detector_type": "Radiation", "detector": "PRM", "status": "Active", "last_updated": "2025-05-14 15:55:48.393", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 2, "device_id": 49, "alarm_status": "Alarm", "zone": "1", "location": "At Makar Dwar (Right side)", "detector_type": "Radiation", "detector": "AGM", "status": "Active", "last_updated": "2025-05-14 15:55:48.400", "alarm_start_timestamp": "2025-05-14T15:55:48.400Z" } },
    { "s_no": { "s_no": 3, "device_id": 1159, "alarm_status": "Alarm", "zone": "2", "location": "Near Control Room", "detector_type": "Chemical", "detector": "FCAD", "status": "Active", "last_updated": "2025-05-14 15:55:48.410", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 4, "device_id": 15, "alarm_status": "Alarm", "zone": "2", "location": "Behind Main Gate", "detector_type": "Radiation", "detector": "PRM", "status": "Active", "last_updated": "2025-05-14 15:55:48.420", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 1, "device_id": 1168, "alarm_status": "No Alarm", "zone": "1", "location": "At Makar Dwar (Left side)", "detector_type": "Radiation", "detector": "PRM", "status": "Active", "last_updated": "2025-05-14 15:55:48.393", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 2, "device_id": 49, "alarm_status": "Alarm", "zone": "1", "location": "At Makar Dwar (Right side)", "detector_type": "Radiation", "detector": "AGM", "status": "Active", "last_updated": "2025-05-14 15:55:48.400", "alarm_start_timestamp": "2025-05-14T15:55:48.400Z" } },
    { "s_no": { "s_no": 3, "device_id": 1159, "alarm_status": "Alarm", "zone": "2", "location": "Near Control Room", "detector_type": "Chemical", "detector": "FCAD", "status": "Active", "last_updated": "2025-05-14 15:55:48.410", "alarm_start_timestamp": null } },
    { "s_no": { "s_no": 4, "device_id": 15, "alarm_status": "Alarm", "zone": "2", "location": "Behind Main Gate", "detector_type": "Radiation", "detector": "PRM", "status": "Active", "last_updated": "2025-05-14 15:55:48.420", "alarm_start_timestamp": null } },
  ]

  const handleTabClick = (floorName) => {
    navigate(`floorwise?floor=${floorName}`);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleSensorsStatusClick = () => {
    navigate("/sensorStatus");
  };

  return (
    <>
      {loading && <Loader />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs />
        <div style={{ display: "flex", gap: "10px" }}></div>
      </div>
      <Box>
        {/* Sticky Header Section */}
        <Box>
          <Box p={1}>
            <SummaryCards />
          </Box>
          <HorizontalDivider />
        </Box>
        <Box display="flex" justifyContent="flex-start" gap={2} mb={1} ml={4} mt={3}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="View Toggle"
          >
            <ToggleButton value="satellite" aria-label="Satellite View">
              Satellite View
            </ToggleButton>
            <ToggleButton value="map" aria-label="Map View">
              Map View
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            onClick={handleSensorsStatusClick}
              sx={{
                minWidth: 150,
                height: 54,
                alignSelf: "center",
                border: "1px solid #1976d2",
                color: "#1976d2",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  border: "2px solid #1976d2",
                  fontWeight: "bold",
                },
            }}
          >
            Sensors Status
          </Button>
        </Box>
        {/* Main Content: Map + Alert Panel */}
        <Box display="flex" px={2} py={2} gap={2} alignItems="flex-start" flex={1}>
          {/* Incident Map Section */}
          <Box flex={1} minWidth={0}>
            {view === "satellite" ? (
              <IncidentSatelliteView sensorData={incidentData} />
            ) : (
              <IncidentMapView sensorData={incidentData} />
            )}
          </Box>
          {/* Alert Panel Section */}
          <Box width="25%" minWidth="280px">
            <IncidentAlertPanal incidentData={incidentData} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default IncidentDashboard;