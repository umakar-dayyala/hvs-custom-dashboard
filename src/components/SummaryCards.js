import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WarningIcon from "@mui/icons-material/Warning";
import { summaryData } from "../service/summaryServices";

const SummaryCards = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true; // To avoid setting state on unmounted component
  
    const fetchSummaryData = async () => {
      try {
        while (isMounted) {
          const result = await summaryData();
          if (isMounted) {
            setData(result);
          }
          // Wait for 0.5 seconds before the next call
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };
  
    fetchSummaryData();
  
    return () => {
      isMounted = false;
    };
  }, []);
  
  if (!data) return null; // Or a loading spinner

  return (
    <Grid container spacing={2}>
      {/* CBRN Alarms */}
      <Grid item xs={12} md={4}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #ddd",
            borderTop: `5px solid ${data?.cbrn_alarms > 0 ? "red" : "#28a745"}`,
            position: "relative",
            minHeight: 120,
          }}
        >
          <Grid container spacing={1}>
            {["CBRN Alarms", "Chemical", "Biological", "Radiological"].map((label, index) => (
              <Grid item xs={3} key={label}>
                <Typography variant="subtitle1" fontWeight="bold" color="#333">
                  {label}
                </Typography>
              </Grid>
            ))}
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.cbrn_alarms}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.chemical_alarms}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.biological_alarms}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.radiological_alarms}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Total Sensors */}
      <Grid item xs={12} md={4}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #ddd",
            borderTop: "5px solid #28a745",
            minHeight: 120,
          }}
        >
          <Grid container spacing={1}>
            {["Total Sensor", "Chemical", "Biological", "Radiological", "Generic"].map((label, i) => (
              <Grid item xs={2.4} key={label}>
                {/* Enablen when they want to show generic */}
                {/* {["Total Sensor", "Chemical", "Biological", "Radiological","Generic"].map((label, i) => (
              <Grid item xs={2.4} key={label}> */}
                <Typography variant="subtitle1" fontWeight="bold" color="#333">
                  {label}
                </Typography>
              </Grid>
            ))}
            <Grid item xs={2.4}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.total_sensors}
              </Typography>
            </Grid>
            <Grid item xs={2.4}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.total_chemical}
              </Typography>
            </Grid>
            <Grid item xs={2.4}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.total_biological}
              </Typography>
            </Grid>
            <Grid item xs={2.4}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.total_radiation}
              </Typography>
            </Grid>
            {/* Enablen when they want to show generic */}
            <Grid item xs={2.4}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {data.total_generic}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Sensors Health */}
      <Grid item xs={12} md={4}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #ddd",
            borderTop: `5px solid ${data?.unhealthy_sensors > 0 ? "#ff9933" : "#28a745"}`,
            minHeight: 120,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight="bold" color="#333">
            Sensors Health
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <WifiIcon color="success" />
            </Grid>
            <Grid item>
              {/* <Typography fontWeight="bold">Active: {data.active_sensors }</Typography> */}
              <Typography fontWeight="bold">Active: {data.active_sensors - data.unhealthy_sensors}</Typography>
            </Grid>

            <Grid item>
              <WifiOffIcon color="disabled" />
            </Grid>
            <Grid item>
              {/* <Typography fontWeight="bold">Inactive: {data.inactive_sensors}</Typography> */}
              <Typography fontWeight="bold"> Inactive: {data.inactive_sensors + data.disconnected_sensors}</Typography>
            </Grid>

            <Grid item>
              <WarningIcon color="warning" />
            </Grid>
            <Grid item>
              <Typography fontWeight="bold">Unhealthy: {data.unhealthy_sensors}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
