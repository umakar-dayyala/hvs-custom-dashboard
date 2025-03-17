import React from "react";
import { Box, MenuItem, Select } from "@mui/material";
import { HvTypography } from "@hitachivantara/uikit-react-core";

const FintersInFloorWise = ({ filters, onFilterChange }) => {
  // Handle multi-select changes
  const handleMultiSelectChange = (filterName, value) => {
    onFilterChange(filterName, value);
  };

  // Options for each dropdown
  const sensorTypeOptions = ["Chemical", "Radiation"];
  const sensorOptions = ["FC1", "PRM"];
  const sensorStatusOptions = ["Online", "Offline"];

  const dropdownStyle = {
    minWidth: "350px",  // Set a consistent minimum width
    backgroundColor: "#ffffff",
  };

  return (
    <Box display="flex" gap={2} mt={2} mb={2} alignItems="center">
      {/* View By */}
      <HvTypography variant="label">View by</HvTypography>
      <Select
        value={filters.viewBy}
        onChange={(e) => onFilterChange("viewBy", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
      >
        <MenuItem value="Location">Location</MenuItem>
        <MenuItem value="Zone">Zone</MenuItem>
      </Select>

      {/* Sensor Type (Multi-Select) */}
      <Select
        multiple
        value={filters.sensorType}
        onChange={(e) => handleMultiSelectChange("sensorType", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Sensor Type"
        }
      >
        {sensorTypeOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>

      {/* Sensor (Multi-Select) */}
      <Select
        multiple
        value={filters.sensor}
        onChange={(e) => handleMultiSelectChange("sensor", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Sensor"
        }
      >
        {sensorOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>

      {/* Sensor Status (Multi-Select) */}
      <Select
        multiple
        value={filters.sensorStatus}
        onChange={(e) => handleMultiSelectChange("sensorStatus", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Sensor Status"
        }
      >
        {sensorStatusOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default FintersInFloorWise;
