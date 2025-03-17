import React, { useState } from "react";
import { Box, Divider } from "@mui/material";
import FloorTabs from "../components/FloorTabs";
import SensorStatusCards from '../components/SensorStatusCards';
import FilterBar from "../components/FintersInFloorWise";
import DataTable from "../components/FloorWiseDataTable";
import FloorSummary from "../components/FloorSummary";

// Example floor and sensor data
const floorName = [
  { "id": "lower-ground", "name": "Lower Ground" },
  { "id": "upper-ground", "name": "Upper Ground" },
  { "id": "first-floor", "name": "First Floor" },
  { "id": "terrace", "name": "Terrace" },
  { "id": "north-utility", "name": "North Utility" },
  { "id": "south-utility", "name": "South Utility" },
  { "id": "iron-gate", "name": "Iron Gate" },
  { "id": "qrt-01", "name": "QRT 01" },
  { "id": "qrt-02", "name": "QRT 02" },
  { "id": "lab", "name": "LAB" }
];

const floorSummaryData = {
  "floor": "First Floor",
  "sensors": [
    { "sensorType": "Chemical", "count": 2 },
    { "sensorType": "Radiological", "count": 1 },
    { "sensorType": "Biological", "count": 10 }
  ],
  "totalZones": 7,
  "totalLocations": 14,
  "activeSensors": 14,
  "inactiveSensors": 0
};

// Example sensor data
const sensorData = [
    { zone: "01", location: "Zone - 1 Corridor", detector: "FC1 (IMS based Chemical Detector)", isOnline: false, alarm: "Yes", alarmCount: "01 Alarm", description: "Example Description" },
    { zone: "01", location: "Lok Sabha PG Zone-1 Entry", detector: "FC1 (IMS based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "PMO 02", location: "Zone-2 Corridor", detector: "FC1 (IMS based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "PMO 02", location: "Zone-2 Corridor", detector: "AGM (Area Gamma Monitor)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "03", location: "Zone-3 Corridor", detector: "FC1 (IMS based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "04", location: "Zone-4 Corridor", detector: "FC1 (IMS based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "06", location: "Zone-6 Corridor", detector: "FC1 (IMS based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "LS Chamber", location: "Lok Sabha PG Zone-2 Entry", detector: "FC1 (IMS based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "LS Chamber", location: "Lok Sabha PG Corridor", detector: "FC2 (FPD based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "LS Chamber", location: "Lok Sabha PG Corridor", detector: "PRM (Pedestrian Radiation Monitor)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
    { zone: "RS Chamber", location: "Rajya Sabha PG Zone-5 Entry", detector: "FC1 (IMS based Chemical Detector)", isOnline: true, alarm: "No", alarmCount: "00", description: "" },
  ];
  

const FloorWiseDashboard = () => {
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
      <Divider style={{ border: "1px solid #E8E8E8", margin: "8px 0" }} />
      <div>
        <SensorStatusCards />
      </div>
      <Divider style={{ border: "1px solid #70707059", margin: "8px 0", marginTop: "2rem" }} />

      <Box width="100%">
        {/* Pass floorSummaryData to FloorSummary */}
        <FloorSummary data={floorSummaryData} />

        <Box width="100%">
          <FloorTabs floorData={floorName} />
        </Box>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Data Table */}
        <DataTable data={sensorData} />
      </Box>
    </Box>
  );
};

export default FloorWiseDashboard;
