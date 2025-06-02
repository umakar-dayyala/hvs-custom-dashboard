import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import DeviceBox from "./DeviceBox";
import { fetchAlarmSummary } from "../service/AlarmSummaryService";
import { Link } from "react-router-dom";

const DeviceFilter = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [filters, setFilters] = useState({
    floor: "",
    zone: "",
    location: "",
    category: "",
    type: "",
    status: "",
  });

  // Fetch device data from API and auto-refresh every 30 seconds
  const getDeviceData = async () => {
    try {
      const data = await fetchAlarmSummary(); // Make sure this returns an array of device objects
      setDeviceData(data);
    } catch (error) {
      console.error("Failed to fetch device data", error);
    }
  };

  useEffect(() => {
    getDeviceData(); // Initial fetch
    const interval = setInterval(getDeviceData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const filtered = deviceData.filter((device) =>
      Object.entries(filters).every(([key, value]) =>
        value === "" || String(device[key]).toLowerCase() === String(value).toLowerCase()
      )
    );
    setFilteredDevices(filtered);
  }, [filters, deviceData]);

  const handleFilterChange = (key) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const getOptions = (key) => {
    const filteredBase = deviceData.filter((device) =>
      Object.entries(filters).every(([k, v]) => {
        if (k === key) return true;
        return v === "" || String(device[k]).toLowerCase() === String(v).toLowerCase();
      })
    );

    const uniqueValues = [...new Set(filteredBase.map((d) => d[key]))];
    return [{ value: "", label: "All" }, ...uniqueValues.map((value) => ({ value, label: value }))];
  };

  const getDevicePath = (device) => {
  const { type2, device_id } = device;
  switch (type2) {
    case "Oxygen":
      return `/${type2}?device_id=${device_id}`;
    case "Weather":
      return `/${type2}?device_id=${device_id}`;
    case "AP4C-F":
      return `/ap4cIndividual?device_id=${device_id}`;
    default:
      return `/${type2}Individual?device_id=${device_id}`;
  }
};


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Box sx={{ flexShrink: 0, zIndex: 2, backgroundColor: "background.paper" }}>
        <Paper elevation={3} sx={{ p: 3, position: "sticky", top: 0, zIndex: 1 }}>
          <Typography variant="h6" gutterBottom>Device Filters</Typography>
          <Grid container spacing={2}>
            {["floor", "zone", "location", "category", "type", "status"].map((key) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
                <FormControl fullWidth>
                  <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                  <Select
                    value={filters[key]}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    onChange={handleFilterChange(key)}
                  >
                    {getOptions(key).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", pt: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, px: 2 }}>
          Devices ({filteredDevices.length})
        </Typography>
       <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
  {filteredDevices.map((device, index) => {
    const type2 = device.type2;
 
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
       <Link to={getDevicePath(device)} style={{ textDecoration: "none" }}>
  <DeviceBox device={device} />
</Link>

      </Grid>
    );
  })}
</Grid>

      </Box>
    </Box>
  );
};

export default DeviceFilter;