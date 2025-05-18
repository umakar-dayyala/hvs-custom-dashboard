import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import gChemical from "../assets/gChemical.svg";
import gBiological from "../assets/gBiological.svg";
import gRadiation  from "../assets/gRadiological.svg";
import alertChemical   from "../assets/rChemical.svg";
import alertBiological from "../assets/rBiological.svg";
import alertRadiation  from "../assets/rRadiological.svg";
import greyBio     from "../assets/greyBio.svg";
import greyChemical from "../assets/greyChem.svg";
import greyRadio    from "../assets/greyRadio.svg";

/* ---------- helpers ---------- */
const getSensorIcon = (type, status, alarmStatus) => {
  if (status === "Inactive" || status === "Disconnected") {
    switch (type) {
      case "Chemical":   return greyChemical;
      case "Biological": return greyBio;
      case "Radiation":  return greyRadio;
      default:           return null;
    }
  }
  if (alarmStatus === "Alarm") {
    switch (type) {
      case "Chemical":   return alertChemical;
      case "Biological": return alertBiological;
      case "Radiation":  return alertRadiation;
      default:           return null;
    }
  }
  switch (type) {
    case "Chemical":   return gChemical;
    case "Biological": return gBiological;
    case "Radiation":  return gRadiation;
    default:           return null;
  }
};

const routeName = (detector) => ({
  AGM: "agmindividual",
  "AP4C-F": "AP4CIndividual",
  FCAD: "FCADIndividual",
  PRM: "PRMIndividual",
  VRM: "vrmIndividual",
  IBAC: "ibacIndividual",
  MAB: "MABIndividual",
}[detector] ?? null);

/* ---------- leaf cell ---------- */
const Cell = ({ sensors }) => {
  const navigate = useNavigate();

  const handleClick = (sensor) => {
    const route = routeName(sensor.detector);
    if (route) navigate(`/${route}?device_id=${sensor.device_id}`);
  };

  const statusColor = (status) => ({
    Active: "#43A047",
    Fault : "#FFD54F",
    Inactive: "rgb(128,128,128)",
    Disconnected: "rgb(128,128,128)",
  }[status] ?? "#F5F5F5");

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
          bgcolor={statusColor(s.status)}
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick(s)}
        >
          {getSensorIcon(s.detector_type, s.status, s.alarm_status) && (
            <img
              src={getSensorIcon(s.detector_type, s.status, s.alarm_status)}
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
      const loc  = sensor.location ?? "Unknown";
      m[zone]            ??= {};
      m[zone][loc]       ??= [];
      m[zone][loc].push(sensor);
    });
    return m;
  }, [safeData]);

  const zones = useMemo(() => Object.keys(sensorMatrix).sort(), [sensorMatrix]);

  const locations = useMemo(() => {
    const set = new Set();
    zones.forEach((z) => Object.keys(sensorMatrix[z]).forEach((l) => set.add(l)));
    return [...set].sort();
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
