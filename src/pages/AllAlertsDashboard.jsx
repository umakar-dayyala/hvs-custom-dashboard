import React, { useState } from "react";
import { Box, Divider } from "@mui/material";
import FloorTabs from "../components/FloorTabs";
import SensorStatusCards from "../components/SensorStatusCards";
import AllAlertsFloorWiseTable from "../components/AllAlertsFloorWiseTable";
import Breadcrumbs from "../components/Breadcrumbs";
import SensorLegend from "../components/SensorLegend";

const AllAlertsDashboard = () => {
  const [floorData] = useState([
    { id: 1, name: "Lower Ground" },
    { id: 2, name: "Upper Ground" },
    { id: 3, name: "First Floor" },
  ]);

  const [floorWiseAlertsData] = useState([
    {
      floorName: "Under Ground Floor Detected Alarm | Zone 04",
      alerts: [
        {
          slNo: "01",
          zone: "04",
          location: "Upper Ground Floor At Garuda Dwar (Left side)",
          noOfAlarm: "01",
          timeStamp: "01",
          alarmType: "Radiation (Ibac) Raman based Radiological warfare",
          correlatedAlarm: "X",
          incidentStatus: "Open",
          isOnline: false,
          sensorType: "Radiation",
        },
      ],
    },
    {
      floorName: "Lower Ground Floor Detected Alarm | Zone 02",
      alerts: [
        {
          slNo: "02",
          zone: "02",
          location: "Lower Ground Floor Inside AHU room no. L-49",
          noOfAlarm: "02",
          timeStamp: "01",
          alarmType: "Large Bio Count",
          correlatedAlarm: "X",
          incidentStatus: "Open",
          isOnline: true,
          sensorType: "Radiation",
        },
        {
          slNo: "03",
          zone: "02",
          location: "Lower Ground Floor At Hans Dwar (Right side)",
          noOfAlarm: "01",
          timeStamp: "01",
          alarmType: "Phosphorus Concentration (CP) (ug/m3)",
          correlatedAlarm: "X",
          incidentStatus: "Open",
          isOnline: true,
          sensorType: "Radiation",
        },
      ],
    },
  ]);

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs />
        <div style={{ display: "flex", gap: "10px" }}>
          <SensorLegend />
          {/* <ToggleButtons /> */}
        </div>
      </div>
      {/* Sensor Status Cards */}
      <SensorStatusCards />
      <Divider style={{ border: "1px solid #70707059", margin: "8px 0", marginTop: "2rem" }} />

      {/* Floor Tabs */}
      <Box width="100%">
        {/* Need Uncomment it  */}
        {/* <FloorTabs floorData={floorData} /> */}
      </Box>

      <AllAlertsFloorWiseTable floorWiseAlertsData={floorWiseAlertsData} />
    </Box>
  );
};

export default AllAlertsDashboard;
