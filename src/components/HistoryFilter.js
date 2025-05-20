import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Autocomplete,
  Alert,
  Snackbar,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";
import { getSensorTypes, getSensorNamesByType, getSensorLocations, getHistDeviceId } from "../service/HistoryService";

const HistoryFilter = ({ onFilterChange }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [sensorType, setSensorType] = useState("");
  const [sensorName, setSensorName] = useState(""); // Changed to single string
  const [sensorLocation, setSensorLocation] = useState(""); // Changed to single string
  const [dateRange, setDateRange] = useState([null, null]);
  const [deviceIds, setDeviceIds] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [sensorNamesByType, setSensorNamesByType] = useState({});
  const [sensorLocations, setSensorLocations] = useState([]);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const deviceIds = await getHistDeviceId();
        setDeviceIds(deviceIds.length > 0 ? deviceIds : []);

        const types = await getSensorTypes();
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
        setSensorNamesByType(namesByType);

        if (sensorName) {
          const locations = await getSensorLocations([sensorName]); // Pass single sensorName as array
          setSensorLocations(locations.length > 0 ? locations : []);
        } else {
          setSensorLocations([]);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        setError("Failed to load filter options.");
      }
    };
    fetchFilterOptions();
  }, [sensorName]); 

  const validateSevenDayRange = ([start, end]) => {
    if (!start || !end) return true; // Will be caught by required validation
    return dayjs(end).diff(start, "day") <= 7;
  };

  const handleApply = () => {
    setValidationError(null); // Clear previous validation errors

    if (!deviceId && !sensorType) {
      setValidationError("Please select either Device ID or Sensor Type.");
      return;
    }

    if (sensorType) {
      if (!sensorName) {
        setValidationError("Please select a Sensor Name.");
        return;
      }
      if (!sensorLocation) {
        setValidationError("Please select a Location.");
        return;
      }
    }

    if (!dateRange[0] || !dateRange[1]) {
      setValidationError("Date range is required. Please select both Start and End dates.");
      return;
    }

    if (!validateSevenDayRange(dateRange)) {
      setValidationError("Date range must be within 7 days.");
      return;
    }

    const filters = {
      deviceId: deviceId || null,
      sensorType: sensorType || null,
      sensorNames: sensorType ? [sensorName] : [], // Wrap single sensorName in array for consistency
      sensorLocation: sensorType ? [sensorLocation] : [], // Wrap single sensorLocation in array
      dateRange,
    };

    setValidationError(null); // Clear validation error on successful validation
    onFilterChange(filters);
  };

  const handleDeviceIdChange = (event, newValue) => {
    setDeviceId(newValue);
    setSensorType("");
    setSensorName(""); // Reset to empty string
    setSensorLocation(""); // Reset to empty string
    setValidationError(null); // Clear validation error on change
  };

  const handleSensorTypeChange = (e) => {
    setSensorType(e.target.value);
    setDeviceId(null);
    setSensorName(""); // Reset to empty string
    setSensorLocation(""); // Reset to empty string
    setValidationError(null); // Clear validation error on change
  };

  const handleCloseSnackbar = () => {
    setValidationError(null); // Clear validation error when closing Snackbar
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, position: "relative" }}>
        <Snackbar
          open={!!validationError}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ width: "100%", top: 0 }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%", maxWidth: 600 }}
          >
            {validationError}
          </Alert>
        </Snackbar>

        {error && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Autocomplete
          options={deviceIds}
          getOptionLabel={(option) => option.toString()}
          value={deviceId}
          onChange={handleDeviceIdChange}
          renderInput={(params) => (
            <TextField {...params} label="Device ID" sx={{ minWidth: 180 }} />
          )}
          freeSolo={false}
          disabled={!!sensorType}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sensor Type</InputLabel>
          <Select
            value={sensorType}
            onChange={handleSensorTypeChange}
            label="Sensor Type"
            disabled={!!deviceId}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sensorTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {sensorType && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sensor Name</InputLabel>
            <Select
              value={sensorName}
              onChange={(e) => {
                setSensorName(e.target.value);
                setSensorLocation(""); 
                setValidationError(null); // Clear validation error on change
              }}
              input={<OutlinedInput label="Sensor Name" />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {(sensorNamesByType[sensorType] || []).map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {sensorType && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sensor Location</InputLabel>
            <Select
              value={sensorLocation}
              onChange={(e) => {
                setSensorLocation(e.target.value);
                setValidationError(null); // Clear validation error on change
              }}
              input={<OutlinedInput label="Sensor Location" />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sensorLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {(deviceId || sensorType) && (
          <DateRangePicker
            startText="Start"
            endText="End"
            value={dateRange}
            onChange={(newRange) => {
              setDateRange(newRange);
              setValidationError(null); // Clear validation error on change
            }}
            calendars={1}
            disableFuture
            maxDate={dayjs().add(30, "day")}
            sx={{ minWidth: 250 }}
          />
        )}

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