import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Divider,
  Paper,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom"; 
import rChemical from "../assets/rChemical.svg"; 
import rBiological from "../assets/rBiological.svg"; 
import rRadiation from "../assets/rRadiological.svg"; 
import { routeName } from "../utils/RouteUtils"; 

const getIconByType = (detector_type) => {
  switch (detector_type) {
    case "Radiation": return rRadiation;
    case "Chemical": return rChemical;
    case "Biological": return rBiological;
    default: return rRadiation;
  }
};

// Helper function
const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
};

const FloorWiseAlarmPanel = ({ sensorData }) => {
  const navigate = useNavigate(); 
  const [filter, setFilter] = useState("All");

  const safeSensorData = Array.isArray(sensorData) ? sensorData : [];

  // Filtered alarms
  const alarms = useMemo(() => {
    return safeSensorData
      .filter((item) => item?.s_no?.alarm_status === "Alarm")
      .filter((item) => {
        if (filter === "All") return true;
        return item?.s_no?.detector_type === filter;
      });
  }, [safeSensorData, filter]);

  const detectorTypes = useMemo(() => {
    const types = safeSensorData.map((d) => d?.s_no?.detector_type).filter(Boolean);
    return [...new Set(types)];
  }, [safeSensorData]);

  const handleClick = (sensor) => {
    const route = routeName(sensor.detector);
    if (route) {
      navigate(`/${route}?device_id=${sensor.device_id}`);
    }
  };

  return (
    <Paper elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '42vh',
        overflow: 'hidden',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">Alarms</Typography>
          <Typography variant="caption" color="textSecondary">Shows active alarms by sensor.</Typography>
        </Box>
        <Select size="small" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          {detectorTypes.map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', minHeight: '30vh' }}>
        {alarms.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Typography variant="subtitle1" color="success.main">
              ✅ All good. No active alarms.
            </Typography>
          </Box>
        ) : (
          alarms.map((item, index) => {
            const { detector, detector_type, alarm_description, location, zone, alarm_start_timestamp, device_id } = item?.s_no || {};
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
                    <img src={getIconByType(detector_type)} width={20} height={20} alt="detector-icon" />
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ cursor: "pointer", textDecoration: "underline", color: "red" }}
                      onClick={() => handleClick({ detector, device_id })}
                    >
                      {detector}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon fontSize="small" color="disabled" />
                    <Typography variant="caption" color="textSecondary">
                      {alarm_start_timestamp
                        ? new Date(alarm_start_timestamp).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }).replace(/am|pm/, "").trim()
                        : "--"}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">
                  {alarm_description || `Alert detected in ${location || "unknown"} - Zone ${zone || "?"}`}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default FloorWiseAlarmPanel;
 