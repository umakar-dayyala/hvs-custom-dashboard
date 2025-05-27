
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import FloorTabs from "../components/FloorTabs";
import SensorStatusCards from "../components/SensorStatusCards";
import FilterBar from "../components/FintersInFloorWise";
import DataTable from "../components/FloorWiseDataTable";
import FloorSummary from "../components/FloorSummary";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  floorList,
  getFloorSummary,
  GetSensorSummary,
  getFloorZoneSelector,
  getLocationSelector,
  getSensorTypeSelector,
  getSensorNameSelector,
  getSensorStatusSelector,
  getDeviceNotifications
} from "../service/summaryServices";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";
import FloorWiseChart from "../components/FloorWiseChart";
import SensorAlarmHeatmap from "../components/SensorAlarmHeatmap";
import SensorAlertTable from "../components/SensorAlertMapTable";
import Loader from "../components/Loader";  // Import the Loader component
import FloorWiseStatusGrid from "../components/FloorWiseStatusGrid";
import FloorWiseAlarmPanel from "../components/FloorWiseAlarmPanel";
import FloorPlanMap from "../components/FloorPlanMap";
import UGFFloorMap from "../components/UGFFloorMap";
import LGFFloorMap from "../components/LGFFloorMap";
import TerraceMap from "../components/TerraceMap";
import FirstFloorMap from "../components/FirstFloorMap";
import SouthUtilityMap from "../components/SouthUtility_map";
import NorthUtilityMap from "../components/NorthUtility_map";
import FloorWiseNotificationPanal from "../components/FloorWiseNotificationPanal";
import SummaryCards from "../components/SummaryCards";

const FloorWiseDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialFloor = queryParams.get("floor") || "ALL";
  const [view, setView] = useState("map"); // Default view is "map"

  // State
  const [floor, setFloor] = useState(initialFloor);
  const [floorData, setFloorData] = useState([]);
  const [sensorSummary, setSensorSummary] = useState([]);
  const [floorSummaryData, setFloorSummaryData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [sensorTypeData, setSensorTypeData] = useState([]);
  const [sensorNameData, setSensorNameData] = useState([]);
  const [sensorStatusData, setSensorStatusData] = useState([]);
  const [utilityView, setUtilityView] = useState("north"); // Default to "North"
  const [floorNotificationData, setFloorNotificationData] = useState([]);

  // New loading state
  const [loading, setLoading] = useState(true);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView); // Update the view state when a toggle button is clicked
    }
  };

  const defaultFilters = {
    zone: [],
    location: [],
    sensorType: [],
    sensor: [],
    sensorStatus: [],
  };
  const handleUtilityViewChange = (event, newView) => {
    if (newView !== null) {
      setUtilityView(newView);
    }
  };
  const [filters, setFilters] = useState(defaultFilters);

  const formatFilter = (filterArray) =>
    filterArray.length ? filterArray.join(",") : "ALL";

  const fetchFloorSummary = async (floorParam, appliedFilters) => {
    try {
      setLoading(true);  // Start loading
      const response = await getFloorSummary(
        `param_floor=${floorParam}&param_zone=${formatFilter(appliedFilters.zone)}&param_location=${formatFilter(appliedFilters.location)}&param_sensor_type=${formatFilter(appliedFilters.sensorType)}&param_sensor_name=${formatFilter(appliedFilters.sensor)}&param_sensor_status=${formatFilter(appliedFilters.sensorStatus)}`
      );
      setFloorSummaryData(response);
    } catch (error) {
      console.error("Error fetching floor summary:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const fetchSensorSummary = async (floorParam) => {
    try {
      setLoading(true);  // Start loading
      const response = await GetSensorSummary(`param_floor=${floorParam}`);
      setSensorSummary(response.data);
    } catch (error) {
      console.error("Error fetching sensor summary:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const fetchFloorList = async () => {
    try {
      setLoading(true);  // Start loading
      const response = await floorList();
      setFloorData(response);
    } catch (error) {
      console.error("Error fetching floor list:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const fetchZoneData = async (floorParam) => {
    try {
      setLoading(true);  // Start loading
      const response = await getFloorZoneSelector(`param_floor=${floorParam}`);
      setZoneData(response.data);
    } catch (error) {
      console.error("Error fetching zone data:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const fetchLocationData = async (zoneParam = "ALL", floorParam = "ALL") => {
    try {
      setLoading(true);  // Start loading
      const response = await getLocationSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}`
      );
      setLocationData(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const fetchSensorTypeData = async (floorParam, zoneParam, locationParam) => {
    try {
      setLoading(true);  // Start loading
      const response = await getSensorTypeSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}&param_location=${locationParam}`
      );
      setSensorTypeData(response.data);
    } catch (error) {
      console.error("Error fetching sensor type data:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const fetchSensorNameData = async (floorParam, zoneParam, locationParam, sensorTypeParam) => {
    try {
      setLoading(true);  // Start loading
      const response = await getSensorNameSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}&param_location=${locationParam}&param_sensor_type=${formatFilter(sensorTypeParam)}`
      );
      setSensorNameData(response.data);
    } catch (error) {
      console.error("Error fetching sensor name data:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const fetchSensorStatusData = async (floorParam, zoneParam, locationParam, sensorTypeParam, sensorNameParam) => {
    try {
      setLoading(true);  // Start loading
      const response = await getSensorStatusSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}&param_location=${locationParam}&param_sensor_type=${formatFilter(sensorTypeParam)}&param_sensor_name=${formatFilter(sensorNameParam)}`
      );
      setSensorStatusData(response.data);
    } catch (error) {
      console.error("Error fetching sensor status data:", error);
    } finally {
      setLoading(false);  // Stop loading after the request is complete
    }
  };

  const handleTabClick = (floorName) => {
    setFloor(floorName);
    setFilters(defaultFilters);
    navigate(`?floor=${floorName}`);

    fetchFloorSummary(floorName, defaultFilters);
    fetchSensorSummary(floorName);
    fetchFloorList();
    fetchZoneData(floorName);
    fetchLocationData("ALL", floorName);
    fetchSensorTypeData(floorName, "ALL", "ALL");
  };

  const handleApplyFilters = (appliedFilters) => {
    const updatedFilters = {
      zone: appliedFilters.zone || "ALL",
      location: appliedFilters.location || "ALL",
      sensorType: appliedFilters.sensorType.length ? appliedFilters.sensorType : [],
      sensor: appliedFilters.sensor.length ? appliedFilters.sensor : [],
      sensorStatus: appliedFilters.sensorStatus.length ? appliedFilters.sensorStatus : [],
    };

    setFilters(updatedFilters);
    fetchFloorSummary(floor, updatedFilters);
    fetchZoneData(floor);
    fetchLocationData(updatedFilters.zone, floor);
    fetchSensorTypeData(floor, updatedFilters.zone, updatedFilters.location);
    fetchSensorNameData(floor, updatedFilters.zone, updatedFilters.location, updatedFilters.sensorType);
    fetchSensorStatusData(floor, updatedFilters.zone, updatedFilters.location, updatedFilters.sensorType, updatedFilters.sensor);
  };

  // useEffect(() => {
  //   fetchFloorSummary(floor, filters);
  //   fetchSensorSummary(floor);
  //   fetchFloorList();
  //   fetchZoneData(floor);
  //   fetchLocationData("ALL", floor);
  //   fetchSensorTypeData(floor, "ALL", "ALL");
  //   fetchSensorNameData(floor, "ALL", "ALL", []);
  //   fetchSensorStatusData(floor, "ALL", "ALL", [], []);
  // }, [floor]);
  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    let isFirstLoad = true;

    const fetchAllData = async () => {
      if (isFirstLoad) {
        setLoading(true);
      }

      try {
        const floorSummaryRes = await getFloorSummary(
          `param_floor=${floor}&param_zone=${formatFilter(filters.zone)}&param_location=${formatFilter(filters.location)}&param_sensor_type=${formatFilter(filters.sensorType)}&param_sensor_name=${formatFilter(filters.sensor)}&param_sensor_status=${formatFilter(filters.sensorStatus)}`
        );
        const sensorSummaryRes = await GetSensorSummary(`param_floor=${floor}`);
        const floorListRes = await floorList();
        const deviceIds = floorSummaryRes.map(item => String(item.s_no.device_id));
        const notifData = await getDeviceNotifications(deviceIds);
        // const zoneDataRes = await getFloorZoneSelector(`param_floor=${floor}`);
        // const locationRes = await getLocationSelector(`param_floor=${floor}&param_zone=ALL`);
        // const sensorTypeRes = await getSensorTypeSelector(`param_floor=${floor}&param_zone=ALL&param_location=ALL`);
        // const sensorNameRes = await getSensorNameSelector(`param_floor=${floor}&param_zone=ALL&param_location=ALL&param_sensor_type=ALL`);
        // const sensorStatusRes = await getSensorStatusSelector(`param_floor=${floor}&param_zone=ALL&param_location=ALL&param_sensor_type=ALL&param_sensor_name=ALL`);

        if (isMounted) {
          setFloorSummaryData(floorSummaryRes);
          console.log("Floor Summary Data:" + JSON.stringify(floorSummaryRes));
          setSensorSummary(sensorSummaryRes.data);
          setFloorData(floorListRes);
          setFloorNotificationData(notifData);
          // setZoneData(zoneDataRes.data);
          // setLocationData(locationRes.data);
          // setSensorTypeData(sensorTypeRes.data);
          // setSensorNameData(sensorNameRes.data);
          // setSensorStatusData(sensorStatusRes.data);
        }
      } catch (err) {
        console.error("Error in polling:", err);
      } finally {
        if (isMounted) {
          if (isFirstLoad) {
            setLoading(false);
            isFirstLoad = false;
          }
          timeoutId = setTimeout(fetchAllData, 500);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [floor, filters]);


  const countDetectorTypes = (data) => {
    return data.reduce((acc, item) => {
      const type = item.s_no.detector_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  };
  const sensorCounts = countDetectorTypes(floorSummaryData || []);
  console.log("Floor Summary Data: " + JSON.stringify(floorSummaryData));

  const transformSensorData = (data) => {
    if (!Array.isArray(data)) {
      console.warn("transformSensorData: data is not an array", data);
      return [];
    }

    return data.map((item) => {
      if (!item.s_no) {
        console.warn("transformSensorData: missing s_no", item);
        return null;
      }

      const {
        zone,
        detector,
        location,
        status,
        alarms_and_alerts,
        detector_type,
        device_id,
      } = item.s_no;

      return {
        zone: zone,
        sensor: detector,
        location: location,
        status: status,
        alarmCount: alarms_and_alerts,
        sensorType: detector_type,
        deviceId: device_id,
      };
    }).filter(Boolean);  // Remove null entries if s_no is missing
  };

  // Safely format the data
  const formattedSensorsData = transformSensorData(floorSummaryData || []);
  console.log("Floor Data    "+JSON.stringify(floorNotificationData));

  return (
    <Box>
      {loading ? (
        <Loader />  // Display loader while fetching data
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Breadcrumbs />
            <div style={{ display: "flex", gap: "10px" }}></div>
          </div>
          <Divider style={{ border: "1px solid #E8E8E8", margin: "8px 0" }} />
          <div>
            {/* <SensorStatusCards /> */}
            <SummaryCards />
          </div>
          <Divider style={{ border: "1px solid #70707059", margin: "8px 0", marginTop: "2rem" }} />
          <Box width="100%">
            <FloorTabs floorData={floorData} onTabChange={handleTabClick} />
            <Divider style={{ border: "1px solid #E8E8E8", margin: "8px 0" }} />
            <Box width="100%">
              <FloorSummary data={sensorSummary} sensorCounts={sensorCounts} />
            </Box>
            <Box display="flex" justifyContent="flex-start" gap={2} mb={1} ml={4} mt={3}>

              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="View Toggle"
                disabled={!["Upper Ground Floor", "Lower Ground Floor", "First Floor", "Terrace", "Utility Blocks"].includes(floor)}
              >
                <ToggleButton value="map" aria-label="Map View">
                  Map View
                </ToggleButton>
                <ToggleButton value="grid" aria-label="Grid View">
                  Grid View
                </ToggleButton>
              </ToggleButtonGroup>
              {/* Utility Floor Toggle (North/South) */}
              {floor === "Utility Blocks" && (
                <ToggleButtonGroup
                  value={utilityView}
                  exclusive
                  onChange={handleUtilityViewChange}
                  aria-label="Utility Floor View Toggle"
                >
                  <ToggleButton value="north" aria-label="North View">
                    North
                  </ToggleButton>
                  <ToggleButton value="south" aria-label="South View">
                    South
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            </Box>
            <Box display="flex" flexDirection={{ base: "column", md: "row" }}>
              {/* Floor Plan Map on the left */}
              {/* <Box flex="1.5" bg="white" p={4} borderRadius="lg" boxShadow="lg" minW="300px">
                {view === "map" ? (
                  <LGFFloorMap sensorData={formatTestData} />
                  // <FloorPlanMap sensorData={formatTestData} />
                ) : (
                  <FloorWiseStatusGrid sensorData={floorSummaryData} />
                )}
              </Box> */}
              <Box flex="1.5" bg="white" p={4} borderRadius="lg" boxShadow="lg" minW="300px">
                {view === "map" && ["Upper Ground Floor", "Lower Ground Floor", "First Floor", "Terrace", "Utility Blocks"].includes(floor) ? (
                  floor === "Utility Blocks" ? (
                    utilityView === "north" ? (
                      <NorthUtilityMap sensorData={floorSummaryData} />
                    ) : (
                      <SouthUtilityMap sensorData={floorSummaryData} />
                    )
                  ) : floor === "Upper Ground Floor" ? (
                    <UGFFloorMap sensorData={floorSummaryData} />
                  ) : floor === "Lower Ground Floor" ? (
                    <LGFFloorMap sensorData={floorSummaryData} />
                  ) : floor === "Terrace" ? (
                    <TerraceMap sensorData={floorSummaryData} />
                  ) : floor === "First Floor" ? (
                    <FirstFloorMap sensorData={floorSummaryData} />
                  ) : null
                ) : (
                  <FloorWiseStatusGrid sensorData={floorSummaryData} />
                )}
              </Box>


              {/* Alarm + Notification Panels on the right, stacked vertically */}
              <Box
                flex="1"
                display="flex"
                flexDirection="column"
                gap={2}
                bg="transparent"
                minW="300px"
                minHeight="90vh"
                mt={2}
              >
                {/* Alarm Panel */}
                <Box bg="white" p={2} borderRadius="lg" boxShadow="lg" borderColor="#E8E8E8">
                  <FloorWiseAlarmPanel sensorData={floorSummaryData} />
                </Box>

                {/* Notification Panel */}
                <Box bg="white" p={1} borderRadius="lg" boxShadow="lg" borderColor="#E8E8E8">
                  {/* <FloorWiseNotificationPanal sensorData={floorSummaryData} /> */}
                  {/* {floor === "Upper Ground Floor" ? ( */}
                    <FloorWiseNotificationPanal sensorData={floorNotificationData} />
                  {/* // ) : null} */}
                </Box>
              </Box>
            </Box>

          </Box>
        </>
      )}
    </Box>
  );
};

export default FloorWiseDashboard;