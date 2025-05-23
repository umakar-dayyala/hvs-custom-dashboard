import React, { useEffect, useRef, useState } from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvStack } from '@hitachivantara/uikit-react-core';

import { Alert, Box } from '@mui/material';

import Alertbar from '../components/Alertbar';

import { getLiveStreamingDataForSensors } from "../service/WebSocket";

import BreadCrumbsIndividual from '../components/BreadCrumbsIndividual';


const OxygenMonitor = () => {

  const [kpiData, setKpiData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [param, setParam] = useState([]);
const [LastFetchLiveData, setLastFetchLiveData] = useState(null);
  

  const [locationDetails, setUdatedLocationDetails] = useState({
      floor: 'default',
      zone: 'default',
      location: 'default',
      sensorType: 'default'
    });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
  
    const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Error receiving data:", err);
      } else {
        setKpiData(data.kpiData);
        setParam(data.parametersData);
        setNotifications(data.Notifications);    
        setLastFetchLiveData(data.lastfetched.time); 
      }
    });
  
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("WebSocket closed");
      }
    };
  }, []);
  

  const setLocationDetails=(floor,zone,location,sensorType) => {
    setUdatedLocationDetails({
      floor: floor || locationDetails.floor,
      zone: zone || locationDetails.zone,
      location: location || locationDetails.location,
      sensorType: sensorType || locationDetails.sensorType
    });
    
  }

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* <Breadcrumbs /> */}
        <BreadCrumbsIndividual locationDetails={locationDetails}/>
        <div style={{ display: "flex", gap: "10px" ,alignItems:"center"}}>
        <Box style={{ whiteSpace: "nowrap" }}>
  {LastFetchLiveData && (
    <span>Last Live Data fetched time: {LastFetchLiveData}</span>
  )}
</Box>

          
         
        </div>
      </div>
     <Box mt={2}>
      <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} />
      </Box>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <HvStack direction="column" divider spacing="sm">
           
            {/* <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} /> */}
          </HvStack>
          {/* <Box mt={2} style={{ display: "flex", flexDirection: "row" ,justifyContent:"flex-end"}}>
  {LastFetchLiveData && (
    <span>Last Live Data fetched time: {LastFetchLiveData}</span>
  )}
</Box> */}
<Box mt={2}>
          <IndividualParameters paramsData={param} />
          </Box>
          
        </Box>

       

       
      

      </Box>
      
    </Box>
  );
}

export default OxygenMonitor