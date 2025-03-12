import React from "react";
import { Box, Grid, Button, Divider } from "@mui/material";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";

// Import SVG icons
import totalZonesIcon from "../assets/greyDirection.svg";
import totalSensorsIcon from "../assets/greyLocation.svg";
import radiologicalIcon from "../assets/gRadiological.svg";
import biologicalIcon from "../assets/gBiological.svg";
import chemicalIcon from "../assets/gChemical.svg";
import jumpToFloor from "../assets/greyJumpToFloor.svg";

const FloorCards = ({ floorData }) => {
  return (
    <Box mt={2}>
      <Grid container spacing={8} justifyContent="center">
        {floorData.map((floor, index) => {
          // Determine the border color based on alerts
          const hasAlert =
            (floor.noOfIncidents && floor.noOfIncidents > 0) ||
            (floor.detectedAlarms && floor.detectedAlarms > 0) ||
            (floor.typeOfAlarms && floor.typeOfAlarms > 0);
          const borderColor = hasAlert ? "#E30613" : "#28A745"; // Red if alert, Green otherwise

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
              <HvCard
                style={{
                  borderTop: `4px solid ${borderColor}`, // Dynamic top border
                }}
              >
                <Box p={2} display="flex" backgroundColor="white" flexDirection="column" justifyContent="space-between" height="100%">
                  {/* Top Icons */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* Icons with Counts */}
                    <Box display="flex" alignItems="center">
                      {/* Radiological */}
                      <Box display="flex" alignItems="center" mr={1}>
                        <img src={radiologicalIcon} alt="Radiological" width={20} height={20} style={{ marginRight: "4px" }} />
                        <HvTypography variant="body" ml={0.5} style={{ fontWeight: "bold", color: "#414249" }}>
                          {floor.radiologicalCount || "00"}
                        </HvTypography>
                      </Box>

                      {/* Vertical Divider */}
                      <Divider orientation="vertical" flexItem style={{ backgroundColor: "#28A745", height: "20px", margin: "0 8px" }} />

                      {/* Biological */}
                      <Box display="flex" alignItems="center" mr={1}>
                        <img src={biologicalIcon} alt="Biological" width={20} height={20} style={{ marginRight: "4px" }} />
                        <HvTypography variant="body" ml={0.5} style={{ fontWeight: "bold", color: "#414249" }}>
                          {floor.biologicalCount || "00"}
                        </HvTypography>
                      </Box>

                      {/* Vertical Divider */}
                      <Divider orientation="vertical" flexItem style={{ backgroundColor: "#28A745", height: "20px", margin: "0 8px" }} />

                      {/* Chemical */}
                      <Box display="flex" alignItems="center">
                        <img src={chemicalIcon} alt="Chemical" width={20} height={20} style={{ marginRight: "4px" }} />
                        <HvTypography variant="body" ml={0.5} style={{ fontWeight: "bold", color: "#414249" }}>
                          {floor.chemicalCount || "00"}
                        </HvTypography>
                      </Box>
                    </Box>

                    {/* Jump to Floor */}
                    <img src={jumpToFloor} alt="Jump to Floor" width={24} height={24} />
                  </Box>


                  {/* Floor Name */}
                  <HvTypography variant="title3" style={{ fontWeight: "bold", marginTop: 8, color: "#2f2f2f" }}>
                    {floor.name.toUpperCase()}
                  </HvTypography>

                  {/* Total Zones and Total Sensors Row */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
                    <Box display="flex" alignItems="center">
                      <img src={totalZonesIcon} alt="Total Zones" width={16} height={16} />
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
                        <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                          Active <strong style={{ fontWeight: "bold" }}>{floor.activeSensors || "00"}</strong>
                        </HvTypography>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                      </Grid>

                      {/* Inactive */}
                      <Grid item xs={6}>
                        <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                          Inactive <strong style={{ fontWeight: "bold" }}>{floor.inactiveSensors || "00"}</strong>
                        </HvTypography>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                      </Grid>
                    </Grid>

                    <Divider style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }} />

                    {/* Row 2 - Unhealthy and Total Sensors */}
                    <Grid container spacing={2} mb={1}>
                      {/* Unhealthy */}
                      <Grid item xs={6}>
                        <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                          Unhealthy <strong style={{ fontWeight: "bold", color: "#E30613" }}>{floor.unhealthySensors || "00"}</strong>
                        </HvTypography>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                      </Grid>

                      {/* Total */}
                      <Grid item xs={6}>
                        <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                          Total <strong style={{ fontWeight: "bold" }}>{floor.totalSensors || "00"}</strong>
                        </HvTypography>
                        <HvTypography variant="caption1" style={{ color: "#9E9E9E" }}>Sensor</HvTypography>
                      </Grid>
                    </Grid>

                    <Divider style={{ backgroundColor: "#D1D5DB", margin: "8px 0" }} />

                    {/* Total Detected Alarms */}
                    <HvTypography variant="body" style={{ color: "#2F2F2F" }}>
                      Total Detected Alarms <strong style={{ fontWeight: "bold" }}>{floor.detectedAlarms || "00"}</strong>
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
