import React from "react";
import { Button, Typography, Box } from "@mui/material";
import bioicon from "../assets/blackBio.svg";
import chemicon from "../assets/blackChemical.svg";
import radioicon from "../assets/blackRadio.svg";
import weathericon from "../assets/bWeather.svg";
import oxygenicon from "../assets/bOxygen.svg";
import { Tooltip } from "@mui/material";


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
    <Tooltip
      title={`${device.category} - ${device.type2}`}
      placement="top"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "white",
            color: "black",
            fontWeight: "bold",
            fontSize: "0.85rem",
            border: "1px solid #ccc",
            boxShadow: 3,
          },
        },
        arrow: {
          sx: {
            color: "white",
          },
        },
      }}
    >
      <Button
        variant="contained"
        fullWidth
        sx={{
          p: 1.5,
          height: "100%",
          fontWeight: "bold",
          backgroundColor: getBackgroundColor(),
          color: "white",
          "&:hover": {
            backgroundColor: getHoverBackgroundColor(),
          },
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "left",
          gap: 2,
          transition: "background-color 0.3s ease",
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

        <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Typography
            variant="subtitle2"
            title={device.name}
            sx={{
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {device.name}
          </Typography>

          <Typography
            variant="body1"
            title={device.sensorName}
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {device.sensorName}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            {device.status}
          </Typography>
        </Box>
      </Button>
    </Tooltip>
  );
};

export default DeviceBox;
