import React, { useEffect, useMemo, useState } from "react";
import {
  HvCard,
  HvGrid,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Box, useTheme, useMediaQuery } from "@mui/material";

import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import OpacityIcon from "@mui/icons-material/Opacity";
import CompressIcon from "@mui/icons-material/Compress";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import locationImg from "../assets/location1.svg";
import WindRoseChart from "../components/WindRoseChart";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import GaugeChart from "react-gauge-chart";
import BreadCrumbsIndividual from "../components/BreadCrumbsIndividual";
import Alertbar from "../components/Alertbar";
import MemoGauge from "./MemoGauge";

/* ---------- static meta for each KPI ---------- */
const weatherMetaMap = {
  "Air Temperature (C)": {
    icon: <ThermostatIcon sx={{ color: "red", fontSize: 60 }} />,
    max: 50,
  },
  "Relative Humidity (%)": {
    icon: <WaterDropIcon sx={{ color: "skyblue", fontSize: 60 }} />,
    max: 100,
  },
  "Cumulative Rain (mm)": {
    icon: <OpacityIcon sx={{ color: "skyblue", fontSize: 60 }} />,
    max: 100,
  },
  "Pressure (hPa)": {
    icon: <CompressIcon sx={{ color: "skyblue", fontSize: 60 }} />,
    max: 1100,
  },
  "Solar radiation (wt per sqm)": {
    icon: <WbSunnyIcon color="warning" sx={{ fontSize: 60 }} />,
    max: 1000,
  },
};

const Weatherv2 = () => {
  const [locationDetails, setUpdatedLocationDetails] = useState({
    floor: "default",
    zone: "default",
    location: "default",
    sensorType: "default",
  });

  const [LastFetchLiveData, setLastFetchLiveData] = useState(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [kpiData, setKpiData] = useState({});
  const [dirData, setDirData] = useState([]);
  const [dataBuffer, setDataBuffer] = useState({});

  const deviceId = useMemo(
    () => new URLSearchParams(window.location.search).get("device_id"),
    []
  );

  const locationName = deviceId === "129" ? "IG 6" : "Tango";

  useEffect(() => {
    const smoothValue = (key, newValue, bufferSize = 5) => {
      const prev = dataBuffer[key] || [];
      const updated = [...prev, parseFloat(newValue)].slice(-bufferSize);
      const avg = updated.reduce((a, b) => a + b, 0) / updated.length;
      return [avg.toFixed(2), updated];
    };

    const es = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Live-weather error:", err);
        return;
      }

      const pkt = data.parametersData?.[0] ?? {};
      const rawKpiData = pkt.kpiData ?? {};
      const smoothedKpi = {};
      const newBuffer = { ...dataBuffer };

      for (const key in rawKpiData) {
        const val = rawKpiData[key];
        if (!isNaN(val) && val !== "") {
          const [avg, buffer] = smoothValue(key, val);
          smoothedKpi[key] = avg;
          newBuffer[key] = buffer;
        } else {
          smoothedKpi[key] = val;
        }
      }

      setDataBuffer(newBuffer);
      setKpiData(smoothedKpi);
      setDirData(pkt["Direction Data"] ?? []);
      if (data.lastfetched?.time) {
        setLastFetchLiveData(data.lastfetched.time);
      }
    });

    return () => es?.close();
  }, [deviceId, dataBuffer]);

  const setLocationDetails = (floor, zone, location, sensorType) => {
    setUpdatedLocationDetails({
      floor: floor || locationDetails.floor,
      zone: zone || locationDetails.zone,
      location: location || locationDetails.location,
      sensorType: sensorType || locationDetails.sensorType,
    });
  };

  const stats = useMemo(
    () =>
      Object.entries(kpiData).map(([label, value]) => {
        const meta = weatherMetaMap[label] || {};
        const num = parseFloat(value);
        return {
          label,
          value: String(value ?? "—"),
          icon: meta.icon,
          max: meta.max,
          numeric: isNaN(num) ? undefined : num,
        };
      }),
    [kpiData]
  );

  if (!stats.length) {
    return (
      <Box p={2}>
        <HvTypography variant="title3">Loading live weather…</HvTypography>
      </Box>
    );
  }

  const firstRow = stats.slice(0, 2);
  const secondRow = stats.slice(2, 5);

  return (
    <Box p={2} width="100%">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BreadCrumbsIndividual locationDetails={locationDetails} />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Box style={{ whiteSpace: "nowrap" }}>
            {LastFetchLiveData && (
              <span>Last Live Data fetched time: {LastFetchLiveData}</span>
            )}
          </Box>
        </div>
      </div>

      <Box mt={2}>
        <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} />
      </Box>

      <HvGrid container>
        <HvGrid item xs={12}>
          <HvCard
            sx={{
              width: "100%",
              borderRadius: 0,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, p: 1 }}>
              <img src={locationImg} alt="location" width={40} height={40} />
              <HvTypography variant="title3">{locationName}</HvTypography>
            </Box>

            {/* First Row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                p: 1,
                justifyContent: isXs ? "center" : "space-between",
              }}
            >
              {firstRow.map((s) => (
                <HvCard
                  key={s.label}
                  bgcolor="white"
                  style={{ flex: "1 1 330px", minWidth: 260 }}
                >
                  <Box m={2}>
                    <HvTypography variant="title3" mb={1}>
                      {s.label}
                    </HvTypography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {s.icon}
                        <HvTypography variant="title3" fontSize={30}>
                          {s.value}
                        </HvTypography>
                      </Box>
                      <Box sx={{ width: 180, height: 90 }}>
                       <MemoGauge
  id={`gauge-${s.label}`} // must be stable
  percent={s.numeric && s.max ? s.numeric / s.max : 0}
  colors={
    s.label.includes("Temperature")
      ? ["#87CEEB", "#00a6ff", "#FF0000"]
      : ["#87CEEB", "#00a6ff", "#1b00ff"]
  }
/>

{(s.label.includes("Temperature") || s.label.includes("Humidity")) && (
  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12px", px: 1, mt: "-8px" }}>
    <span>{s.label.includes("Temperature") ? "0°C" : "0%"}</span>
    <span>{s.label.includes("Temperature") ? `${s.max}°C` : `${s.max}%`}</span>
  </Box>
)}


                        
                      </Box>
                    </Box>
                  </Box>
                </HvCard>
              ))}
            </Box>

            {/* Second Row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                p: 1,
                justifyContent: isXs ? "center" : "space-between",
              }}
            >
              {secondRow.map((s) => (
                <HvCard
                  key={s.label}
                  bgcolor="white"
                  style={{ flex: "1 1 220px", minWidth: 180 }}
                >
                  <Box m={2}>
                    <HvTypography variant="title3" mb={1}>
                      {s.label}
                    </HvTypography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box mr={1}>{s.icon}</Box>
                      <HvTypography variant="title3" fontSize={30}>
                        {s.value}
                      </HvTypography>
                    </Box>
                  </Box>
                </HvCard>
              ))}
            </Box>
          </HvCard>
        </HvGrid>
      </HvGrid>

      {/* Wind Rose Chart */}
      <HvGrid container sx={{ mt: 2 }}>
        <HvGrid item xs={12}>
          <WindRoseChart data={dirData} />
        </HvGrid>
      </HvGrid>
    </Box>
  );
};

export default Weatherv2;
