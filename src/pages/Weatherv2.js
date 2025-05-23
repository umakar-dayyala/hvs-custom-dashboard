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

import locationImg from "../assets/location.png";
import WindRoseChart from "../components/WindRoseChart";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import GaugeChart from "react-gauge-chart";
import BreadCrumbsIndividual from "../components/BreadCrumbsIndividual";
import Alertbar from "../components/Alertbar";

/* ---------- static meta for each KPI ---------- */
const weatherMetaMap = {
  "Air Temperature": {
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
  Pressure: {
    icon: <CompressIcon sx={{ color: "skyblue", fontSize: 60 }} />,
    max: 1100,
  },
  "Solar radiation": {
    icon: <WbSunnyIcon color="warning" sx={{ fontSize: 60 }} />,
    max: 1000,
  },
};

const Weatherv2 = () => {

  const [locationDetails, setUdatedLocationDetails] = useState({
        floor: 'default',
        zone: 'default',
        location: 'default',
        sensorType: 'default'
      });

  const [LastFetchLiveData, setLastFetchLiveData] = useState(null);

  /* ---------- inside component ---------- */
const deviceId = new URLSearchParams(window.location.search).get("device_id");

/* pick the title based on deviceId */
const locationName = deviceId === "129" ? "IG 6" : "Tango";

  /* ---------- ALWAYS declare hooks first ---------- */
  const theme = useTheme();                                    // Hook #1
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));   // Hook #2

  const [kpiData, setKpiData] = useState({});                 // Hook #3
  const [dirData, setDirData] = useState([]);                 // Hook #4

  /* ---------- SSE subscription ---------- */
  useEffect(() => {
    const deviceId = new URLSearchParams(window.location.search).get("device_id");

    const es = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Live-weather error:", err);
        return;
      }
      const pkt = data.parametersData?.[0] ?? {};
      setKpiData(pkt.kpiData ?? {});
      setDirData(pkt["Direction Data"] ?? []);
      setLastFetchLiveData(pkt.lastfetched.time); 
    });

    return () => es?.close();
  }, []);     
  
  const setLocationDetails=(floor,zone,location,sensorType) => {
    setUdatedLocationDetails({
      floor: floor || locationDetails.floor,
      zone: zone || locationDetails.zone,
      location: location || locationDetails.location,
      sensorType: sensorType || locationDetails.sensorType
    });
    
  }// Hook #5

  /* ---------- convert kpiData ➜ array ---------- */
  const stats = useMemo(                                       // Hook #6
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

  /* ---------- EARLY RETURN (after hooks) ---------- */
  if (!stats.length) {
    return (
      <Box p={2}>
        <HvTypography variant="title3">Loading live weather…</HvTypography>
      </Box>
    );
  }

  /* ---------- split KPI tiles ---------- */
  const firstRow = stats.slice(0, 2);
  const secondRow = stats.slice(2, 5);

  /* ---------- RENDER ---------- */
  return (
    <Box p={2} width="100%">
      {/* ----- IG-6 Weather Card (full-width) ----- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BreadCrumbsIndividual locationDetails={locationDetails}/>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Box style={{ whiteSpace: "nowrap" }}>
            {LastFetchLiveData && (
              <span>Last Live Data fetched time: {LastFetchLiveData}</span>
            )}
          </Box>
          
        </div>
        
      </div>
      <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} />
      <HvGrid container>
        <HvGrid item xs={12}>
          <HvCard
            style={{
              width: "100%",
              borderRadius: 0,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            {/* header */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, p: 1 }}>
  <img src={locationImg} alt="location" width={40} height={40} />
  <HvTypography variant="title3">{locationName}</HvTypography>   {/* ← use it here */}
</Box>


            {/* first row (temp + humidity) */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                p: 1,
                justifyContent: isXs ? "center" : "space-between",
              }}
            >
              {firstRow.map((s, i) => (
                <HvCard
                  key={i}
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
                      <Box sx={{ width: 180, height: 70 }}>
                        <GaugeChart
                          id={`g${i}`}
                          nrOfLevels={3}
                          percent={s.numeric / s.max}
                          colors={
                            s.label === "Air Temperature"
                              ? ["#87CEEB", "#ff9300", "#FF0000"]
                              : ["#87CEEB", "#00a6ff", "#1b00ff"]
                          }
                          arcWidth={0.3}
                          textColor="#000"
                          animate
                          formatTextValue={() => ""}
                        />
                      </Box>
                    </Box>
                  </Box>
                </HvCard>
              ))}
            </Box>

            {/* second row (rain, pressure, solar) */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                p: 1,
                justifyContent: isXs ? "center" : "space-between",
              }}
            >
              {secondRow.map((s, i) => (
                <HvCard
                  key={i}
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

      {/* ----- Wind-rose (full-width) ----- */}
      <HvGrid container sx={{ mt: 2 }}>
        <HvGrid item xs={12}>
          <WindRoseChart data={dirData} />
        </HvGrid>
      </HvGrid>
    </Box>
  );
};

export default Weatherv2;
