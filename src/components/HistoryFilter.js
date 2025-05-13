import React, { useState } from "react";
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
  Grid,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";

const sensorTypes = ["Biological Sensor", "Radiation Sensor", "Chemical Sensor"];
const sensorNamesByType = {
  "Biological Sensor": ["MAB", "IBAC"],
  "Radiation Sensor": ["Geiger", "Gamma Scout"],
  "Chemical Sensor": ["PID", "FTIR"],
};
const sensorLocations = ["Zone 1", "Floor 1, NPB"];

const HistoryFilters = ({ onFilterChange }) => {
  const [deviceId, setDeviceId] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [sensorNames, setSensorNames] = useState([]);
  const [sensorLocation, setSensorLocation] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const validateOneMonthRange = ([start, end]) => {
    if (!start || !end) return true;
    return dayjs(end).diff(start, "month") === 0;
  };

  const handleApply = () => {
    if (!deviceId && !sensorType) {
      alert("Please select either Device ID or Sensor Type.");
      return;
    }

    if (!validateOneMonthRange(dateRange)) {
      alert("Date range must be within the same month.");
      return;
    }

    const filters = {
      deviceId: deviceId || null,
      sensorType: deviceId ? null : sensorType,
      sensorNames: deviceId ? [] : sensorNames,
      sensorLocation: deviceId ? [] : sensorLocation,
      dateRange,
    };

    onFilterChange(filters);
  };

  const isDeviceMode = !!deviceId;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {/* Device ID */}
        <TextField
          label="Device ID"
          value={deviceId}
          onChange={(e) => {
            const val = e.target.value;
            setDeviceId(val);
            if (val) {
              setSensorType("");
              setSensorNames([]);
              setSensorLocation([]);
            }
          }}
          sx={{ minWidth: 180 }}
        />

        {/* Sensor Type */}
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sensor Type</InputLabel>
          <Select
            value={sensorType}
            onChange={(e) => {
              setSensorType(e.target.value);
              setSensorNames([]);
              setDeviceId("");
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

        {/* Sensor Name */}
        {!isDeviceMode && sensorType && (
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

        {/* Sensor Location */}
        {!isDeviceMode && sensorType && (
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

        {/* Date Range Picker */}
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

        {/* Apply Button */}
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

export default HistoryFilters;
