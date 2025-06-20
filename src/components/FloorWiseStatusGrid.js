import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import gChemical from "../assets/gChemical.svg";
import gBiological from "../assets/gBiological.svg";
import gRadiation from "../assets/gRadiological.svg";
import alertChemical from "../assets/rChemical.svg";
import alertBiological from "../assets/rBiological.svg";
import alertRadiation from "../assets/rRadiological.svg";
import greyBio from "../assets/greyBio.svg";
import greyChemical from "../assets/greyChem.svg";
import greyRadio from "../assets/greyRadio.svg";
import aBio from "../assets/aBiological.svg";
import aChemical from "../assets/aChemical.svg";
import aRadiation from "../assets/aRadiological.svg";
import aOxygen from "../assets/aOxygen.svg";
import aWeather from "../assets/aWeather.svg";
import gOxygen from "../assets/gOxygen.svg";
import gWeather from "../assets/gWeather.svg";
import alertOxygen from "../assets/rOxygen.svg";
import alertWeather from "../assets/rWeather.svg";
import greyOxygen from "../assets/gyOxygen.svg";
import greyWeather from "../assets/gyWeather.svg";
import { getMABDeviceId } from "../service/summaryServices";
import { routeName } from "../utils/RouteUtils";

/* ---------- helpers ---------- */
const getSensorIcon = (type, status, alarmStatus, detector) => {
  console.log(alarmStatus);
  if (alarmStatus === "Alarm") {
    console.log("Alarm   " + type);
    if (type === "Generic") {
      switch (detector) {
        case "Oxygen": return alertOxygen;
        case "Weather": return alertWeather;
        default: return null;
      }
    }
    switch (type) {
      case "Chemical": return alertChemical;
      case "Biological": return alertBiological;
      case "Radiation": return alertRadiation;
      default: return null;
    }
  }
  if (status === "Inactive" || status === "Disconnected") {
    if (type === "Generic") {
      switch (detector) {
        case "Oxygen": return greyOxygen;
        case "Weather": return greyWeather;
        default: return null;
      }
    }
    switch (type) {
      case "Chemical": return greyChemical;
      case "Biological": return greyBio;
      case "Radiation": return greyRadio;
      default: return null;
    }
  }
  if (status === "Fault") {
    if (type === "Generic") {
      switch (detector) {
        case "Oxygen": return aOxygen;
        case "Weather": return aWeather;
        default: return null;
      }
    }
    switch (type) {
      case "Chemical": return aChemical;
      case "Biological": return aBio;
      case "Radiation": return aRadiation;
      default: return null;
    }
  }
  if (type === "Generic") {
    switch (detector) {
      case "Oxygen": return gOxygen;
      case "Weather": return gWeather;
      default: return null;
    }
  }
  switch (type) {
    case "Chemical": return gChemical;
    case "Biological": return gBiological;
    case "Radiation": return gRadiation;
    default: return null;
  }
};

/* ---------- leaf cell ---------- */
const Cell = ({ sensors }) => {
  const navigate = useNavigate();

  // const handleClick = (sensor) => {
  //   const route = routeName(sensor.detector);
  //   if (route) navigate(`/${route}?device_id=${sensor.device_id}`);
  // };
  const handleClick = async (sensor) => {
    if (sensor.detector === "ASM") {
      const mabDeviceId = await getMABDeviceId(sensor.device_id);
      if (mabDeviceId) {
        navigate(`/MABIndividual?device_id=${mabDeviceId}`);
      } else {
        console.warn("No MAB found for ASM device:", sensor.device_id);
        // Optional: Show a toast/snackbar to user
      }
    } else {
      const route = routeName(sensor.detector);
      if (route) {
        navigate(`/${route}?device_id=${sensor.device_id}`);
      }
    }
  };

  const statusColor = (status, alarm_status) => {
    if (alarm_status === "Alarm") {
      return "#FF0000"; // or "#FF0000" if you want hex
    }

    const colors = {
      Active: "#43A047",          // green
      Fault: "#FFD54F",           // yellow
      Inactive: "rgb(128,128,128)",
      Disconnected: "rgb(128,128,128)",
    };

    return colors[status] ?? "#F5F5F5"; // default fallback color
  };


  if (!sensors?.length)
    return <Box height={80} border="1px solid #eee" bgcolor="#F5F5F5" />;

  return (
    <Box
      border="1px solid #ccc"
      minHeight={80}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {sensors.map((s, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          gap={0.5}
          width="100%"
          px={0.5}
          py={0.25}
          bgcolor={statusColor(s.status, s.alarm_status)}
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick(s)}
        >
          {getSensorIcon(s.detector_type, s.status, s.alarm_status, s.detector) && (
            <img
              src={getSensorIcon(s.detector_type, s.status, s.alarm_status, s.detector)}
              alt={s.detector_type}
              style={{ width: 18, height: 18, filter: "brightness(0) invert(1)" }}
            />
          )}
          <Typography variant="caption" color="#fff">
            {s.detector}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

/* ---------- main grid ---------- */
const FloorWiseStatusGrid = ({ sensorData }) => {
  /* ✅ normalize immediately */
  const safeData = Array.isArray(sensorData) ? sensorData : [];

  /* build a { "Zone n": { location: [sensors] } } matrix */
  const sensorMatrix = useMemo(() => {
    const m = {};
    safeData.forEach(({ s_no: sensor = {} }) => {
      const zone = `Zone ${sensor.zone ?? "?"}`;
      const loc = sensor.location ?? "Unknown";
      m[zone] ??= {};
      m[zone][loc] ??= [];
      m[zone][loc].push(sensor);
    });
    return m;
  }, [safeData]);

  const zones = useMemo(() => Object.keys(sensorMatrix).sort(), [sensorMatrix]);

  const locations = useMemo(() => {
    const seen = new Set();
    const ordered = [];
  
    zones.forEach((zone) => {
      Object.keys(sensorMatrix[zone]).forEach((loc) => {
        if (!seen.has(loc)) {
          seen.add(loc);
          ordered.push(loc);
        }
      });
    });
  
    return ordered;
  }, [zones, sensorMatrix]);  

  return (
    <Box overflow="auto">
      {/* header row */}
      <Box display="grid" gridTemplateColumns={`150px repeat(${locations.length},1fr)`}>
        <Box />{/* empty corner */}
        {locations.map((loc) => (
          <Box key={loc} p={1} border="1px solid #ccc" textAlign="center" bgcolor="#f5f5f5">
            <Typography variant="subtitle2">{loc}</Typography>
          </Box>
        ))}
      </Box>

      {/* zone rows */}
      {zones.map((zone) => (
        <Box key={zone} display="grid" gridTemplateColumns={`150px repeat(${locations.length},1fr)`}>
          <Box p={1} border="1px solid #ccc" bgcolor="#f0f0f0">
            <Typography variant="subtitle2">{zone}</Typography>
          </Box>
          {locations.map((loc) => (
            <Cell key={`${zone}-${loc}`} sensors={sensorMatrix[zone]?.[loc] ?? []} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default FloorWiseStatusGrid;
