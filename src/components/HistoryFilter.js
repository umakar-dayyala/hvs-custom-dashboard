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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getSensorTypes, getSensorNamesByType, getSensorLocations, getHistDeviceId } from "../service/HistoryService";

const HistoryFilter = ({ onFilterChange }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [dataType, setDataType] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [sensorLocation, setSensorLocation] = useState("");
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
          const locations = await getSensorLocations([sensorName]);
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

  const validateOneHourRange = ([start, end]) => {
    if (!start || !end) return true; // Will be caught by required validation
    return dayjs(end).diff(start, "hour", true) <= 1;
  };

  const handleApply = () => {
    setValidationError(null);

    if (!dataType) {
      setValidationError("Please select a Data Type.");
      return;
    }

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
      setValidationError("Date and time range is required. Please select both Start and End date-times.");
      return;
    }

    if (!validateOneHourRange(dateRange)) {
      setValidationError("Date range must be within 1 hour.");
      return;
    }

    const filters = {
      dataType,
      deviceId: deviceId || null,
      sensorType: sensorType || null,
      sensorNames: sensorType ? [sensorName] : [],
      sensorLocation: sensorType ? [sensorLocation] : [],
      dateRange,
    };

    setValidationError(null);
    onFilterChange(filters);
  };

  const handleDeviceIdChange = (event, newValue) => {
    setDeviceId(newValue);
    setSensorType("");
    setSensorName("");
    setSensorLocation("");
    setValidationError(null);
  };

  const handleDataTypeChange = (e) => {
    setDataType(e.target.value);
    setDeviceId(null);
    setSensorType("");
    setSensorName("");
    setSensorLocation("");
    setValidationError(null);
  };

  const handleSensorTypeChange = (e) => {
    setSensorType(e.target.value);
    setDeviceId(null);
    setSensorName("");
    setSensorLocation("");
    setValidationError(null);
  };

  const handleCloseSnackbar = () => {
    setValidationError(null);
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

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Data Type</InputLabel>
          <Select
            value={dataType}
            onChange={handleDataTypeChange}
            label="Data Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="processed">Processed Data</MenuItem>
            <MenuItem value="raw">Raw Data</MenuItem>
          </Select>
        </FormControl>

        {!sensorType && (
          <Autocomplete
            options={deviceIds}
            getOptionLabel={(option) => option.toString()}
            value={deviceId}
            onChange={handleDeviceIdChange}
            renderInput={(params) => (
              <TextField {...params} label="Device ID" sx={{ minWidth: 180 }} />
            )}
            freeSolo={false}
          />
        )}
        {!deviceId && (
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Sensor Type</InputLabel>
            <Select
              value={sensorType}
              onChange={handleSensorTypeChange}
              label="Sensor Type"
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
        )}
        {sensorType && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sensor Name</InputLabel>
            <Select
              value={sensorName}
              onChange={(e) => {
                setSensorName(e.target.value);
                setSensorLocation("");
                setValidationError(null);
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
                setValidationError(null);
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
          <>
            <DateTimePicker
              label="Start"
              value={dateRange[0]}
              onChange={(newStart) => {
                if (newStart && newStart.isValid()) {
                  const newEnd = newStart.add(1, "hour");
                  setDateRange([newStart, newEnd]);
                } else {
                  setDateRange([newStart, dateRange[1]]);
                }
                setValidationError(null);
              }}
              maxDateTime={dayjs().subtract(1, "day")}
              sx={{ minWidth: 250 }}
            />
            <DateTimePicker
              label="End"
              value={dateRange[1]}
              onChange={(newEnd) => {
                setDateRange([dateRange[0], newEnd]);
                setValidationError(null);
              }}
              maxDateTime={dayjs().subtract(1, "day")}
              sx={{ minWidth: 250 }}
            />
          </>
        )}

        <Button
          variant="contained"
          onClick={handleApply}
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
          Apply
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default HistoryFilter;