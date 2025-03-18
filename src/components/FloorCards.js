import React, {  use, useContext, useEffect } from "react";
import { Box, Grid, Button, Divider } from "@mui/material";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";


// Import SVG icons
import rtotalZonesIcon from "../assets/rJumpToFloor.svg";
import totalSensorsIcon from "../assets/greyLocation.svg";
import radiologicalIcon from "../assets/gRadiological.svg";
import biologicalIcon from "../assets/gBiological.svg";
import chemicalIcon from "../assets/gChemical.svg";
import totalZoneIcon from "../assets/greyDirection.svg";

import alertradiologicalIcon from "../assets/rRadiological.svg";
import alertbiologicalIcon from "../assets/rBiological.svg";
import alertchemicalIcon from "../assets/rChemical.svg";

import jumpToFloor from "../assets/greyJumpToFloor.svg";

import { MyContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";



const FloorCards = ({ floorData }) => {
  const { value, setValue } = useContext(MyContext);

  // Update global state whenever floorData changes
  useEffect(() => {
    const updatedColors = floorData.map((floor) => {
      const hasAlert =
        (floor.unhealthySensors && floor.unhealthySensors > 0) ||
        (floor.totalAlarms && floor.totalAlarms > 0) ||
        (floor.biologicalAlerts && floor.biologicalAlerts > 0) ||
        (floor.chemicalAlerts && floor.chemicalAlerts > 0) ||
        (floor.radiologicalAlerts && floor.radiologicalAlerts > 0);

      return hasAlert ? "#E30613" : "#28A745";
    });

    // Set the global state with the updated colors
    setValue(updatedColors);
  }, [floorData, setValue]);

  const navigate = useNavigate();

  const goToFloor = (floor) => {
    navigate("floorwise?floor="+floor);
  }


  return (
    <Box mt={2}>
      <Grid container spacing={8} justifyContent="center">
        {floorData.map((floor, index) => {
          // Determine the border color based on alerts
          const sensorTypeAlertBio = floor.biologicalAlerts && floor.biologicalAlerts > 0;
          const bioicon = sensorTypeAlertBio ? alertbiologicalIcon : biologicalIcon;
          const sensorTypeAlertChem = floor.chemicalAlerts && floor.chemicalAlerts > 0;
          const chemicon = sensorTypeAlertChem ? alertchemicalIcon : chemicalIcon;
          const sensorTypeAlertRad = floor.radiologicalAlerts && floor.radiologicalAlerts > 0;
          const radicon = sensorTypeAlertRad ? alertradiologicalIcon : radiologicalIcon;

          const hasAlert =
            (floor.unhealthySensors && floor.unhealthySensors > 0) ||
            (floor.totalAlarms && floor.totalAlarms > 0);
          const borderColor = hasAlert ? "#E30613" : "#28A745"; // Red if alert, Green otherwise

          const totalAlarms = floor.totalAlarms;
          const fontColor = totalAlarms ? "#E30613" : "#2F2F2F";

          const unhealthySensors = floor.unhealthySensors && floor.unhealthySensors > 0;
          const fontColorUS = unhealthySensors ? "#E30613" : "#2F2F2F";

          const jumpToFloorIcon =
            hasAlert || sensorTypeAlertBio || sensorTypeAlertChem || sensorTypeAlertRad
              ? rtotalZonesIcon
              : jumpToFloor;

          const titleFontColor =
            hasAlert || sensorTypeAlertBio || sensorTypeAlertChem || sensorTypeAlertRad
              ? "#E30613"
              : "#2F2F2F";

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
                  {/* Top Icons */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* Icons with Counts */}
                    <Box display="flex" alignItems="center">
                      {/* Radiological */}
                      <Box display="flex" alignItems="center" mr={1}>
                        <img src={radicon} alt="Radiological" width={20} height={20} style={{ marginRight: "4px" }} />
                        <HvTypography variant="body" ml={0.5} style={{ fontWeight: "bold", color: "#414249" }}>
                          {floor.radiologicalAlerts || "00"}
                        </HvTypography>
                      </Box>

                      {/* Vertical Divider */}
                      <Divider orientation="vertical" flexItem style={{ backgroundColor: "#D1D5DB", height: "20px", margin: "0 8px" }} />

                      {/* Biological */}
                      <Box display="flex" alignItems="center" mr={1}>
                        <img src={bioicon} alt="Biological" width={20} height={20} style={{ marginRight: "4px" }} />
                        <HvTypography variant="body" ml={0.5} style={{ fontWeight: "bold", color: "#414249" }}>
                          {floor.biologicalAlerts || "00"}
                        </HvTypography>
                      </Box>

                      {/* Vertical Divider */}
                      <Divider orientation="vertical" flexItem style={{ backgroundColor: "#D1D5DB", height: "20px", margin: "0 8px" }} />

                      {/* Chemical */}
                      <Box display="flex" alignItems="center">
                        <img src={chemicon} alt="Chemical" width={20} height={20} style={{ marginRight: "4px" }} />
                        <HvTypography variant="body" ml={0.5} style={{ fontWeight: "bold", color: "#414249" }}>
                          {floor.chemicalAlerts || "00"}
                        </HvTypography>
                      </Box>
                    </Box>

                    {/* Jump to Floor */}
                    <img src={jumpToFloorIcon} alt="Jump to Floor" width={24} height={24} />
                  </Box>

                  {/* Floor Name */}
                  <HvTypography variant="title3" style={{ fontWeight: "bold", marginTop: 8, color: titleFontColor }}>
                    {floor.floor.toUpperCase()}
                  </HvTypography>

                  {/* Total Zones and Total Sensors Row */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
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

                  {/* Details Section */}
                  <Box>
                    {/* Row 1 - Active and Inactive Sensors */}
                    <Grid container spacing={2} mb={1}>
                      {/* Active */}
                      <Grid item xs={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                            Active
                          </HvTypography>
                          <HvTypography variant="body" style={{ fontWeight: "bold", color: "#2F2F2F" }}>
                            {floor.activeSensors || "00"}
                          </HvTypography>
                        </Box>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                        <Divider style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }} />
                      </Grid>

                      {/* Inactive */}
                      <Grid item xs={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                            Inactive
                          </HvTypography>
                          <HvTypography variant="body" style={{ fontWeight: "bold", color: "#2F2F2F" }}>
                            {floor.inactiveSensors || "00"}
                          </HvTypography>
                        </Box>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                        <Divider style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }} />
                      </Grid>
                    </Grid>

                    {/* Row 2 - Unhealthy and Total Sensors */}
                    <Grid container spacing={2} mb={1}>
                      {/* Unhealthy */}
                      <Grid item xs={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                            Unhealthy
                          </HvTypography>
                          <HvTypography variant="body" style={{ fontWeight: "bold", color: fontColorUS }}>
                            {floor.unhealthySensors || "00"}
                          </HvTypography>
                        </Box>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                      </Grid>

                      {/* Total */}
                      <Grid item xs={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                            Total
                          </HvTypography>
                          <HvTypography variant="body" style={{ fontWeight: "bold", color: "#2F2F2F" }}>
                            {floor.totalSensors || "00"}
                          </HvTypography>
                        </Box>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                      </Grid>
                    </Grid>

                    <Divider style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }} />

                    {/* Total Detected Alarms */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                        Total Detected Alarms
                      </HvTypography>
                      <HvTypography variant="body" style={{ fontWeight: "bold", color: fontColor }}>
                        {floor.totalAlarms || "00"}
                      </HvTypography>
                    </Box>
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
    </Box>
  );
};

export default FloorCards;