import React, { useState } from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvStack } from '@hitachivantara/uikit-react-core';
import OutlierChart from '../components/OutlierChart';
import AnomalyChart from '../components/AnomalyChart';
import { Alert, Box } from '@mui/material';
import PlotlyDataChart from '../components/PlotlyDataChart';
import rbell from "../assets/rbell.svg";
import Alertbar from '../components/Alertbar';

import radioicon from "../assets/rRadiological.svg";
import gradioicon from "../assets/gRadiological.svg";
import PredictionChart from '../components/PredictionChart';
import IntensityChart from '../components/IntensityChart';
import Breadcrumbs from '../components/Breadcrumbs';
import ToggleButtons from '../components/ToggleButtons';

const dummyData = [
  { alarmCount: 1, alarmType: "Bio Alarm", location: "Lab A", timeRange: "10:00 AM - 10:20 AM" },
];

const sampleData = [{
  "Radiation Readings": {
    "DET 01 Count": "82",
    
  },
  "Device Health Faults": {
    "DET 01 Status ": "BG Low",
    "System Error": "Fault",
  },
  "System Settings  ": {
    "Vehicle Occupancy": "True",
    "Simulation Mode": "True",
    "DET 1 Status":"04",
    "DET 1 BG High": "15",
    "DET 1 BG Low": "05",
    "DET 1 Alarm": "13",
   
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
  "DET 01 Count": [2, 3, 1, 5, 4, 6],
  
};

const kpiData = [
  { "title": "DET 1 Status", "value": "01" },
  { "title": "System Error", "value": "00" },
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
      "label": "DET 01 Count",
      "data": [208636, 208636, 208636, 208636, 208636, 208636],
      "anomalyValues": [0, 0, 0, 0, 0, 1],
    },
    {
      "label": "DET 02 Count",
      "data": [208636, 208636, 208636, 208636, 208636, 2086360],
      "anomalyValues": [0, 0, 0, 0, 1, 1],
    },
  ],
};

export const PRMIndividual = () => {
  const [toggleState, setToggleState] = useState("Operator");

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs />
        <div style={{ display: "flex", gap: "10px" }}>
          <ToggleButtons onToggleChange={setToggleState} />
        </div>
      </div>

      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <HvStack direction="column" divider spacing="sm">
            <IndividualKPI kpiData={kpiData} ricon={radioicon} gicon={gradioicon} rbell={rbell} />
            <Alertbar />
          </HvStack>
          <IndividualParameters sampleData={sampleData} />
          <Box mt={2}>
            <PlotlyDataChart data={chartData} />
          </Box>
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart responseData={responseData} />
          </Box>
          <Box width={"50%"}>
            <OutlierChart responseData={responseData} />
          </Box>
        </Box>

        {/* Conditional Rendering for IntensityChart and PredictionChart */}
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
    </Box>
  );
};
