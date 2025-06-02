import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Divider,
  Paper,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Function to fix the timestamp format
const fixTimestamp = (ts) => {
  if (ts.includes('T') || ts.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
    return ts;
  }
  const match = ts.match(/^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2}(\.\d+)?)$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return ts;
};

const flattenNotifications = (data) => {
  // Handle cases where data is undefined/null or doesn't have devices property
  if (!data || !data.devices) return [];

  // Ensure devices is an array before calling flatMap
  const devicesArray = Array.isArray(data.devices) ? data.devices : [data.devices].filter(Boolean);

  let idCounter = 1;
  return devicesArray.flatMap((device) => {
    // Handle cases where device is null/undefined or notifications is not an array
    if (!device || !device.notifications) return [];
    
    const notificationsArray = Array.isArray(device.notifications) 
      ? device.notifications 
      : [device.notifications].filter(Boolean);

    return notificationsArray.map((note) => ({
      id: idCounter++,
      sensor_name: note?.sensor_name || 'Unknown Sensor',
      label: note?.label || 'No label provided',
      timestamp: note?.timestamp ? fixTimestamp(note.timestamp) : 'No timestamp',
    }));
  });
};

const FloorWiseNotificationPanel = ({ sensorData }) => {
  const allNotifications = useMemo(
    () => flattenNotifications(sensorData),
    [sensorData]
  );

  // Extract unique sensor names for dropdown
  const sensorNames = useMemo(() => {
    const names = Array.from(new Set(allNotifications.map(n => n.sensor_name)));
    return ["All", ...names];
  }, [allNotifications]);

  const [selectedSensor, setSelectedSensor] = useState("All");

  // Filter by sensor name
  const filteredNotifications = useMemo(() => {
    if (selectedSensor === "All") return allNotifications;
    return allNotifications.filter(n => n.sensor_name === selectedSensor);
  }, [selectedSensor, allNotifications]);

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', maxHeight: '42vh', overflow: 'hidden' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Filtered by sensor: {selectedSensor}
          </Typography>
        </Box>
        <Select
          size="small"
          value={selectedSensor}
          onChange={(e) => setSelectedSensor(e.target.value)}
        >
          {sensorNames.map(name => (
            <MenuItem key={name} value={name}>{name}</MenuItem>
          ))}
        </Select>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', minHeight: '30vh' }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Typography color="textSecondary">No notifications to display.</Typography>
          </Box>
        ) : (
          filteredNotifications.map((n) => (
            <Box
              key={n.id}
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
                  <NotificationsActiveIcon color="primary" fontSize="small" />
                  <Typography variant="body2" fontWeight="bold">
                    {n.sensor_name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTimeIcon fontSize="small" color="disabled" />
                  <Typography variant="caption" color="textSecondary">
                    {n.timestamp}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">{n.label}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default FloorWiseNotificationPanel;
