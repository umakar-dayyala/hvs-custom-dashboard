import React from "react";
import { Box } from "@mui/material";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import VerticalDivider from "./VerticalDivider";

// Import SVG icons
import totalZonesIcon from "../assets/greyDirection.svg";
import totalSensorsIcon from "../assets/greyLocation.svg";
import radiologicalIcon from "../assets/gRadiological.svg";
import biologicalIcon from "../assets/gBiological.svg";
import chemicalIcon from "../assets/gChemical.svg";
import activeSensorsIcon from "../assets/gBiological.svg";  // Change to the correct icon
import inactiveSensorsIcon from "../assets/gChemical.svg";  // Change to the correct icon

// Sensor type to icon mapping
const sensorIcons = {
  radiological: radiologicalIcon,
  biological: biologicalIcon,
  chemical: chemicalIcon,
};

// Common inline style
const boldText = {
  fontWeight: "bold",
};

const FloorSummary = ({ data }) => {
  return (
    <Box display="flex" alignItems="center" mb={2} pl={1} pr={1}>
      {/* Floor Title */}
      <Box>
        <HvTypography variant="title3" sx={boldText}>
          {data.floor}
        </HvTypography>
      </Box>

      {/* Spacer to push details to the right */}
      <Box flexGrow={1} />

      {/* Right-Aligned Details */}
      <Box display="flex" alignItems="center">
        {/* Sensor Icons and Counts */}
        {data.sensors.map((sensor, index) => (
          <Box key={index} display="flex" alignItems="center" gap={0.5} ml={1}>
            <img
              src={sensorIcons[sensor.sensorType.toLowerCase()]}
              alt={`${sensor.sensorType} Icon`}
              width={16}
              height={16}
            />
            <HvTypography>
              <HvTypography variant="label">{sensor.count.toString().padStart(2, "0")}</HvTypography>
            </HvTypography>
            <VerticalDivider />
          </Box>
        ))}

        {/* Total Zones */}
        <Box display="flex" alignItems="center" gap={0.5} ml={1}>
          <img src={totalZonesIcon} alt="Total Zones Icon" width={16} height={16} />
          <HvTypography>
            Total Zones <HvTypography variant="label">{data.totalZones}</HvTypography>
          </HvTypography>
          <VerticalDivider />
        </Box>

        {/* Total Locations */}
        <Box display="flex" alignItems="center" gap={0.5} ml={1}>
          <img src={totalSensorsIcon} alt="Total Locations Icon" width={16} height={16} />
          <HvTypography>
            Total Locations <HvTypography variant="label">{data.totalLocations}</HvTypography>
          </HvTypography>
          <VerticalDivider />
        </Box>

        {/* Active Sensors */}
        <Box display="flex" alignItems="center" gap={0.5} ml={1}>
          <img src={activeSensorsIcon} alt="Active Sensors Icon" width={16} height={16} />
          <HvTypography>
            Active Sensors <HvTypography variant="label">{data.activeSensors}</HvTypography>
          </HvTypography>
          <VerticalDivider />
        </Box>

        {/* Inactive Sensors */}
        <Box display="flex" alignItems="center" gap={0.5} ml={1}>
          <img src={inactiveSensorsIcon} alt="Inactive Sensors Icon" width={16} height={16} />
          <HvTypography variant="body">
            Inactive Sensors <HvTypography variant="label">{data.inactiveSensors}</HvTypography>
          </HvTypography>
        </Box>
      </Box>
    </Box>
  );
};

export default FloorSummary;
