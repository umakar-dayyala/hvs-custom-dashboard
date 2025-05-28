import React from "react";
import { Button, Typography, Box } from "@mui/material";
import bioicon from "../assets/blackBio.svg";
import chemicon from "../assets/blackChemical.svg";
import radioicon from "../assets/blackRadio.svg";

const DeviceBox = ({ device }) => {
  const getBackgroundColor = () => {
    if (device.status === "Alarm") return "#ff4444";
    if (device.status === "Healthy") return "#00c896";
    if (device.status === "Unhealthy") return "#FFBF00";
    return "#6c757d";
  };

  const getHoverBackgroundColor = () => {
    if (device.status === "Alarm") return "#cc0000";
    if (device.status === "Healthy") return "#00c896";
    if (device.status === "Unhealthy") return "#FFBF00";
    return "#5a6268";
  };

  const getIcon = () => {
    if (device.category === "Chemical") return chemicon;
    if (device.category === "Biological") return bioicon;
    if (device.category === "Radiation") return radioicon;
    return null;
  };

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        p: 1.5,
        height: "100%",
        minHeight: 90,
        fontWeight: 500,
        fontSize: "0.85rem",
        backgroundColor: getBackgroundColor(),
        color: "white",
        "&:hover": {
          backgroundColor: getHoverBackgroundColor(),
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        textAlign: "left",
        transition: "background-color 0.3s ease",
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        {device.name}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
        {getIcon() && (
          <img
            src={getIcon()}
            alt="icon"
            style={{
              width: 50,
              height: 50,
              filter: "invert(100%)", // turns black icon to white
            }}
          />
        )}
        <Typography variant="title2" >
            <Box>
          {device.sensorName} 
          </Box>    
          <Box>
          {device.status}
          </Box>
        </Typography>
      </Box>
    </Button>
  );
};

export default DeviceBox;
