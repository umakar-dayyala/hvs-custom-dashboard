import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import FloorTabs from "../components/FloorTabs";
import SensorStatusCards from "../components/SensorStatusCards";
import FilterBar from "../components/FintersInFloorWise";
import DataTable from "../components/FloorWiseDataTable";
import FloorSummary from "../components/FloorSummary";
import {
  floorList,
  getFloorSummary,
  GetSensorSummary,
  getFloorZoneSelector,
  getLocationSelector,
  getSensorTypeSelector,
  getSensorNameSelector,
  getSensorStatusSelector
} from "../service/summaryServices";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";

const FloorWiseDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialFloor = queryParams.get("floor") || "ALL";

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

  const defaultFilters = {
    zone: [],
    location: [],
    sensorType: [],
    sensor: [],
    sensorStatus: [],
  };

  const [filters, setFilters] = useState(defaultFilters);

  const formatFilter = (filterArray) =>
    filterArray.length ? filterArray.join(",") : "ALL";

  const fetchFloorSummary = async (floorParam, appliedFilters) => {
    try {
      const response = await getFloorSummary(
        `param_floor=${floorParam}&param_zone=${formatFilter(appliedFilters.zone)}&param_location=${formatFilter(appliedFilters.location)}&param_sensor_type=${formatFilter(appliedFilters.sensorType)}&param_sensor_name=${formatFilter(appliedFilters.sensor)}&param_sensor_status=${formatFilter(appliedFilters.sensorStatus)}`
      );
      setFloorSummaryData(response);
    } catch (error) {
      console.error("Error fetching floor summary:", error);
    }
  };

  const fetchSensorSummary = async (floorParam) => {
    try {
      const response = await GetSensorSummary(`param_floor=${floorParam}`);
      setSensorSummary(response.data);
    } catch (error) {
      console.error("Error fetching sensor summary:", error);
    }
  };

  const fetchFloorList = async () => {
    try {
      const response = await floorList();
      setFloorData(response);
    } catch (error) {
      console.error("Error fetching floor list:", error);
    }
  };

  const fetchZoneData = async (floorParam) => {

    try {
      const response = await getFloorZoneSelector(`param_floor=${floorParam}`);
      setZoneData(response.data);
    } catch (error) {
      console.error("Error fetching zone data:", error);
    }
  }

  const fetchLocationData = async (zoneParam = "ALL", floorParam = "ALL") => {
    try {
      const response = await getLocationSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}`
      );
      setLocationData(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const fetchSensorTypeData = async (floorParam, zoneParam, locationParam) => {
    try {
      const response = await getSensorTypeSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}&param_location=${locationParam}`
      );
      setSensorTypeData(response.data);
    } catch (error) {
      console.error("Error fetching sensor type data:", error);
    }
  };

  const fetchSensorNameData = async (floorParam, zoneParam, locationParam, sensorTypeParam) => {
    try {
      const response = await getSensorNameSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}&param_location=${locationParam}&param_sensor_type=${formatFilter(sensorTypeParam)}`
      );
      setSensorNameData(response.data);
    } catch (error) {
      console.error("Error fetching sensor name data:", error);
    }
  };

  const fetchSensorStatusData = async (floorParam, zoneParam, locationParam, sensorTypeParam, sensorNameParam) => {
    try {
      const response = await getSensorStatusSelector(
        `param_floor=${floorParam}&param_zone=${zoneParam}&param_location=${locationParam}&param_sensor_type=${formatFilter(sensorTypeParam)}&param_sensor_name=${formatFilter(sensorNameParam)}`
      );
      setSensorStatusData(response.data);
    } catch (error) {
      console.error("Error fetching sensor status data:", error);
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

  useEffect(() => {
    fetchFloorSummary(floor, filters);
    fetchSensorSummary(floor);
    fetchFloorList();
    fetchZoneData(floor);
    fetchLocationData("ALL", floor);
    fetchSensorTypeData(floor, "ALL", "ALL");
    fetchSensorNameData(floor, "ALL", "ALL", []);
    fetchSensorStatusData(floor, "ALL", "ALL", [], []);
  }, [floor]);

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
              <FloorTabs floorData={floorData} onTabChange={handleTabClick} />
            </Box>

            {/* Filters */}
            <FilterBar 
              filters={filters} 
              onFilterApply={handleApplyFilters} 
              zoneData={zoneData}
              locationData={locationData}
              sensorTypeData={sensorTypeData}
              sensorNameData={sensorNameData}
              sensorStatusData={sensorStatusData}
            />

            {/* Data Table */}
            <DataTable data={floorSummaryData} />
        </Box>
    </Box>
);


};

export default FloorWiseDashboard;
