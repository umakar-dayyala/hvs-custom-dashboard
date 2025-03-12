import React from "react";
import { HvCard, HvCardHeader, HvCardContent,  HvTypography, HvButton, HvBox, HvDot } from "@hitachivantara/uikit-react-core";
import { AppBar, Toolbar, Tabs, Tab, Grid, Paper } from "@mui/material";

const FloorCard = ({ title, totalZones, totalSensors, incidents, detectedAlarms, unhealthySensors, isActive }) => {
  return (
    <HvCard style={{ width: 250, margin: "10px" }}>
      <HvCardHeader title={title} />
      <HvCardContent>
        <HvTypography variant="label">Total Zones: {totalZones}</HvTypography>
        <HvTypography variant="label">Total Sensors: {totalSensors}</HvTypography>
        <HvTypography variant="body">No of Incident: {incidents}</HvTypography>
        <HvTypography variant="body">No of Detected Alarms: {detectedAlarms}</HvTypography>
        <HvTypography variant="body">Unhealthy Sensor: {unhealthySensors}</HvTypography>
      </HvCardContent>
      {/* <HvCardActions>
        <HvButton variant="primary">{isActive ? "Jump to Floor" : "Go to Floor"}</HvButton>
      </HvCardActions> */}
    </HvCard>
  );
};

const Dashboard = () => {
  const floorData = [
    { title: "Lower Ground Floor", totalZones: 6, totalSensors: 24, incidents: "NA", detectedAlarms: "NA", unhealthySensors: "00" },
    { title: "Under Ground Floor", totalZones: 6, totalSensors: 24, incidents: "02", detectedAlarms: "NA", unhealthySensors: "00" },
    { title: "First Floor", totalZones: 6, totalSensors: 24, incidents: "03", detectedAlarms: "NA", unhealthySensors: "00" },
    { title: "Terrace", totalZones: 6, totalSensors: 24, incidents: "04", detectedAlarms: "NA", unhealthySensors: "00" },
    { title: "North Utility", totalZones: 6, totalSensors: 24, incidents: "05", detectedAlarms: "NA", unhealthySensors: "00" },
    { title: "South Utility", totalZones: 6, totalSensors: 24, incidents: "06", detectedAlarms: "NA", unhealthySensors: "00" },
    { title: "Iron Gate", totalZones: 6, totalSensors: 24, incidents: "07", detectedAlarms: "NA", unhealthySensors: "00" },
    { title: "QRT 01", totalZones: 6, totalSensors: 24, incidents: "01", detectedAlarms: "NA", unhealthySensors: "00", isActive: true },
    { title: "QRT 02", totalZones: 6, totalSensors: 24, incidents: "01", detectedAlarms: "NA", unhealthySensors: "00", isActive: true },
    { title: "Lab", totalZones: 6, totalSensors: 24, incidents: "01", detectedAlarms: "NA", unhealthySensors: "00" }
  ];

  return (
    <HvBox>
      {/* Top App Bar */}
      <AppBar position="static" color="default">
        <Toolbar>
          <HvTypography variant="title2">Operators Dashboard - Home Screen</HvTypography>
        </Toolbar>
      </AppBar>
      
      {/* Floor Tabs */}
      <Paper>
        <Tabs value={0} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Under Ground" />
          <Tab label="First Floor" />
          <Tab label="Terrace" />
          <Tab label="North Utility" />
          <Tab label="South Utility" />
          <Tab label="Iron Gate" />
          <Tab label="QRT 01" />
          <Tab label="QRT 02" />
          <Tab label="Lab" />
          <Tab label="View All Alarms" />
        </Tabs>
      </Paper>
      
      {/* Floor Cards Grid */}
      <Grid container spacing={2} padding={2}>
        {floorData.map((floor, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <FloorCard {...floor} />
          </Grid>
        ))}
      </Grid>
    </HvBox>
  );
};

export default Dashboard;
