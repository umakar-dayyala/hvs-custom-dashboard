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

// Utility functions
const statusColor = (status) => {
  return status === "Resolved" ? "default" : "primary";
};

const alertTypeColor = (type) => {
  return type === "Critical Alert" ? "error" : "default";
};

const Alerts = ({ intensityData }) => {
  if (!intensityData || !intensityData.alertData) return null;

  // Transform intensityData into a table-ready format
  const data = Object.entries(intensityData.alertData).map(
    ([chemicalKey, details]) => ({
      timestamp: details.timestamp,
      chemical: chemicalKey.charAt(0).toUpperCase() + chemicalKey.slice(1),
      alertType: details.critical === "alert" ? "Critical Alert" : "No Alert",
      value: `${details.value}`,
      status: details.status,
    })
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
