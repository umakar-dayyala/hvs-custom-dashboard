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

// Utility functions
const statusColor = (status) => {
  return status?.toLowerCase() === "resolved" ? "default" : "primary";
};

const alertTypeColor = (type) => {
  return type?.toLowerCase()?.includes("critical") ? "error" : "default";
};

const Alerts = ({ intensityData }) => {
  if (!intensityData || !intensityData.alertData) return null;

  // Dynamically transform data for table display
  const data = Object.entries(intensityData.alertData).map(
    ([paramKey, details]) => {
      // Determine alert type dynamically based on any key with value 'alert'
      const alertTypeKey = Object.entries(details || {}).find(
        ([key, value]) =>
          typeof value === "string" &&
          value.toLowerCase() === "alert" &&
          !["status", "timestamp"].includes(key.toLowerCase())
      )?.[0];

      return {
        timestamp: details.timestamp,
        chemical: paramKey.charAt(0).toUpperCase() + paramKey.slice(1),
        alertType: alertTypeKey
          ? alertTypeKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          : "No Alert",
        value: `${details.value ?? "-"}`,
        status: details.status ?? "Unknown",
      };
    }
  );

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
              <TableCell><strong>Parameter</strong></TableCell>
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
