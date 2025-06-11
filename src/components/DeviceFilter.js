import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Grid,
  Paper,
  Typography,
  Checkbox,
  ListItemText,
} from "@mui/material";
import DeviceBox from "./DeviceBox";
import { fetchAlarmSummary } from "../service/AlarmSummaryService";
import { Link } from "react-router-dom";

const DeviceFilter = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [filters, setFilters] = useState({
    floor: [],
    zone: [],
    location: [],
    category: [],
    type: [],
    status: [],
  });

  const getDeviceData = async () => {
    try {
      const data = await fetchAlarmSummary();
      setDeviceData(data);
    } catch (error) {
      console.error("Failed to fetch device data", error);
    }
  };

  useEffect(() => {
    getDeviceData();
    const interval = setInterval(getDeviceData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = deviceData.filter((device) =>
      Object.entries(filters).every(([key, values]) => {
        if (!values.length) return true;
        return values.includes(String(device[key]));
      })
    );

    const statusPriority = {
      Alarm: 1,
      Unhealthy: 2,
      Healthy: 3,
      Inactive: 4,
    };

    const sorted = [...filtered].sort((a, b) => {
      const aPriority = statusPriority[a.status] || 5;
      const bPriority = statusPriority[b.status] || 5;
      return aPriority - bPriority;
    });

    setFilteredDevices(sorted);
  }, [filters, deviceData]);

  const handleFilterChange = (key) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getOptions = (key) => {
    const filteredBase = deviceData.filter((device) =>
      Object.entries(filters).every(([k, v]) => {
        if (k === key) return true;
        return !v.length || v.includes(String(device[k]));
      })
    );

    const uniqueValues = [...new Set(filteredBase.map((d) => d[key]))];
    return uniqueValues.map((value) => ({ value, label: value }));
  };

  const getDevicePath = (device) => {
    const { type2, device_id } = device;
    switch (type2) {
      case "Oxygen":
        return `/OxygenMonitoring?device_id=${device_id}`;
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
          {/* <Typography variant="h6" gutterBottom>Device Filters</Typography> */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Device Filters</Typography>
            <Button variant="outlined" color="primary" onClick={() => {
              setFilters({
                floor: [],
                zone: [],
                location: [],
                category: [],
                type: [],
                status: [],
              });
            }}>
              Clear All Filters
            </Button>
          </Box>
          <Grid container spacing={2}>
            {["floor", "zone", "location", "category", "type", "status"].map((key) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
                <FormControl fullWidth>
                  <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                  <Select
                    multiple
                    value={filters[key]}
                    onChange={handleFilterChange(key)}
                    renderValue={(selected) => selected.join(", ")}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    {getOptions(key).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Checkbox checked={filters[key].includes(option.value)} />
                        <ListItemText primary={option.label} />
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
          {filteredDevices.map((device, index) => (
            <Grid  item xs={12} sm={6} md={3} lg={1.5} key={index}>
              <Link to={getDevicePath(device)} style={{ textDecoration: "none" }}>
                <DeviceBox device={device} />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DeviceFilter;