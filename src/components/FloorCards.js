import React, { useContext, useEffect } from "react";
import { Box, Grid, Button, Divider } from "@mui/material";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import ReactApexChart from "react-apexcharts";
import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";

// Import SVG icons
import totalSensorsIcon from "../assets/greyLocation.svg";
import totalZoneIcon from "../assets/greyDirection.svg";
import jumpToFloor from "../assets/greyJumpToFloor.svg";

// Chart Colors
const chartColors = ["#28A745", "#ff9933", "#E30613"]; // Active, Inactive, Unhealthy

const FloorCards = ({ floorData }) => {
  const { value, setValue } = useContext(MyContext);

  useEffect(() => {
    const updatedColors = floorData.map((floor) => {
      const hasAlert =
        (floor.unhealthySensors && floor.unhealthySensors > 0) ||
        (floor.totalAlarms && floor.totalAlarms > 0);
      return hasAlert ? "#E30613" : "#28A745";
    });

    setValue(updatedColors);
  }, [floorData, setValue]);

  const navigate = useNavigate();
  const goToFloor = (floor) => {
    navigate("floorwise?floor=" + floor);
  };

  return (
    <Box mt={2}>
      <Grid container spacing={8} justifyContent="center">
        {floorData.map((floor, index) => {
          const borderColor = floor.unhealthySensors > 0 || floor.totalAlarms > 0 ? "#E30613" : "#28A745";

          const chartOptions = {
            chart: { type: "donut" },
            labels: ["Active", "Inactive", "Unhealthy"],
            legend: { show: true, position: "bottom" },
            colors: chartColors,
            dataLabels: { enabled: false },
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
                  <HvTypography variant="title3" style={{ fontWeight: "bold", marginTop: 8, color: borderColor }}>
                    {floor.floor.toUpperCase()}
                  </HvTypography>

                  {/* Donut Chart */}
                  <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <ReactApexChart options={chartOptions} series={chartSeries} type="donut" width="100%" height={200} />
                  </Box>

                  {/* Total Zones and Sensors */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <img src={totalZoneIcon} alt="Total Zone" width={16} height={16} />
                      <HvTypography variant="body" ml={1}>
                        Total Zones: <strong>{floor.totalZones}</strong>
                      </HvTypography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <img src={totalSensorsIcon} alt="Total Sensors" width={16} height={16} />
                      <HvTypography variant="body" ml={1}>
                        Total Sensors: <strong>{floor.totalSensors}</strong>
                      </HvTypography>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Divider style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }} />

                  {/* Total Detected Alarms */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                      Total Detected Alarms
                    </HvTypography>
                    <HvTypography variant="body" style={{ fontWeight: "bold", color: borderColor }}>
                      {floor.totalAlarms || "00"}
                    </HvTypography>
                  </Box>

                  {/* Button */}
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
