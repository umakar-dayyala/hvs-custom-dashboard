/** @jsxImportSource @emotion/react */
import React, { useState, useContext, useEffect } from "react";
import { Box, Grid, Button, Divider } from "@mui/material";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import ReactApexChart from "react-apexcharts";
import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

// Import SVG icons
import totalZoneIcon from "../assets/greyDirection.svg";
import floorIcon from "../assets/rJumpToFloor.svg";
import gChemical from "../assets/gChemical.svg";
import gBiological from "../assets/gBiological.svg";
import gRadiation from "../assets/gRadiological.svg";
import alertChemical from "../assets/rChemical.svg";
import alertBiological from "../assets/rBiological.svg";
import alertRadiation from "../assets/rRadiological.svg";
import greyBio from "../assets/greyBio.svg";
import greyChemical from "../assets/greyChem.svg";
import greyRadio from "../assets/greyRadio.svg";
import greyFloorIcon from "../assets/greyJumpToFloor.svg";
import unhealthyBio from "../assets/aBiological.svg";
import unhealthyChemical from "../assets/aChemical.svg";
import unhealthyRadio from "../assets/aRadiological.svg";


// Fixed Chart Colors
const chartColors = ["#29991d", "RGB(128, 128,128)", "#ff9933", "red"];

// Blinking animation for alarms
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  30% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Keyframes for zoom-out and blink effect on the floor icon
const zoomBlinkAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`;

const FloorCards = ({ floorData }) => {
  const { value, setValue } = useContext(MyContext);
  const navigate = useNavigate();
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    const updatedColors = floorData.map((floor) => {
      const totalAlarms = floor.biological_alarms + floor.chemical_alarms + floor.radiological_alarms;
      const hasAlert = (totalAlarms && totalAlarms > 0);
      return hasAlert ? "#E30613" : "#28A745";
    });

    setValue(updatedColors);

    // Refresh chart every 20 seconds to restart animation
    const interval = setInterval(() => {
      setChartKey((prevKey) => prevKey + 1);
    }, 20000);

    return () => clearInterval(interval);
  }, [floorData, setValue]);

  const goToFloor = (floor) => {
    navigate("floorwise?floor=" + floor);
  };

  return (
    <Box mt={2}>
      <Grid container spacing={8} justifyContent="center">
        {floorData.map((floor, index) => {
          const inActiveSensor = floor.disconnected_sensors + floor.inactiveSensors;
          // Calculate the total alarms for the current floor
          const totalAlarms = floor.biological_alarms + floor.chemical_alarms + floor.radiological_alarms;
          const borderColor =
          totalAlarms > 0
          ? "red"  // Red for alarms
          : floor.unhealthySensors > 0
          ? "#ff9933"  // Amber for unhealthy sensors
          : inActiveSensor > 0 || floor.activeSensors === 0
          ? "RGB(128, 128,128)"  // Grey for inactive sensors
          : floor.totalSensors === 0
          ? "RGB(128, 128,128)" 
          : "#29991d";

          const bioIcon =
          floor.totalSensors === 0
            ? greyBio
            : floor.biological_alarms > 0
            ? alertBiological
            : floor.unhealthySensors > 0
            ? unhealthyBio
            : inActiveSensor > 0 || floor.activeSensors === 0
            ? greyBio
            : gBiological;
        
        const chemicalIcon =
          floor.totalSensors === 0
            ? greyChemical
            : floor.chemical_alarms > 0
            ? alertChemical
            : floor.unhealthySensors > 0
            ? unhealthyChemical
            : inActiveSensor > 0 || floor.activeSensors === 0
            ? greyChemical
            : gChemical;
        
        const radioIcon =
          floor.totalSensors === 0
            ? greyRadio
            : floor.radiation_alarms > 0
            ? alertRadiation
            : floor.unhealthySensors > 0
            ? unhealthyRadio
            : inActiveSensor > 0 || floor.activeSensors === 0
            ? greyRadio
            : gRadiation;  

          const totalSensors = floor.totalSensors || 0;
            //(floor.activeSensors || 0) + (inActiveSensor || 0) + (floor.unhealthySensors);

          const chartOptions = {
            chart: {
              type: "donut",
              animations: {
                enabled: true,
                easing: "linear",
                speed: 2000,
              },
              toolbar: { show: false },
            },
            labels: ["Active", "Inactive", "Unhealthy Sensors", "CBRN Alarms"],
            legend: { show: true, position: "bottom" },
            colors: chartColors,
            dataLabels: {
              enabled: true,
              formatter: (val, { seriesIndex }) => {
                const sensorCounts = [
                  floor.activeSensors || 0,
                  inActiveSensor || 0,
                  floor.unhealthySensors || 0,
                  totalAlarms || 0,
                ];
                return sensorCounts[seriesIndex] || 0;
              },
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "60%",
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: "Total",
                      fontSize: "12px",
                      color: "#000",
                      formatter: () => `${totalSensors}`,
                    },
                  },
                },
              },
            },
          };

          const chartSeries = [
            floor.activeSensors || 0,
            inActiveSensor || 0,
            floor.unhealthySensors || 0,
            totalAlarms || 0,
          ];

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
              <HvCard statusColor={borderColor} sx={{ width: "100%", height: "100%" }}>
                <Box p={2} display="flex" backgroundColor="white" flexDirection="column" height="100%">

                  {/* Alert Icons with Counts and Separators */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" gap={2} alignItems="center">
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <img src={chemicalIcon} alt="Chemical Alert" width={24} height={24} />
                        <HvTypography variant="caption" fontWeight="bold" color="black" ml={1}>
                          {floor.chemical_alarms || 0}
                        </HvTypography>
                      </Box>

                      <HvTypography variant="caption" mx={1}>|</HvTypography>

                      <Box display="flex" alignItems="center" gap={1.5}>
                        <img src={bioIcon} alt="Biological Alert" width={24} height={24} />
                        <HvTypography variant="caption" fontWeight="bold" color="black" ml={1}>
                          {floor.biological_alarms || 0}
                        </HvTypography>
                      </Box>

                      <HvTypography variant="caption" mx={1}>|</HvTypography>

                      <Box display="flex" alignItems="center" gap={1.5}>
                        <img src={radioIcon} alt="Radiation Alert" width={24} height={24} />
                        <HvTypography variant="caption" fontWeight="bold" color="black" ml={1}>
                          {floor.radiological_alarms || 0}
                        </HvTypography>
                      </Box>
                    </Box>

                    <Box
                      component="img"
                      src={
                        (floor.totalSensors ?? 0) === 0 || ((floor.activeSensors ?? 0) === 0 && (inActiveSensor ?? 0) > 0)
                          ? greyFloorIcon
                          : floorIcon
                      }
                      alt="Floor Icon"
                      width={30}
                      height={30}
                      sx={{
                        marginLeft: 1,
                        filter: totalAlarms === 0 && ((floor.totalSensors ?? 0) !== 0 && (floor.activeSensors ?? 0) > 0 )
                          ? "brightness(0) saturate(100%) invert(38%) sepia(75%) saturate(498%) hue-rotate(92deg) brightness(90%) contrast(95%)"
                          : "none",
                        animation: totalAlarms > 0 ? `${zoomBlinkAnimation} 1.5s infinite ease-in-out` : "none",
                      }}
                    />

                  </Box>

                  {/* Floor Name */}
                  <HvTypography variant="title3" style={{ fontWeight: "bold" }}>
                    {floor.floor.toUpperCase()}
                  </HvTypography>

                  {/* Donut Chart */}
                  <Box display="flex" justifyContent="center" mt={1} mb={1} sx={{ width: "100%", height: "200px" }}>
                    {/* Check if all values in chartSeries are 0, undefined, or null */}
                    {chartSeries.every((value) => value === 0 || value === undefined || value === null) ? (
                      <Box mt={10}>
                        <HvTypography variant="body2" color="textSecondary">
                          No sensors available to display
                        </HvTypography>
                      </Box>
                    ) : (
                      <ReactApexChart
                        key={chartKey}
                        options={chartOptions}
                        series={chartSeries}
                        type="donut"
                        width="100%"
                        height={200}
                      />
                    )}
                  </Box>

                  {/* Total Detected Alarms Button */}
                  <Button
                    variant="contained"
                    sx={{
                      border: totalAlarms > 0 ? "1px solid #E30613" : "1px solid #29991d",
                      backgroundColor: totalAlarms > 0 ? "#E30613" : "#29991d",
                      color: "white",
                      textTransform: "none",
                      alignSelf: "center",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      animation: totalAlarms > 0 ? `${blinkAnimation} 1s infinite` : "none",
                    }}
                  >
                    <span>Total Detected Alarms</span>
                    <span>{totalAlarms|| "00"}</span>
                  </Button>

                  {/* Divider */}
                  <Divider style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }} />

                  {/* Total Zones and Go to Floor Button in One Line */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    {/* Total Zones */}
                    <Box display="flex" alignItems="center">
                      <img src={totalZoneIcon} alt="Total Zone" width={16} height={16} />
                      <HvTypography variant="body" ml={1}>
                        Total Zones: <strong>{floor.totalZones}</strong>
                      </HvTypography>
                    </Box>

                    {/* Go to Floor Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        border: "1px solid #146BD2",
                        backgroundColor: "#0073E7",
                        textTransform: "none",
                        width: "124px",
                        height: "32px",
                      }}
                      onClick={() => goToFloor(floor.floor)}
                    >
                      Go to Floor
                    </Button>

                  </Box>

                </Box>
              </HvCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default FloorCards;
