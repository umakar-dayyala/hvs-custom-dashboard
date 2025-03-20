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
import activeSensorsIcon from "../assets/onlineWifi.svg";  // Change to the correct icon
import inactiveSensorsIcon from "../assets/rWifiIcon.svg";  // Change to the correct icon

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

const FloorSummary = ({ data = [] }) => {
  // Check if data is not empty and is an array
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box p={2}>
        <HvTypography variant="body">No floor data available.</HvTypography>
      </Box>
    );
  }

  return (
    <>
      {data.map((floor) => (
        <Box key={floor.floor} display="flex" alignItems="center" mb={2} pl={1} pr={1}>
          {/* Floor Title */}
          <Box>
            <HvTypography variant="title3" sx={boldText}>
              {floor.floor}
            </HvTypography>
          </Box>

          {/* Spacer to push details to the right */}
          <Box flexGrow={1} />

          {/* Right-Aligned Details */}
          <Box display="flex" alignItems="center">
            {/* Sensor Counts */}
            <Box display="flex" alignItems="center" gap={0.5} ml={1}>
              <img src={chemicalIcon} alt="Chemical Icon" width={16} height={16} />
              <HvTypography variant="label">{floor.chemical_alerts}</HvTypography>
              <VerticalDivider />
            </Box>

            <Box display="flex" alignItems="center" gap={0.5} ml={1}>
              <img src={biologicalIcon} alt="Biological Icon" width={16} height={16} />
              <HvTypography variant="label">{floor.biological_alerts}</HvTypography>
              <VerticalDivider />
            </Box>

            <Box display="flex" alignItems="center" gap={0.5} ml={1}>
              <img src={radiologicalIcon} alt="Radiological Icon" width={16} height={16} />
              <HvTypography variant="label">{floor.radiological_alerts}</HvTypography>
              <VerticalDivider />
            </Box>

            {/* Total Zones */}
            <Box display="flex" alignItems="center" gap={0.5} ml={1}>
              <img src={totalZonesIcon} alt="Total Zones Icon" width={16} height={16} />
              <HvTypography>
                Total Zones <HvTypography variant="label">{floor.total_zones}</HvTypography>
              </HvTypography>
              <VerticalDivider />
            </Box>

            {/* Total Locations */}
            <Box display="flex" alignItems="center" gap={0.5} ml={1}>
              <img src={totalSensorsIcon} alt="Total Locations Icon" width={16} height={16} />
              <HvTypography>
                Total Locations <HvTypography variant="label">{floor.total_location}</HvTypography>
              </HvTypography>
              <VerticalDivider />
            </Box>

            {/* Active Sensors */}
            <Box display="flex" alignItems="center" gap={0.5} ml={1}>
              <img src={activeSensorsIcon} alt="Active Sensors Icon" width={16} height={16} />
              <HvTypography>
                Active Sensors <HvTypography variant="label">{floor.active_sensors}</HvTypography>
              </HvTypography>
              <VerticalDivider />
            </Box>

            {/* Inactive Sensors */}
            <Box display="flex" alignItems="center" gap={0.5} ml={1}>
              <img src={inactiveSensorsIcon} alt="Inactive Sensors Icon" width={16} height={16} />
              <HvTypography>
                Inactive Sensors <HvTypography variant="label">{floor.inactive_sensors}</HvTypography>
              </HvTypography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default FloorSummary;
