import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import WarningIcon from "@mui/icons-material/Warning";

const SummaryCards = ({ SummaryCardsData }) => {
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
            borderTop: `5px solid ${SummaryCardsData?.cbrn_alarms > 0 ? "red" : "#28a745"}`,
            position: "relative",
            minHeight: 120,
          }}
        >
          <Box position="absolute" top={8} right={8}>
            {/* <ErrorIcon color="error" /> */}
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                CBRN Alarms
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                Chemical
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                Biological
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                Radiological
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.cbrn_alarms}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.chemical_alarms}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.biological_alarms}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.radiological_alarms}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Sensors Total */}
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
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                Total Sensor
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                Chemical
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                Biological
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="#333">
                Radiological
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.total_sensors}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.total_chemical}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.total_biological}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {SummaryCardsData.total_radiation}
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
            borderTop: `5px solid ${SummaryCardsData?.cbrn_alarms > 0 ? "red" : "#28a745"}`,
            minHeight: 120,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight="bold" color="#333">
            Sensors Health
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <WifiIcon color="primary" fontSize="medium" />
            </Grid>
            <Grid item>
              <Typography variant="body1" fontWeight="bold" color="#333">
                Active: {SummaryCardsData.active_sensors}
              </Typography>
            </Grid>

            <Grid item>
              <WifiOffIcon color="disabled" fontSize="medium" />
            </Grid>
            <Grid item>
              <Typography variant="body1" fontWeight="bold" color="#333">
                Inactive: {SummaryCardsData.inactive_sensors}
              </Typography>
            </Grid>

            <Grid item>
              <WarningIcon color="warning" fontSize="medium" />
            </Grid>
            <Grid item>
              <Typography variant="body1" fontWeight="bold" color="#333">
                Unhealthy: {SummaryCardsData.unhealthy_sensors}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
