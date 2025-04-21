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
        console.log("Fetched data:", response);
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
        <HvTypography variant="label">Floor: {floor} |</HvTypography>
        <HvTypography variant="label">Zone: {zone} |</HvTypography>
        <HvTypography variant="label">Location: {location} |</HvTypography>
        <HvTypography variant="label">Sensor: {sensorType}</HvTypography>
      </Box>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <HvTypography variant="label">
          <span style={{ color: "green", fontSize: "24px" }}>●</span> Normal
        </HvTypography>
        <HvTypography variant="label">
          <span style={{ color: "orange", fontSize: "24px" }}>●</span> Health & Analytics Alert
        </HvTypography>
        <HvTypography variant="label">
          <span style={{ color: "red", fontSize: "24px" }}>●</span> CBRN Alarm
        </HvTypography>
      </div>
    </div>
  );
};

export default Alertbar;
