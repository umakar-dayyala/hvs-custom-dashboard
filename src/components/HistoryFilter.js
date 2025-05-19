import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Autocomplete,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";
import { getSensorTypes, getSensorNamesByType, getSensorLocations, getHistDeviceId } from "../service/HistoryService";

const HistoryFilter = ({ onFilterChange }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [sensorType, setSensorType] = useState("");
  const [sensorNames, setSensorNames] = useState([]);
  const [sensorLocation, setSensorLocation] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [deviceIds, setDeviceIds] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [sensorNamesByType, setSensorNamesByType] = useState({});
  const [sensorLocations, setSensorLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const deviceIds = await getHistDeviceId();
        setDeviceIds(deviceIds.length > 0 ? deviceIds : []);

        const types = await getSensorTypes();
        console.log("Fetched sensor types:", types);
        setSensorTypes(types.length > 0 ? types : []);

        const namesByType = {};
        for (const type of types) {
          try {
            namesByType[type] = await getSensorNamesByType(type);
          } catch (err) {
            namesByType[type] = [];
            console.warn(`Failed to fetch sensor names for ${type}:`, err);
          }
        }
        console.log("Sensor names by type:", namesByType);
        setSensorNamesByType(namesByType);

        const locations = await getSensorLocations(sensorNames.length > 0 ? sensorNames : null);
        console.log("Setting sensor locations:", locations);
        setSensorLocations(locations.length > 0 ? locations : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        setError("Failed to load filter options.");
      }
    };
    fetchFilterOptions();
  }, [sensorNames]);

  const validateOneMonthRange = ([start, end]) => {
    if (!start || !end) return true;
    return dayjs(end).diff(start, "month") <= 1;
  };

  const handleApply = () => {
    if (!deviceId && !sensorType) {
      alert("Please select either Device ID or Sensor Type.");
      return;
    }

    if (!sensorNames.length) {
      alert("Please select at least one Sensor Name.");
      return;
    }

    if (!sensorLocation.length) {
      alert("Please select at least one Location.");
      return;
    }

    if (!validateOneMonthRange(dateRange)) {
      alert("Date range must be within one month.");
      return;
    }

    const filters = {
      deviceId: deviceId || null,
      sensorType: sensorType || null,
      sensorNames,
      sensorLocation,
      dateRange,
    };

    onFilterChange(filters);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {error && (
          <Box sx={{ color: "red", mb: 2 }}>
            {error}
          </Box>
        )}
        <Autocomplete
          options={deviceIds}
          getOptionLabel={(option) => option.toString()}
          value={deviceId}
          onChange={(event, newValue) => {
            setDeviceId(newValue);
            setSensorNames([]);
            setSensorLocation([]);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Device ID" sx={{ minWidth: 180 }} />
          )}
          freeSolo={false}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sensor Type</InputLabel>
          <Select
            value={sensorType}
            onChange={(e) => {
              setSensorType(e.target.value);
              setSensorNames([]);
              setSensorLocation([]);
            }}
            label="Sensor Type"
          >
            {sensorTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(deviceId || sensorType) && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sensor Name</InputLabel>
            <Select
              multiple
              value={sensorNames}
              onChange={(e) => setSensorNames(e.target.value)}
              input={<OutlinedInput label="Sensor Name" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {(sensorNamesByType[sensorType] || []).map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={sensorNames.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {(deviceId || sensorType) && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sensor Location</InputLabel>
            <Select
              multiple
              value={sensorLocation}
              onChange={(e) => setSensorLocation(e.target.value)}
              input={<OutlinedInput label="Sensor Location" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {sensorLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  <Checkbox checked={sensorLocation.includes(loc)} />
                  <ListItemText primary={loc} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <DateRangePicker
          startText="Start"
          endText="End"
          value={dateRange}
          onChange={(newRange) => setDateRange(newRange)}
          calendars={1}
          disableFuture
          maxDate={dayjs().add(30, "day")}
          sx={{ minWidth: 250 }}
        />

        <Button
          variant="contained"
          onClick={handleApply}
          sx={{ minWidth: 120, alignSelf: "center" }}
        >
          Apply
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default HistoryFilter;