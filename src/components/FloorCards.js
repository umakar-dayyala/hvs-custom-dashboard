/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect } from "react";
import { Box, Grid, Button, Divider } from "@mui/material";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import ReactApexChart from "react-apexcharts";
import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

// Import SVG icons
import totalSensorsIcon from "../assets/greyLocation.svg";
import totalZoneIcon from "../assets/greyDirection.svg";

// Fixed Chart Colors
const chartColors = ["#29991d", "RGB(128, 128,128)", "#ff9933"]; // Green, Red, Amber

// Blinking animation for alarms
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  30% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const FloorCards = ({ floorData }) => {
  const { value, setValue } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const updatedColors = floorData.map((floor) => {
      const hasAlert =
        (floor.unhealthySensors && floor.unhealthySensors > 0) ||
        (floor.totalAlarms && floor.totalAlarms > 0);
      return hasAlert ? "#E30613" : "#28A745";
    });

    setValue(updatedColors);
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

          // Calculate total sensors (sum of Active, Inactive, Faulty)
          const totalSensors =
            (floor.activeSensors || 0) +
            (floor.inactiveSensors || 0) +
            (floor.unhealthySensors || 0);

          // Chart options with fixed colors and sum in the center
          const chartOptions = {
            chart: { type: "donut" },
            labels: ["Active", "Inactive", "Faulty Sensors"],
            legend: { show: true, position: "bottom" },
            colors: chartColors, // Fixed Colors
            dataLabels: {
              enabled: true,
              formatter: (val, { seriesIndex }) => {
                // Show actual sensor counts instead of percentage
                const sensorCounts = [
                  floor.activeSensors || 0,
                  floor.inactiveSensors || 0,
                  floor.unhealthySensors || 0,
                ];
                return sensorCounts[seriesIndex] || 0; // Show actual count for each section
              },
            },
            plotOptions: {
              pie: {
                donut: {
                  size: "60%", // Controls the donut ring size
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: "Total",
                      fontSize: "16px",
                      color: "#000",
                      formatter: () => `${totalSensors}`, // Show total sensor count in center
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
          ];

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
              <HvCard statusColor={borderColor}>
                <Box
                  p={2}
                  display="flex"
                  backgroundColor="white"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  {/* Floor Name */}
                  <HvTypography
                    variant="title3"
                    style={{
                      fontWeight: "bold",
                      marginTop: 8,
                      color: borderColor,
                    }}
                  >
                    {floor.floor.toUpperCase()}
                  </HvTypography>

                  {/* Donut Chart */}
                  <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <ReactApexChart
                      options={chartOptions}
                      series={chartSeries}
                      type="donut"
                      width="100%"
                      height={200}
                    />
                  </Box>

                  {/* Total Zones and Sensors */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center">
                      <img
                        src={totalZoneIcon}
                        alt="Total Zone"
                        width={16}
                        height={16}
                      />
                      <HvTypography variant="body" ml={1}>
                        Total Zones: <strong>{floor.totalZones}</strong>
                      </HvTypography>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Divider
                    style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }}
                  />

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
                      animation: `${blinkAnimation} 1s infinite`, // Always apply blinking
                    }}
                  >
                    <span>Total Detected Alarms</span>
                    <span>{floor.totalAlarms || "00"}</span>
                  </Button>

                  {/* Go to Floor Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      marginTop: 12,
                      border: "1px solid #146BD2",
                      backgroundColor: "#0073E7",
                      textTransform: "none",
                      width: "124px",
                      height: "32px",
                      alignSelf: "flex-end",
                    }}
                    onClick={() => goToFloor(floor.floor)}
                  >
                    Go to Floor
                  </Button>
                </Box>
              </HvCard>
            </Grid>
          );
        })}
      </Grid>
      <Box mt={8} />
    </Box>
  );
};

export default FloorCards;
