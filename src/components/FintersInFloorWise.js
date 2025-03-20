import React, { useState, useEffect } from "react";
import { Box, MenuItem, Select, Button } from "@mui/material";
import { HvTypography, HvButton } from "@hitachivantara/uikit-react-core";

const FintersInFloorWise = ({
  filters,
  onFilterApply,
  zoneData,
  locationData,
  sensorTypeData,
  sensorNameData,
  sensorStatusData,
}) => {
  // Maintain local state for filters
  const [selectedFilters, setSelectedFilters] = useState(filters);

  // Update local state when parent filters change (e.g., on tab change)
  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  // Handle dropdown changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const dropdownStyle = {
    minWidth: "320px",
    backgroundColor: "#ffffff",
  };

  return (
    <Box display="flex" gap={2} mt={2} mb={2} alignItems="center">
      {/* View By */}
      <HvTypography variant="label">View by</HvTypography>

      <Select
        multiple
        value={selectedFilters.zone}
        onChange={(e) => handleFilterChange("zone", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Zone"
        }
      >
        <MenuItem value="ALL">All Zones</MenuItem>
        {Array.isArray(zoneData.zone) && zoneData.zone.map((option) => (
          <MenuItem key={option.zone} value={option.zone}>
            {option.zone}
          </MenuItem>
        ))}
      </Select>


      {/* Location Dropdown */}
      <Select
        multiple
        value={selectedFilters.location}
        onChange={(e) => handleFilterChange("location", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Location"
        }
      >
        <MenuItem value="ALL">All Locations</MenuItem>
        {locationData?.map((option) => (
          <MenuItem key={option.location} value={option.location}>
            {option.location}
          </MenuItem>
        ))}
      </Select>

      {/* Sensor Type (Multi-Select) */}
      <Select
        multiple
        value={selectedFilters.sensorType}
        onChange={(e) => handleFilterChange("sensorType", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Sensor Type"
        }
      >
        <MenuItem value="ALL">All Sensor Types</MenuItem>
        {sensorTypeData?.map((option) => (
          <MenuItem key={option.sensor_type} value={option.sensor_type}>
            {option.sensor_type}
          </MenuItem>
        ))}
      </Select>

      {/* Sensor (Multi-Select) */}
      <Select
        multiple
        value={selectedFilters.sensor}
        onChange={(e) => handleFilterChange("sensor", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Sensor"
        }
      >
        <MenuItem value="ALL">All Sensors</MenuItem>
        {sensorNameData?.map((option) => (
          <MenuItem key={option.sensor_name} value={option.sensor_name}>
            {option.sensor_name}
          </MenuItem>
        ))}
      </Select>

      {/* Sensor Status (Multi-Select) */}
      <Select
        multiple
        value={selectedFilters.sensorStatus}
        onChange={(e) => handleFilterChange("sensorStatus", e.target.value)}
        size="small"
        displayEmpty
        sx={dropdownStyle}
        renderValue={(selected) =>
          selected.length ? selected.join(", ") : "Sensor Status"
        }
      >
        <MenuItem value="ALL">All Sensor Statuses</MenuItem>
        {sensorStatusData?.map((option) => (
          <MenuItem key={option.sensor_status} value={option.sensor_status}>
            {option.sensor_status}
          </MenuItem>
        ))}
      </Select>

      {/* Apply Button */}
      <HvButton onClick={() => onFilterApply(selectedFilters)}>Apply</HvButton>
    </Box>
  );
};

export default FintersInFloorWise;
