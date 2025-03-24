/** @jsxImportSource @emotion/react */
import React, { useState, useContext, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import ReactApexChart from "react-apexcharts";
import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { Divider } from "@mui/material";


// Import SVG icons
import totalZoneIcon from "../assets/greyDirection.svg";
import floorIcon from "../assets/rJumpToFloor.svg";

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
      const hasAlert =
        (floor.unhealthySensors && floor.unhealthySensors > 0) ||
        (floor.totalAlarms && floor.totalAlarms > 0);
      return hasAlert ? "#E30613" : "#28A745";
    });

    setValue(updatedColors);

    // Refresh chart every 10 seconds to restart animation
    const interval = setInterval(() => {
      setChartKey((prevKey) => prevKey + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [floorData, setValue]);

  const goToFloor = (floor) => {
    navigate("floorwise?floor=" + floor);
  };

  return (
    <Box mt={2}>
      <Grid container spacing={8} justifyContent="center">
        {floorData.map((floor, index) => {
          const borderColor =
            floor.unhealthySensors > 0 || floor.totalAlarms > 0
              ? "#E30613"
              : "#28A745";

          // Calculate total sensors
          const totalSensors =
            (floor.activeSensors || 0) + (floor.inactiveSensors || 0);

          // Chart options
          const chartOptions = {
            chart: {
              type: "donut",
              animations: {
                enabled: true,
                easing: "linear",
                speed: 2000,
                animateGradually: { enabled: true, delay: 100 },
                dynamicAnimation: { enabled: true, speed: 2000 },
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
                  floor.inactiveSensors || 0,
                  floor.unhealthySensors || 0,
                  floor.totalAlarms || 0,
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
            floor.inactiveSensors || 0,
            floor.unhealthySensors || 0,
            floor.totalAlarms || 0,
          ];

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
              <HvCard statusColor={borderColor} sx={{ width: "100%", height: "100%" }}>
                <Box
                  p={2}
                  display="flex"
                  backgroundColor="white"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  {/* Floor Name with Icon */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} mb={2}>
                    <HvTypography
                      variant="title3"
                      style={{
                        fontWeight: "bold",
                        color: borderColor,
                      }}
                    >
                      {floor.floor.toUpperCase()}
                    </HvTypography>

                    {/* Floor Icon with Zoom & Blink Effect */}
                    <Box
                      component="img"
                      src={floorIcon}
                      alt="Floor Icon"
                      width={30}
                      height={30}
                      sx={{
                        marginLeft: 1,
                        filter: floor.totalAlarms === 0
                          ? "brightness(0) saturate(100%) invert(38%) sepia(75%) saturate(498%) hue-rotate(92deg) brightness(90%) contrast(95%)"
                          : "none",
                        animation: `${zoomBlinkAnimation} 1.5s infinite ease-in-out`,
                      }}
                    />
                  </Box>

                  {/* Donut Chart (ONLY the slices animate) */}
                  <Box display="flex" justifyContent="center" mt={1} mb={1} sx={{ width: "100%", height: "200px" }}>
                    <ReactApexChart
                      key={chartKey}
                      options={chartOptions}
                      series={chartSeries}
                      type="donut"
                      width="100%"
                      height={200}
                    />
                  </Box>

          {/* Total Detected Alarms Button */}
                  <Button
                    variant="contained"
                    sx={{
                      border: floor.totalAlarms > 0 ? "1px solid #E30613" : "1px solid #29991d",
                      backgroundColor: floor.totalAlarms > 0 ? "#E30613" : "#29991d",
                      color: "white",
                      textTransform: "none",
                      alignSelf: "center",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      animation: `${blinkAnimation} 1s infinite`,
                    }}
                  >
                    <span>Total Detected Alarms</span>
                    <span>{floor.totalAlarms || "00"}</span>
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
