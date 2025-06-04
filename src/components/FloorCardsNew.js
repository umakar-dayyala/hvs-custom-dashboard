/** @jsxImportSource @emotion/react */
import React, { useState, useContext, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import ReactApexChart from "react-apexcharts";
import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import SunburstChart from  "../components/SunburstChart";
// Icons
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
import qrtIcon from "../assets/greyQRTvechicle.svg";
import labIcon from "../assets/greyLAB.svg";
import errorIcon from "../assets/error-circle.svg";
import checkIcon from "../assets/check-circle.svg";
import Horizontaldiv from "../components/HorizontalDivider";

const chartColors = ["#29991d", "RGB(128, 128,128)", "#ff9933", "red"];

const zoomBlinkAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`;

const FloorCards = ({ floorData }) => {
  const { setValue } = useContext(MyContext);
  const navigate = useNavigate();
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    const updatedColors = floorData.map((floor) => {
      const totalAlarms = (floor.biological_alarms ?? 0) + (floor.chemical_alarms ?? 0) + (floor.radiological_alarms ?? 0);
      const activeSensors = floor.activeSensors ?? 0;
      const totalSensors = floor.totalSensors ?? 0;
      const hasAlert = (floor.unhealthySensors ?? 0) > 0;
      if (totalAlarms > 0) return "#E30613";
      if (hasAlert) return "#ff9933";
      if (totalSensors === 0 || activeSensors === 0) return "RGB(128, 128,128)";
      return "#28A745";
    });

    setValue(updatedColors);
    const interval = setInterval(() => setChartKey((prevKey) => prevKey + 1), 20000);
    return () => clearInterval(interval);
  }, [floorData, setValue]);

  const goToFloor = (floor) => navigate("floorwise?floor=" + floor);
  console.log("Floor new Data:", floorData);

  return (
    <Box mt={2}>
      <Grid container spacing={4} justifyContent="center">
        {floorData.map((floor, index) => {
          const inActiveSensor = (floor.disconnected_sensors ?? 0) + (floor.inactiveSensors ?? 0);
          const totalAlarms = (floor.biological_alarms ?? 0) + (floor.chemical_alarms ?? 0) + (floor.radiological_alarms ?? 0);
          // const totalSensors = (floor.activeSensors ?? 0) + inActiveSensor + (floor.unhealthySensors ?? 0);
          //const totalSensors = (floor.totalSensors ?? 0) + inActiveSensor;
          const totalSensors = floor.totalSensors;

          const borderColor =
            totalAlarms > 0 ? "red" :
              floor.unhealthySensors > 0 ? "#ff9933" :
                inActiveSensor > 0 || floor.activeSensors === 0 || floor.totalSensors === 0
                  ? "RGB(128, 128,128)" : "#29991d";

          const bioIcon = floor.totalSensors === 0 ? greyBio :
            floor.biological_alarms > 0 ? alertBiological :
              inActiveSensor > 0 || floor.activeSensors === 0 ? greyBio : gBiological;

          const chemicalIcon = floor.totalSensors === 0 ? greyChemical :
            floor.chemical_alarms > 0 ? alertChemical :
              inActiveSensor > 0 || floor.activeSensors === 0 ? greyChemical : gChemical;

          const radioIcon = floor.totalSensors === 0 ? greyRadio :
            floor.radiological_alarms > 0 ? alertRadiation :
              inActiveSensor > 0 || floor.activeSensors === 0 ? greyRadio : gRadiation;

          const chartOptions = {
            chart: { type: "donut", toolbar: { show: false }, animations: { enabled: true } },
            labels: ["Healthy", "Inactive", "Unhealthy", "CBRN Alarms"],
            legend: { show: false },
            colors: chartColors,
            dataLabels: {
              enabled: true,
              formatter: (val, { seriesIndex }) => {
                const sensorCounts = [
                  floor.activeSensors ||0,
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
                  size: "65%",
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: "Total",
                      fontSize: "14px",
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

          const floorName = floor.floor?.toUpperCase() ?? "";
          const baseIcon = floorName.includes("QRT") ? qrtIcon : floorName.includes("LAB") ? labIcon : floorIcon;
          const isGrey = (floor.totalSensors ?? 0) === 0 || ((floor.activeSensors ?? 0) === 0 && inActiveSensor > 0);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
              <HvCard statusColor={borderColor} sx={{ width: "100%", height: "100%" }}>
                <Box p={2} backgroundColor="white" display="flex" flexDirection="column" height="100%">
                  <HvTypography variant="title3" fontWeight="bold" mb={1}>
                    {floorName}
                  </HvTypography>

                  <Box
                    // bgcolor={totalAlarms > 0 ? "#E30613" : "#28A745"}
                    bgcolor={ chartSeries.every(val => !val) ? "RGB(128, 128,128)": totalAlarms > 0 ? "#E30613" : "#28A745"}
                    color="white"
                    px={2}
                    py={1}
                    height={60}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                    mt={2}
                    mx={-2} // cancel horizontal padding

                  >
                    <HvTypography variant="caption" sx={{ color: "white" }}>
                      {totalAlarms > 0 ? `${totalAlarms} alarms detected` : "No alarms detected"}
                    </HvTypography>
                    <img src={totalAlarms > 0 ? errorIcon : checkIcon} width={16} height={16} alt="status" />
                  </Box>


                  <Box display="flex" justifyContent="center" alignItems="center" mb={2} sx={{ height: 160 }}>
                    {chartSeries.every(val => !val) ? (
                      <HvTypography variant="title4" color="textSecondary" mt={5}>
                        No sensors available to display
                      </HvTypography>
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                        <SunburstChart floorBasedData={floor}/>
                        {/* <ReactApexChart
                          key={chartKey}
                          options={chartOptions}
                          series={chartSeries}
                          type="donut"
                          width={140}
                          height={140}
                        />*/}
                        <Box ml={2}>
                          {["Healthy", "Inactive", "Unhealthy","CBRN Alarms"].map((label, i) => (
                            <Box display="flex" alignItems="center" key={label} mb={1}>
                              <Box width={12} height={12} borderRadius="50%" bgcolor={chartColors[i]} mr={1} />
                              <HvTypography variant="caption">{label}: {(chartSeries[i] || 0)}</HvTypography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>


                  <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" >
                    <Box display="flex" gap={4}>
                      {[chemicalIcon, bioIcon, radioIcon].map((icon, i) => (
                        <Box key={i} display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                          <img src={icon} width={20} height={20} />
                          <HvTypography variant="caption" style={{ fontWeight: 'bold', color: '#000' }}>
                            {[floor.chemical_alarms, floor.biological_alarms, floor.radiological_alarms][i] || 0}
                          </HvTypography>
                        </Box>
                      ))}
                    </Box>

                    <Box display="flex" flexDirection="row" alignItems="center" gap={5}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <HvTypography variant="caption" style={{ fontWeight: 'bold', color: '#000' }}>
                          Zones
                        </HvTypography>
                        <HvTypography variant="caption" style={{ fontWeight: 'bold', color: '#000' }}>
                          {floor.totalZones}
                        </HvTypography>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <HvTypography variant="caption" style={{ fontWeight: 'bold', color: '#000' }}>
                          Locations
                        </HvTypography>
                        <HvTypography variant="caption" style={{ fontWeight: 'bold', color: '#000' }}>
                          {floor.total_location || 0}
                        </HvTypography>
                      </Box>
                    </Box>

                  </Box>
                  <Horizontaldiv />
                  <Box display="flex" justifyContent="flex-end">
                    <Button

                      variant="contained"
                      sx={{
                        backgroundColor: "#0073E7",
                        border: "1px solid #146BD2",
                        color: "#fff",
                        textTransform: "none",
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
