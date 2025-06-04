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
    let isMounted = true;

    const fetchSummaryData = async () => {
      try {
        while (isMounted) {
          const result = await summaryData();
          if (isMounted) {
            setData(result);
          }
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

  if (!data) return null;

  return (
    <Grid container spacing={2} alignItems="stretch">
      {/* CBRN Alarms */}
      <Grid item xs={12} md={4}>
        <Box sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
              border: "1px solid #ddd",
              borderTop: `5px solid ${data?.cbrn_alarms > 0 ? "red" : "#28a745"}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Grid container spacing={1}>
              {["CBRN Alarms", "Chemical", "Biological", "Radiological"].map(label => (
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
        </Box>
      </Grid>

      {/* Total Sensors */}
      <Grid item xs={12} md={4}>
        <Box sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
              border: "1px solid #ddd",
              borderTop: "5px solid #28a745",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Grid container spacing={1}>
              {["Total Sensor", "Chemical", "Biological", "Radiological", "Generic"].map(label => (
                <Grid item xs={2.4} key={label}>
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
              <Grid item xs={2.4}>
                <Typography variant="h5" fontWeight="bold" color="#333">
                  {data.total_generic}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>

      {/* Sensors Health */}
      <Grid item xs={12} md={4}>
        <Box sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
              border: "1px solid #ddd",
              borderTop: `5px solid ${data?.unhealthy_sensors > 0 ? "#ff9933" : "#28a745"}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
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
                <Typography fontWeight="bold">
                  Healthy: {data.active_sensors - data.unhealthy_sensors}
                </Typography>
              </Grid>

              <Grid item>
                <WifiOffIcon color="disabled" />
              </Grid>
              <Grid item>
                <Typography fontWeight="bold">
                  Inactive: {data.inactive_sensors + data.disconnected_sensors}
                </Typography>
              </Grid>

              <Grid item>
                <WarningIcon color="warning" />
              </Grid>
              <Grid item>
                <Typography fontWeight="bold">Unhealthy: {data.unhealthy_sensors}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
