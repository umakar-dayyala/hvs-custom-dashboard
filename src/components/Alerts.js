// Overview.js
import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from "@mui/material";

// Dummy intensityData
const intensityData = {
  alertData: {
    phosphorus: {
      concentration: "no alert",
      instant: "no alert",
      critical: "no alert",
      value: 0.12,
      timestamp: "2025-01-25 14:01:17.243",
      status: "Active",
    },
    arsenic: {
      concentration: "no alert",
      instant: "no alert",
      critical: "alert",
      value: 0.05,
      timestamp: "2025-01-25 14:01:17.243",
      status: "Active",
    },
    sulphur: {
      concentration: "no alert",
      instant: "no alert",
      critical: "no alert",
      value: 0.8,
      timestamp: "2025-01-25 14:01:17.243",
      status: "Active",
    },
    cyanide: {
      concentration: "no alert",
      instant: "no alert",
      critical: "no alert",
      value: 0.02,
      timestamp: "2025-01-25 14:01:17.243",
      status: "Active",
    },
  },
  mostRecentAlert: {
    type: "No Alert",
    parameter: "Phosphorous",
    time: "2025-01-25 14:01:17.243",
  },
};

// Utility functions
const statusColor = (status) => {
  return status === "Resolved" ? "default" : "primary";
};

const alertTypeColor = (type) => {
  return type === "Critical Alert" ? "error" : "default";
};

// Transform intensityData into a table-ready format
const data = Object.entries(intensityData.alertData).map(([chemicalKey, details]) => {
  return {
    timestamp: details.timestamp,
    chemical: chemicalKey.charAt(0).toUpperCase() + chemicalKey.slice(1),
    alertType: details.critical === "alert" ? "Critical Alert" : "No Alert",
    value: `${details.value}`,
    status: details.status,
  };
});

const Alerts = () => {
  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Alert Log
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Timestamp</strong></TableCell>
              <TableCell><strong>Chemical</strong></TableCell>
              <TableCell><strong>Alert Type</strong></TableCell>
              <TableCell><strong>Value</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>{row.chemical}</TableCell>
                <TableCell>
                  <Chip
                    label={row.alertType}
                    color={alertTypeColor(row.alertType)}
                    variant="filled"
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusColor(row.status)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Alerts;
