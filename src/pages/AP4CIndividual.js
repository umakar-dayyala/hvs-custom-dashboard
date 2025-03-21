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
import IntensityChart from '../components/IntensityChart';
import PredictionChart from '../components/PredictionChart';
import chemicon from "../assets/rChemical.svg";
import gchemicon from "../assets/gChemical.svg";
import Corelation from '../components/Corelation';

const dummyData = [
  { alarmCount: 1, alarmType: "Bio Alarm", location: "Lab A", timeRange: "10:00 AM - 10:20 AM" },
];

const sampleData = [{
  "Values": {
    "Hydrocarbon concentration (CH)": "82",
    "Arsenic Concentration (CAS) (mg/m3)": "09",
    "Cyanide Concentration (CHNO) (mg/m3)": "09",
    "Phosphorus Concentration (CP) (ug/m3)": "09",
    "Sulphur Concentration (CS) (mg/m3)": "09",
  },
  "Health Faults": {
    "Power Supply too low ": "BG Low",
    "Device Fault": "BG High",
    "Lack of Hydrogen": "Fault",
    "Maintenance Required": "Fault",
    " Purge (Pendind)": "Fault",
    " Monitor": "Fault",
  },
  "System Settings  ": {
    "Detector Ready": "No Fault",
    "Test Mode in Progress  ": "No Fault",
    
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
  "DET 02 Count": [5, 8, 6, 9, 7, 10],
};

const kpiData = [
  { "title": "AlrmCH", "value": "01" },
  { "title": "Alarm As", "value": "00" },
  { "title": "Alarm CN", "value": "00" },
  { "title": "Alarm G", "value": "00" },
  { "title": " Alarm HD", "value": "00" },
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

export const AP4CIndividual = () => {
  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <HvStack direction="column" divider spacing="sm">
          <IndividualKPI kpiData={kpiData} ricon={chemicon} gicon={gchemicon}  rbell={rbell}/>
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

      <Box 
  style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "stretch" }} 
  mt={2} 
  gap={2}
>
  <Box width={"33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <IntensityChart />
  </Box>
  <Box width={"33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <Corelation />
  </Box>
  <Box width={"33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <PredictionChart />
  </Box>
</Box>
    </Box>
  );
};