import React, { useState } from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvStack } from '@hitachivantara/uikit-react-core';
import OutlierChart from '../components/OutlierChart';
import AnomalyChart from '../components/AnomalyChart';
import { Alert, Box } from '@mui/material';
import bioicon from "../assets/rBiological.svg";
import gbioicon from "../assets/gBiological.svg";
import PlotlyDataChart from '../components/PlotlyDataChart';
import rbell from "../assets/rbell.svg";
import Alertbar from '../components/Alertbar';
import IntensityChart from '../components/IntensityChart';
import PredictionChart from '../components/PredictionChart';
import Breadcrumbs from '../components/Breadcrumbs';
import ToggleButtons from '../components/ToggleButtons';
import {  Button, Modal, Typography } from "@mui/material";
import ConfirmationModal from '../components/ConfirmationModal';

const dummyData = [
  { alarmCount: 1, alarmType: "Bio Alarm", location: "Lab A", timeRange: "10:00 AM - 10:20 AM" },
];

const sampleData = [{
  "Biological_Parameters": {
    "small_bio_count": "82",
    "small_particle_count": "12441000",
    "large_bio_count": "304",
    "large_particle_count": "6959",
    "particle_size": "16"
  },
  "Health_Parameters": {
    "exhaust_pressure": "3.34",
    "laser_pd": "370",
    "laser_current": "40.28",
    "background_monitor": "1.4",
    "power_supply_3_3v": "3.33",
    "internal_temperature": "45.25",
    "input_voltage": "23.93"
  },
  "Health_Status": {
    "fault_background_light_monitor": "No Fault",
    "low_battery": "No Fault",
    "laser_power": "No Fault",
    "laser_current2": "No Fault",
    "pressure": "No Fault"
  },
 
}];

const chartData = {
  "Time": [
    "2025-03-17T15:32:15.497Z",
    "2025-03-17T15:32:17.435Z",
    "2025-03-17T15:32:18.775Z",
    "2025-02-17T15:32:19.733Z",
    "2025-02-17T15:32:20.694Z",
    "2025-02-17T15:32:21.954Z",
  ],
  "Small Particle Count": [2, 3, 1, 5, 4, 6],
  "Large Particle Count": [5, 8, 6, 9, 7, 10],
  "Large Bio Count": [10, 12, 14, 15, 16, 18],
  "Small Bio Count": [22, 25, 27, 26, 28, 30],
};

const kpiData = [
  { "title": "Biological Alarm", "value": "01" },
  { "title": "Algorithm Alarm", "value": "00" },
  { "title": "Diagnostic Fault Alarm", "value": "00" },
];

const responseData = {
  "labels": [
    "2025-03-10T15:32:15.497Z",
    "2025-03-17T15:32:17.435Z",
    "2025-03-17T15:32:18.775Z",
    "2025-03-17T15:32:19.733Z",
    "2025-03-17T15:32:20.694Z",
    "2025-03-17T15:32:21.954Z",
  ],
  "datasets": [
    {
      "label": "Small Particle Count",
      "data": [208636, 208636, 208636, 208636, 208636, 208636],
      "anomalyValues": [0, 0, 0, 0, 0, 1],
    },
    {
      "label": "Large Particle Count",
      "data": [208636, 208636, 208636, 208636, 208636, 2086360],
      "anomalyValues": [0, 0, 0, 0, 1, 1],
    },
  ],
};

export const IbacIndividual = () => {
  const [toggleState, setToggleState] = useState("Operator");
const [showModal, setShowModal] = useState(false);
const [newState, setNewState] = useState(null);

const handleToggleClick = (state) => {
  if (toggleState === "Operator" && state === "Supervisor") {
    setNewState(state); // Store new state temporarily
    setShowModal(true); // Show confirmation modal
  } else {
    setToggleState(state); // Directly update state if no confirmation needed
  }
};

const handleConfirmChange = () => {
  if (newState) {
    setToggleState(newState); // Apply only confirmed changes
  }
  setShowModal(false); // Close modal
};

const handleCancelChange = () => {
  setNewState(null); // Reset temporary state
  setShowModal(false); // Close modal without changing state
};


return (
  <Box>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Breadcrumbs />
      <div style={{ display: "flex", gap: "10px" }}>
      <ToggleButtons onToggleChange={handleToggleClick} currentRole={toggleState} />

      </div>
    </div>

    <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <HvStack direction="column" divider spacing="sm">
        <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} />
        <Alertbar />
      </HvStack>
      <IndividualParameters sampleData={sampleData} />
      <Box mt={2}>
        <PlotlyDataChart data={chartData} />
      </Box>

      <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
        <Box width={"50%"}>
          <AnomalyChart responseData={responseData} />
        </Box>
        <Box width={"50%"}>
          <OutlierChart responseData={responseData} />
        </Box>
      </Box>

      <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
        <Box width={toggleState === "Operator" ? "100%" : "50%"}>
          <IntensityChart />
        </Box>
        {toggleState !== "Operator" && (
          <Box width={"50%"}>
            <PredictionChart />
          </Box>
        )}
      </Box>
    </Box>

    {showModal && (
      <ConfirmationModal 
        open={showModal} 
        onClose={handleCancelChange} 
        onConfirm={handleConfirmChange} 
        title="Confirm Role Change"
        message="Are you sure you want to switch to Supervisor mode?"
      />
    )}
  </Box>
);
};