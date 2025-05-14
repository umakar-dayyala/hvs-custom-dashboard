import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icon imports
import gChemical from "../assets/gChemical.svg";
import gBiological from "../assets/gBiological.svg";
import gRadiation from "../assets/gRadiological.svg";
import alertChemical from "../assets/rChemical.svg";
import alertBiological from "../assets/rBiological.svg";
import alertRadiation from "../assets/rRadiological.svg";
import greyBio from "../assets/greyBio.svg";
import greyChemical from "../assets/greyChem.svg";
import greyRadio from "../assets/greyRadio.svg";

// Get icon based on type and status
const getSensorIcon = (type, status, alarmStatus) => {
  if (status === "Inactive" || status === "Disconnected") {
    switch (type) {
      case "Chemical":
        return greyChemical;
      case "Biological":
        return greyBio;
      case "Radiation":
        return greyRadio;
      default:
        return null;
    }
  }

  if (alarmStatus === "Alarm") {
    switch (type) {
      case "Chemical":
        return alertChemical;
      case "Biological":
        return alertBiological;
      case "Radiation":
        return alertRadiation;
      default:
        return null;
    }
  }

  switch (type) {
    case "Chemical":
      return gChemical;
    case "Biological":
      return gBiological;
    case "Radiation":
      return gRadiation;
    default:
      return null;
  }
};

// Detector route mapping
const routeName = (detector) => {
  const routes = {
    AGM: "agmindividual",
    "AP4C-F": "AP4CIndividual",
    FCAD: "FCADIndividual",
    PRM: "PRMIndividual",
    VRM: "vrmIndividual",
    IBAC: "ibacIndividual",
    MAB: "MABIndividual",
  };
  return routes[detector] || null;
};

// Sensor cell component
const Cell = ({ sensors }) => {
  const navigate = useNavigate();

  const handleClick = (sensor) => {
    const route = routeName(sensor.detector);
    if (route) {
      navigate(`/${route}?device_id=${sensor.device_id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#43A047"; // Green
      case "Fault":
        return "#FFD54F"; // Amber
      case "Inactive":
      case "Disconnected":
        return "rgb(128, 128, 128)"; // Full gray
      default:
        return "#F5F5F5"; // Fallback gray
    }
  };

  if (!sensors || sensors.length === 0)
    return <Box height={80} border="1px solid #eee" bgcolor="#F5F5F5" />;

  return (
    <Box
      border="1px solid #ccc"
      minHeight={80}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="stretch" // Important to make inner Boxes stretch full width
    >
      {sensors.map((sensor, idx) => {
        const icon = getSensorIcon(sensor.detector_type, sensor.status, sensor.alarm_status);
        const bgColor = getStatusColor(sensor.status);
        return (
          <Box
            key={idx}
            display="flex"
            alignItems="center"
            gap={0.5}
            width="100%"
            px={0.5}
            py={0.25}
            bgcolor={bgColor}
            sx={{ cursor: "pointer" }}
            onClick={() => handleClick(sensor)} // Pass current sensor
          >
            {icon && (
              <img
                src={icon}
                alt={sensor.detector_type}
                style={{
                  width: 18,
                  height: 18,
                  filter: "brightness(0) invert(1)",
                }}
              />
            )}
            <Typography variant="caption" color="#fff">
              {sensor.detector}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

// Main Grid Component
const FloorWiseStatusGrid = ({ sensorData }) => {
  const sensorMatrix = useMemo(() => {
    const matrix = {};
    sensorData.forEach((entry) => {
      const sensor = entry.s_no;
      const zoneLabel = `Zone ${sensor.zone}`;
      const location = sensor.location;
      if (!matrix[zoneLabel]) matrix[zoneLabel] = {};
      if (!matrix[zoneLabel][location]) matrix[zoneLabel][location] = [];
      matrix[zoneLabel][location].push(sensor);
    });
    return matrix;
  }, [sensorData]);

  const zones = useMemo(() => Object.keys(sensorMatrix).sort(), [sensorMatrix]);

  const locations = useMemo(() => {
    const locSet = new Set();
    zones.forEach((zone) => {
      Object.keys(sensorMatrix[zone]).forEach((loc) => locSet.add(loc));
    });
    return Array.from(locSet).sort();
  }, [zones, sensorMatrix]);

  return (
    <Box overflow="auto">
      {/* Header Row */}
      <Box display="grid" gridTemplateColumns={`150px repeat(${locations.length}, 1fr)`}>
        <Box />
        {locations.map((loc) => (
          <Box
            key={loc}
            p={1}
            border="1px solid #ccc"
            textAlign="center"
            bgcolor="#f5f5f5"
          >
            <Typography variant="subtitle2">{loc}</Typography>
          </Box>
        ))}
      </Box>

      {/* Zone Rows */}
      {zones.map((zone) => (
        <Box
          key={zone}
          display="grid"
          gridTemplateColumns={`150px repeat(${locations.length}, 1fr)`}>
          <Box p={1} border="1px solid #ccc" bgcolor="#f0f0f0">
            <Typography variant="subtitle2">{zone}</Typography>
          </Box>

          {locations.map((loc) => (
            <Cell key={`${zone}-${loc}`} sensors={sensorMatrix[zone]?.[loc] || []} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default FloorWiseStatusGrid;
