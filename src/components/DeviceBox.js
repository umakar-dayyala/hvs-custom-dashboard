import React from "react";
import { Button, Typography, Box } from "@mui/material";
import bioicon from "../assets/blackBio.svg";
import chemicon from "../assets/blackChemical.svg";
import radioicon from "../assets/blackRadio.svg";
import weathericon from "../assets/bWeather.svg"; // Assuming you have a weather icon
import oxygenicon from "../assets/bOxygen.svg"; // Assuming you have an oxygen icon


const DeviceBox = ({ device }) => {
  const getBackgroundColor = () => {
    if (device.status === "Alarm") return "#ff4444";
    if (device.status === "Healthy") return "#28A745";
    if (device.status === "Unhealthy") return "#FFA500";
    return "#6c757d";
  };

  const getHoverBackgroundColor = () => {
    if (device.status === "Alarm") return "#cc0000";
    if (device.status === "Healthy") return "#28A745";
    if (device.status === "Unhealthy") return "#FFBF00";
    return "#5a6268";
  };

  const getIcon = () => {
    if (device.category === "Chemical") return chemicon;
    if (device.category === "Biological") return bioicon;
    if (device.category === "Radiation") return radioicon;
    if (device.type2 === "Weather") return weathericon;
    if (device.type2 === "Oxygen") return oxygenicon;
    return null;
  };

  return (
  <Button
  variant="contained"
  fullWidth
  sx={{
    p: 1.5,
    height: "100%",
    minHeight: 120,
    fontWeight: "bold",
    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
    backgroundColor: getBackgroundColor(),
    color: "white",
    "&:hover": {
      backgroundColor: getHoverBackgroundColor(),
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center", // 🔧 Changed from "space-between"
    textAlign: "left",
    gap: 1.5, // ✅ Added spacing between name and bottom block
    transition: "background-color 0.3s ease",
  }}
>

      <Typography
        variant="subtitle2"
        fontWeight={600}
        noWrap
        sx={{
          fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
          width: "100%", fontWeight:"bold",
        }}
      >
        {device.name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 1,
          width: "100%",
        }}
      >
        {getIcon() && (
          <Box
            component="img"
            src={getIcon()}
            alt="icon"
            sx={{
              width: 40,
              height: 40,
              filter: "invert(100%)",
              flexShrink: 0,
            }}
          />
        )}

        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
  <Typography
    variant="title"
    sx={{
      fontSize: { xs: "1rem", sm: "1rem" },
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%", // Prevent overflow
      fontWeight:"bold",
    }}
    title={device.sensorName} // Tooltip for full name
  >
    {device.sensorName}
  </Typography>

  <Typography
    variant="caption"
    sx={{
      fontSize: { xs: "1rem", sm: "1rem" },  fontWeight:"bold",
    }}
  >
    {device.status}
  </Typography>
</Box>

        </Box>
      </Box>
    </Button>
  );
};

export default DeviceBox;
