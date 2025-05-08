// NotificationPanel.jsx
import React from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Chip,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const notifications = [
  {
    type: "Alarm",
    id: 73654,
    title: "AP4C-F Sensor",
    description: "Sarin (GB) Detected in Garuda Dwar (Right side) - Zone 4",
    time: "Just now",
    severity: "Critical",
  },
  {
    type: "Event",
    id: 73654,
    title: "Data connection issue",
    description: "22 April 2025 12:34:56",
    severity: "Warning",
  },
  // Add more...
];

const severityColors = {
  Critical: "error",
  Warning: "warning",
  Info: "info",
};

const NotificationPanel = ({ onClose }) => {
  return (
    <Box sx={{ width: 350, padding: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Notifications</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box my={1}>
        <Select defaultValue="Priority" fullWidth>
          <MenuItem value="Priority">Priority</MenuItem>
          <MenuItem value="Date">Date</MenuItem>
        </Select>
      </Box>

      <Divider />

      <Box sx={{ mt: 2, maxHeight: "80vh", overflowY: "auto" }}>
        {notifications.map((note, idx) => (
          <Box key={idx} mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              {note.type} <a href="#">{note.id}</a>
            </Typography>
            <Typography variant="body1">{note.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {note.description}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Chip
                label={note.severity}
                color={severityColors[note.severity]}
                size="small"
              />
              <Typography variant="caption" color="textSecondary">
                {note.time}
              </Typography>
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NotificationPanel;
