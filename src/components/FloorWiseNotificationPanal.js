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

// Sample hardcoded notifications
const notifications = [
  {
    id: 1,
    title: "Sensor Calibration Due",
    description: "Sensor A12 in Zone 3 needs calibration.",
    type: "Maintenance",
    time: "2025-05-13T08:30:00",
  },
  {
    id: 2,
    title: "New Sensor Added",
    description: "Sensor B09 has been added to Floor 2.",
    type: "Update",
    time: "2025-05-12T15:10:00",
  },
  {
    id: 3,
    title: "Connection Lost",
    description: "Sensor D04 in Zone 5 is offline.",
    type: "Alert",
    time: "2025-05-13T06:45:00",
  },
];

// Helper to calculate how long ago something happened
const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
};

const FloorWiseNotificationPanel = () => {
  const [filter, setFilter] = useState("All");

  const filteredNotifications = useMemo(() => {
    if (filter === "All") return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [filter]);

  const notificationTypes = [...new Set(notifications.map((n) => n.type))];

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Recent system notifications
          </Typography>
        </Box>
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {notificationTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Divider sx={{ my: 1 }} />

      {filteredNotifications.length === 0 ? (
        <Typography color="textSecondary" align="center" mt={2}>
          No notifications to display.
        </Typography>
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
                  {n.title}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTimeIcon fontSize="small" color="disabled" />
                <Typography variant="caption" color="textSecondary">
                  {timeAgo(n.time)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">{n.description}</Typography>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default FloorWiseNotificationPanel;
