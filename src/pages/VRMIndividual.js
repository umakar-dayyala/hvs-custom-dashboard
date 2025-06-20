import React, { useEffect, useMemo, useRef, useState } from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvStack } from '@hitachivantara/uikit-react-core';
import OutlierChart from '../components/OutlierChart';
import AnomalyChart from '../components/AnomalyChart';
import { Box } from '@mui/material';
import PlotlyDataChart from '../components/PlotlyDataChart';
import rbell from "../assets/rbell.svg";
import Alertbar from '../components/Alertbar';
import radioicon from "../assets/rRadiological.svg";
import gradioicon from "../assets/gRadiological.svg";
import IntensityChart from '../components/IntensityChart';
import PredictionChart from '../components/PredictionChart';
import VRMadditionalParameters from '../components/VRMadditionalParameters';
import Breadcrumbs from '../components/Breadcrumbs';
import ToggleButtons from '../components/ToggleButtons';
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from 'dayjs';
import { fetchVRMParamChartData, fetchAnomalyChartData, fetchOutlierChartData } from '../service/VRMSensorService';
import ConfirmationModal from '../components/ConfirmationModal';
import amberBell  from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";
import aicon from "../assets/aRadiological.svg";
import greyradio from "../assets/greyRadio.svg";
import BreadCrumbsIndividual from '../components/BreadCrumbsIndividual';
import Connectivitydata from '../components/Connectivitydata';
import Imagedata from '../components/Imagedata';
import { fetchDeviceNotifications } from '../service/notificationService';



const VRMIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [vrmParamChartData, setVRMParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);
  const [addParams, setAddParams] = useState([]);
  const [param, setParam] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [LastFetchLiveData, setLastFetchLiveData] = useState(null);
  const [intensityData, setIntensityData] = useState({});

   const [lastFetchTimes, setLastFetchTimes] = useState({
        plotly: null,
        anomaly: null,
        outlier: null,
      });

  // Time range states initialized as null
  const [plotlyRange, setPlotlyRange] = useState({ fromTime: null, toTime: null });
  const [anomalyRange, setAnomalyRange] = useState({ fromTime: null, toTime: null });
  const [outlierRange, setOutlierRange] = useState({ fromTime: null, toTime: null });

  const [locationDetails, setUdatedLocationDetails] = useState({
      floor: 'default',
      zone: 'default',
      location: 'default',
      sensorType: 'default'
    });

  const formatDateForApi = (isoDate) => {
    if (!isoDate) return null;
    return `'${dayjs(isoDate).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };

  const deviceId = useMemo(() => {
         const queryParams = new URLSearchParams(window.location.search);
         return queryParams.get("device_id");
       }, []);
  
    // WebSocket connection
      useEffect(() => {
        if (!deviceId) return;
    
        const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
          if (err) {
            console.error("Error receiving data:", err);
          } else {
            setKpiData(data.kpiData);
            setParamsData(data.parametersData);
            setParam(data.parametersData);
            // setNotifications(data.Notifications);
            setLastFetchLiveData(data.lastfetched.time); 
            setIntensityData(data["Intensity Data"]);
          }
        });
    
        return () => {
          if (eventSource) {
            eventSource.close();
            console.log("WebSocket closed");
          }
        };
      }, [deviceId]);
  
     useEffect(() => {
              const loadNotifications = async () => {
                const data = await fetchDeviceNotifications(deviceId);
                setNotifications(data);
                console.log("Fetched notifications:", data);
              };
          
              loadNotifications(); // initial fetch
          
              const intervalId = setInterval(loadNotifications, 10000); // fetch every 10s
          
              return () => {
                clearInterval(intervalId);
                console.log("Cleaned up polling");
              };
            }, [deviceId]);

  const fetchData = async (fromTime, toTime, component) => {
    if (!fromTime || !toTime) return;

    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

    try {
      if (component === 'PlotlyDataChart') {
        const chart = await fetchVRMParamChartData(deviceId, formattedFromTime, formattedToTime);
        setVRMParamChartData(chart?.data || {});
      } else if (component === 'AnomalyChart') {
        const anomaly = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
        setAnomalyChartData(anomaly?.data || {});
      } else if (component === 'OutlierChart') {
        const outlier = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
        setOutlierChartData(outlier?.data || {});
      }
      // Update last fetch time on success
      setLastFetchTimes(prev => ({
        ...prev,
        [component.toLowerCase().replace('datachart', '').replace('chart', '')]: new Date().toLocaleString()
      }));
    } catch (error) {
      console.error(`Error fetching ${component} data:`, error);
    }
  };

  const handleRangeChange = (range, component) => {
    if (!Array.isArray(range) || range.length < 2) {
      console.error("Invalid range format:", range);
      return;
    }

    const fromTime = dayjs(range[0]).isValid() ? dayjs(range[0]).toISOString() : null;
    const toTime = dayjs(range[1]).isValid() ? dayjs(range[1]).toISOString() : null;

    if (!fromTime || !toTime) {
      console.error("Invalid date values in range:", range);
      return;
    }

    // Update the appropriate range state
    if (component === 'PlotlyDataChart') {
      setPlotlyRange({ fromTime, toTime });
    } else if (component === 'AnomalyChart') {
      setAnomalyRange({ fromTime, toTime });
    } else if (component === 'OutlierChart') {
      setOutlierRange({ fromTime, toTime });
    }
  };

  // Fetch data when ranges change
  useEffect(() => {
    if (plotlyRange.fromTime && plotlyRange.toTime) {
      fetchData(plotlyRange.fromTime, plotlyRange.toTime, 'PlotlyDataChart');
    }
  }, [plotlyRange]);

  useEffect(() => {
    if (anomalyRange.fromTime && anomalyRange.toTime) {
      fetchData(anomalyRange.fromTime, anomalyRange.toTime, 'AnomalyChart');
    }
  }, [anomalyRange]);

  useEffect(() => {
    if (outlierRange.fromTime && outlierRange.toTime) {
      fetchData(outlierRange.fromTime, outlierRange.toTime, 'OutlierChart');
    }
  }, [outlierRange]);

  
  

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
        <HvStack direction="column" divider spacing="sm">
          <IndividualKPI kpiData={kpiData} ricon={radioicon} gicon={gradioicon} rbell={rbell} amberBell={amberBell} greenBell={greenBell} aicon={aicon} greyIcon={greyradio}
          dummyKpiData={[
            { title: "Radiological Alarms", value: "No Data" },
            { title: "Detector Health Faults", value: "No Data" },
            { title: "Analytics Alert", value: "No Data" }
          ]}/>
          {/* <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} /> */}
        </HvStack>
        {/* <Box mt={2} style={{ display: "flex", flexDirection: "row" ,justifyContent:"flex-end"}}>
          {LastFetchLiveData && (
            <span>Last Live Data fetched time: {LastFetchLiveData}</span>
          )}
        </Box> */}
        <Box mt={2}>
        <IndividualParameters paramsData={param} notifications={notifications} toggleState ={toggleState} />
        </Box>
        <Box mt={2}>
          <PlotlyDataChart 
            bioParamChartData={vrmParamChartData} 
            onRangeChange={(range) => handleRangeChange(range, 'PlotlyDataChart')} 
            title={'Radiation Readings'}
            lastFetchTime={lastFetchTimes.plotly}
          />
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart
              anomalyChartData={anomalyChartData}
              onRangeChange={(range) => handleRangeChange(range, "AnomalyChart")}
              title={'Anomaly Detection'}
              lastFetchTime={lastFetchTimes.anomaly}
            />
          </Box>
          <Box width={"50%"}>
            <OutlierChart
              outlierChartData={outlierChartData}
              onRangeChange={(range) => handleRangeChange(range, "OutlierChart")}
              title={'Outlier Detection'}
              lastFetchTime={lastFetchTimes.outlier}
            />
          </Box>
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={ "50%"}>
            <IntensityChart  intensityData={intensityData}/>
          </Box>
          
            <Box width={"50%"}>
              <PredictionChart />
            </Box>
        
        </Box>
        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
  <Box sx={{ flex: 1 }}>
    <Connectivitydata />
  </Box>
  <Box sx={{ flex: 1 }}>
    <Imagedata/>
  </Box>
</Box>
      </Box>

      
    </Box>
  );
};

export default VRMIndividual;