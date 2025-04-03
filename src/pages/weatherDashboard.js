import React from "react";
import { HvCard, HvTypography, HvGrid } from "@hitachivantara/uikit-react-core";
import { Box } from "@mui/material";

const weatherData = {
  maxGust: 25,
  minTemp: 27,
  minHumidity: 20,
  maxTemp: 53.4,
  maxHumidity: 94,
  avgWindDirection: 208,
};

const WeatherDashboard = () => {
  return (
    <div>
      <HvGrid container spacing={1} style={{ width: "100%", margin: 0, alignItems: "stretch" }}>
        <HvGrid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
          <HvCard bgcolor="white" style={{ textAlign: "center", flex: 1, borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Box marginTop="2%">
              <HvTypography variant="label">Max Gust</HvTypography>
            </Box>
            <HvTypography variant="title3" style={{ color: "#FFD700", fontSize: "4vw", marginTop: "5%" }}>
              {weatherData.maxGust} <span style={{ fontSize: "3vw" }}>mph</span>
            </HvTypography>
          </HvCard>
        </HvGrid>

        <HvGrid item xs={6} sm={3} md={2} style={{ display: "flex", flexDirection: "column" }}>
          <HvCard bgcolor="white" style={{ textAlign: "center", flex: 1, borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Box marginTop="2%">
              <HvTypography variant="label">Min Temp</HvTypography>
            </Box>
            <HvTypography variant="title3" style={{ color: "#4A90E2", fontSize: "3vw", marginTop: "3%" }}>
              {weatherData.minTemp} <span style={{ fontSize: "1.5vw" }}>°F</span>
            </HvTypography>
          </HvCard>
          <HvCard bgcolor="white" style={{ textAlign: "center", flex: 1, marginTop: "0.5rem", borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Box marginTop="2%">
              <HvTypography variant="label">Min Humidity</HvTypography>
            </Box>
            <HvTypography variant="title3" style={{ color: "#4A90E2", fontSize: "3vw", marginTop: "3%" }}>
              {weatherData.minHumidity} <span style={{ fontSize: "1.5vw" }}>%</span>
            </HvTypography>
          </HvCard>
        </HvGrid>

        <HvGrid item xs={6} sm={3} md={2} style={{ display: "flex", flexDirection: "column" }}>
          <HvCard bgcolor="white" style={{ textAlign: "center", flex: 1, borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Box marginTop="2%">
              <HvTypography variant="label">Max Temp</HvTypography>
            </Box>
            <HvTypography variant="title3" style={{ color: "#D8D8D8", fontSize: "3vw", marginTop: "3%" }}>
              {weatherData.maxTemp} <span style={{ fontSize: "1.5vw" }}>°F</span>
            </HvTypography>
          </HvCard>
          <HvCard bgcolor="white" style={{ textAlign: "center", flex: 1, marginTop: "0.5rem", borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Box marginTop="2%">
              <HvTypography variant="label">Max Humidity</HvTypography>
            </Box>
            <HvTypography variant="title3" style={{ color: "#4A90E2", fontSize: "3vw", marginTop: "3%" }}>
              {weatherData.maxHumidity} <span style={{ fontSize: "1.5vw" }}>%</span>
            </HvTypography>
          </HvCard>
        </HvGrid>

        <HvGrid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
          <HvCard bgcolor="white" style={{ textAlign: "center", flex: 1, borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <Box marginTop="2%">
              <HvTypography variant="label">Avg. Wind Direction</HvTypography>
            </Box>
            <HvTypography variant="title3" style={{ color: "#8BC34A", fontSize: "4vw", marginTop: "5%" }}>
              {weatherData.avgWindDirection} <span style={{ fontSize: "2vw" }}>°</span>
            </HvTypography>
          </HvCard>
        </HvGrid>
      </HvGrid>
    </div>
  );
};

export default WeatherDashboard;
