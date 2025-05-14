import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Divider,
  Paper,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Helper function to calculate time since event
const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
};

const FloorWiseAlarmPanel = ({ sensorData }) => {
  console.log("Sensor Data:"+JSON.stringify( sensorData));
  const [filter, setFilter] = useState("All");

  // Filter alarms
  const alarms = useMemo(() => {
    return sensorData
      .filter((item) => item.s_no.alarm_status === "Alarm")
      .filter((item) => {
        if (filter === "All") return true;
        return item.s_no.detector_type === filter;
      });
  }, [sensorData, filter]);

  const detectorTypes = [
    ...new Set(sensorData.map((d) => d.s_no.detector_type)),
  ];

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Alarms
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Shows active alarms by sensor.
          </Typography>
        </Box>
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {detectorTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Divider sx={{ my: 1 }} />

      {alarms.length === 0 ? (
        <Typography color="success.main" align="center" mt={2}>
          ✅ All good. No active alarms.
        </Typography>
      ) : (
        alarms.map((item, index) => {
          const { detector, detector_type, alarm_description, location, zone, alarm_start_timestamp } = item.s_no;
            return (
            <Box
              key={index}
              bgcolor="#FAFAFA"
              p={1.5}
              borderRadius={1}
              my={1}
              display="flex"
              flexDirection="column"
              gap={0.5}
              border="1px solid #eee"
            >
              <Box display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
              <ErrorOutlineIcon color="error" fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
              {detector}
              </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTimeIcon fontSize="small" color="disabled" />
              <Typography variant="caption" color="textSecondary">
              {new Date(alarm_start_timestamp).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).replace(/am|pm/, "").trim()}
              </Typography>
              </Box>
              </Box>
              <Typography variant="body2">
              {alarm_description || `Alert detected in ${location} - Zone ${zone}`}
              </Typography>
            </Box>
            );
        })
      )}
    </Paper>
  );
};

export default FloorWiseAlarmPanel;
