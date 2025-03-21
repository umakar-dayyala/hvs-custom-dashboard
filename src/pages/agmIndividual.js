import React from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvStack } from '@hitachivantara/uikit-react-core';
import OutlierChart from '../components/OutlierChart';
import AnomalyChart from '../components/AnomalyChart';
import { Box } from '@mui/material';
import bioicon from "../assets/rRadiological.svg";
import gbioicon from "../assets/gRadiological.svg";
import PlotlyDataChart from '../components/PlotlyDataChart';
import rbell from "../assets/rbell.svg";
import Alertbar from '../components/Alertbar';

const sampleData = [{
  "Radiation Readings": {
    "radiation_parameters": "Values",
    "dose_rate": "999999",
   
  },
  "Device Faults": {
    "fault_parameters": "Status",
    "lv_status": "Fault",
    "det_statu": "Healthy",
    "rtc_status": "Fault",
    "HV Status": "Healthy",
    "sd_card_tatus ": "Fault",
    "mother_board_controller_status": "Healthy"
  },
  "AGM Sensor Health Reading": {
    "health_parameters": "Values",
    "HV (High Voltage)": "00"
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
  "dose rate": [2, 3, 1, 5, 4, 6],
  "Over Range ": [5, 8, 6, 9, 7, 10],
  "Over load": [10, 12, 14, 15, 16, 18],
 
};

const kpiData = [
  { "title": "Dose Rate Alarm", "value": "01" },
  { "title": "Over Range", "value": "00" },
  { "title": "Over Load", "value": "01" },
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
      "label": "Dose rate",
      "data": [2325, 2330, 2338, 2345, 2350, 2360, 2375, 2380, 2390, 2400],
      "anomalyValues": [0, 0, 0, 0, 0, 1],
    },
    {
      "label": "Over Load",
      "data": [208636, 208636, 208636, 208636, 208636, 208636],
      "anomalyValues": [0, 0, 0, 0, 0, 1],
    },
    {
      "label": "Over Range",
      "data": [208636, 150, 208636, 208636, 208636, 208636],
      "anomalyValues": [0, 0, 0, 0, 0, 1],
    },

  ],
};

export const AgmIndividual = () => {
    return (
        <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <HvStack direction="column" divider spacing="sm">
              <IndividualKPI kpiData={kpiData} bioicon={bioicon} gbioicon={gbioicon}  rbell={rbell}/>
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
        </Box>
      );
    };