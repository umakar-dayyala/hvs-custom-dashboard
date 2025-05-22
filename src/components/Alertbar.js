import React, { useEffect, useState } from "react";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import { Box } from "@mui/material";
import { fetchLocationData } from "../service/AlertBarService";

const Alertbar = ({ setLocationDetailsforbreadcrumb }) => {
  const [floor, setFloor] = useState("-");
  const [zone, setZone] = useState("-");
  const [location, setLocation] = useState("-");
  const [sensorType, setSensorType] = useState("-");

  const queryParams = new URLSearchParams(window.location.search);
  const device_id = queryParams.get("device_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLocationData(device_id);
        setFloor(response?.data?.floor || "-");
        setZone(response?.data?.zone || "-");
        setLocation(response?.data?.location || "-");
        setSensorType(response?.data?.sensorType || "-");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [device_id]);

  useEffect(() => {
    setLocationDetailsforbreadcrumb(floor, zone, location, sensorType);
  }, [floor, zone, location, sensorType]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
      <Box style={{ display: "flex", gap: "5px" }}>
        <HvTypography variant="title3">Floor: {floor} |</HvTypography>
        <HvTypography variant="title3">Zone: {zone} |</HvTypography>
        <HvTypography variant="title3">Location: {location} |</HvTypography>
        <HvTypography variant="title3">Sensor: {sensorType}</HvTypography>
      </Box>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <HvTypography variant="title3">
          <span style={{ color: "green",fontSize:"30px" }}>●</span> Normal
        </HvTypography>
        <HvTypography variant="title3">
          <span style={{ color: "orange",fontSize:"30px" }}>●</span> Health & Analytics Alert
        </HvTypography>
        <HvTypography variant="title3">
          <span style={{ color: "red" ,fontSize:"30px"}}>●</span> Alarm
        </HvTypography>
      </div>
    </div>
  );
};

export default Alertbar;
