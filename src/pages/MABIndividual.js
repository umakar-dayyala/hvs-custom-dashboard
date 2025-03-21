import React from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvStack } from '@hitachivantara/uikit-react-core';
import OutlierChart from '../components/OutlierChart';
import AnomalyChart from '../components/AnomalyChart';
import { Alert, Box } from '@mui/material';
import PlotlyDataChart from '../components/PlotlyDataChart';
import rbell from "../assets/rbell.svg";
import Alertbar from '../components/Alertbar';
import PredictionChart from '../components/PredictionChart';
import IntensityChart from '../components/IntensityChart';
import bioicon from "../assets/rBiological.svg";
import gbioicon from "../assets/gBiological.svg";


const dummyData = [
  { alarmCount: 1, alarmType: "Bio Alarm", location: "Lab A", timeRange: "10:00 AM - 10:20 AM" },
];

const sampleData = [{
  "Values": {
    "BG1 Count": "82",
    " BG2 Count": "09",
    "BG3 Count": "09",
    
  },
  "Health Faults": {
    "Hydrogen Lack ": "BG Low",
    "Device Defect": "Fault",
    "Maintenance Required": "Fault",
    "Waiting": "Fault",
  },
  "System Settings  ": {
    "Detector Ready": "True",
    " Waking State": "True",
    "Test Mode in Progress":"04",
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
  { "title": "AG Bio", "value": "01" },
  { "title": "Device Defect", "value": "00" },
  { "title": "Maintainance Request", "value": "00" },
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

export const MABIndividual = () => {
  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <HvStack direction="column" divider spacing="sm">
          <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon}  rbell={rbell}/>
          {/* <Alertbar alerts={dummyData} /> */}
          <Alertbar/>
          
        </HvStack>
        <IndividualParameters sampleData={sampleData} />
        {/* <ChartComponent /> */}
        <Box mt={2}>
        <PlotlyDataChart data={chartData} />
        </Box>
      </Box>
      <Box style={{ display: "flex", flexDirection: "row", width: "100%"  }} mt={2} gap={2}>
        {/* <div style={{ flex: 1, minWidth: "48%" }}> */}
          <Box width={"50%"} > 
          <AnomalyChart responseData={responseData} />
          </Box>
        {/* </div> */}
        {/* <div style={{ flex: 1, minWidth: "48%" }}> */}
          <Box width={"50%"}>
            <OutlierChart responseData={responseData} />
          </Box>
        {/* </div> */}
      </Box>

      <Box style={{ display: "flex", flexDirection: "row", width: "100%"  }} mt={2} gap={2}>
        {/* <div style={{ flex: 1, minWidth: "48%" }}> */}
          <Box width={"50%"} > 
          <IntensityChart/>
          </Box>
        {/* </div> */}
        {/* <div style={{ flex: 1, minWidth: "48%" }}> */}
          <Box width={"50%"}>
            <PredictionChart/>
          </Box>
        {/* </div> */}
      </Box>
    </Box>
  );
};