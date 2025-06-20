import React, { useEffect, useMemo, useRef, useState } from "react";
import IndividualKPI from "../components/IndividualKPI";
import IndividualParameters from "../components/IndividualParameters";
import { HvStack } from "@hitachivantara/uikit-react-core";
import OutlierChart from "../components/OutlierChart";
import AnomalyChart from "../components/AnomalyChart";
import IntensityChart from "../components/IntensityChart";
import PredictionChart from "../components/PredictionChart";
import { Box } from "@mui/material";
import bioicon from "../assets/rBiological.svg";
import gbioicon from "../assets/gBiological.svg";
import PlotlyDataChart from "../components/PlotlyDataChart";
import rbell from "../assets/rbell.svg";
import amberBell from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";
import greyBio from "../assets/greyBio.svg";

import {
  fetchBioParamChartData,
  fetchAnomalyChartData,
  fetchOutlierChartData,
} from "../service/IbacSensorService";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from "dayjs";
import Alertbar from "../components/Alertbar";
import Breadcrumbs from "../components/Breadcrumbs";
import ToggleButtons from "../components/ToggleButtons";
import ConfirmationModal from "../components/ConfirmationModal";
import Corelation from "../components/Corelation";
import aicon from "../assets/aBiological.svg";
import BreadCrumbsIndividual from '../components/BreadCrumbsIndividual';
import Connectivitydata from "../components/Connectivitydata";
import { fetchDeviceNotifications } from "../service/notificationService";

 const IbacIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [bioParamChartData, setBioParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [param, setParam] = useState([]);
  const [LastFetchLiveData, setLastFetchLiveData] = useState(null);
  const [lastFetchTimes, setLastFetchTimes] = useState({
    bioParam: null,
    anomaly: null,
    outlier: null
  });

  const [plotlyTimeRange, setPlotlyTimeRange] = useState({ fromTime: null, toTime: null });
  const [anomalyTimeRange, setAnomalyTimeRange] = useState({ fromTime: null, toTime: null });
  const [outlierTimeRange, setOutlierTimeRange] = useState({ fromTime: null, toTime: null });

  const [locationDetails, setUdatedLocationDetails] = useState({
    floor: 'default',
    zone: 'default',
    location: 'default',
    sensorType: 'default'
  });

  const formatDateForApi = (date) => {
    if (!date) return null;
    return `'${dayjs(date).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
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

  const fetchBioData = async (deviceId, fromTime, toTime) => {
    if (!fromTime || !toTime) return;
    try {
      const response = await fetchBioParamChartData(
        deviceId, 
        formatDateForApi(fromTime), 
        formatDateForApi(toTime)
      );
      setBioParamChartData(response?.data || {});
      setLastFetchTimes(prev => ({
        ...prev,
        bioParam: new Date().toLocaleString()
      }));
    } catch (error) {
      console.error("Error fetching bio data:", error);
    }
  };
  
  const fetchAnomalyData = async (deviceId, fromTime, toTime) => {
    if (!fromTime || !toTime) return;
    try {
      const response = await fetchAnomalyChartData(
        deviceId,
        formatDateForApi(fromTime),
        formatDateForApi(toTime)
      );
      setAnomalyChartData(response?.data || {});
      setLastFetchTimes(prev => ({
        ...prev,
        anomaly: new Date().toLocaleString()
      }));
    } catch (error) {
      console.error("Error fetching anomaly data:", error);
    }
  };
  
  const fetchOutlierData = async (deviceId, fromTime, toTime) => {
    if (!fromTime || !toTime) return;
    try {
      const response = await fetchOutlierChartData(
        deviceId,
        formatDateForApi(fromTime),
        formatDateForApi(toTime)
      );
      setOutlierChartData(response?.data || {});
      setLastFetchTimes(prev => ({
        ...prev,
        outlier: new Date().toLocaleString()
      }));
    } catch (error) {
      console.error("Error fetching outlier data:", error);
    }
  };

  const handlePlotlyRangeChange = (range) => {
    if (!range || range.length < 2) {
      console.error("Invalid range received:", range);
      return;
    }

    const [start, end] = range;
    const fromTime = dayjs(start).isValid() ? dayjs(start).toISOString() : null;
    const toTime = dayjs(end).isValid() ? dayjs(end).toISOString() : null;

    if (!fromTime || !toTime) {
      console.error("Invalid date values:", range);
      return;
    }

    if (fromTime !== plotlyTimeRange.fromTime || toTime !== plotlyTimeRange.toTime) {
      setPlotlyTimeRange({ fromTime, toTime });
    }
  };

  const handleAnomalyRangeChange = (range) => {
    if (!range || range.length < 2) {
      console.error("Invalid range received:", range);
      return;
    }

    const [start, end] = range;
    const fromTime = dayjs(start).isValid() ? dayjs(start).toISOString() : null;
    const toTime = dayjs(end).isValid() ? dayjs(end).toISOString() : null;

    if (!fromTime || !toTime) {
      console.error("Invalid date values:", range);
      return;
    }

    if (fromTime !== anomalyTimeRange.fromTime || toTime !== anomalyTimeRange.toTime) {
      setAnomalyTimeRange({ fromTime, toTime });
    }
  };

  const handleOutlierRangeChange = (range) => {
    if (!range || range.length < 2) {
      console.error("Invalid range received:", range);
      return;
    }

    const [start, end] = range;
    const fromTime = dayjs(start).isValid() ? dayjs(start).toISOString() : null;
    const toTime = dayjs(end).isValid() ? dayjs(end).toISOString() : null;

    if (!fromTime || !toTime) {
      console.error("Invalid date values:", range);
      return;
    }

    if (fromTime !== outlierTimeRange.fromTime || toTime !== outlierTimeRange.toTime) {
      setOutlierTimeRange({ fromTime, toTime });
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    if (deviceId && plotlyTimeRange.fromTime && plotlyTimeRange.toTime) {
      fetchBioData(deviceId, plotlyTimeRange.fromTime, plotlyTimeRange.toTime);
    }
  }, [plotlyTimeRange]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    if (deviceId && anomalyTimeRange.fromTime && anomalyTimeRange.toTime) {
      fetchAnomalyData(deviceId, anomalyTimeRange.fromTime, anomalyTimeRange.toTime);
    }
  }, [anomalyTimeRange]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    if (deviceId && outlierTimeRange.fromTime && outlierTimeRange.toTime) {
      fetchOutlierData(deviceId, outlierTimeRange.fromTime, outlierTimeRange.toTime);
    }
  }, [outlierTimeRange]);

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
          <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} amberBell={amberBell} greenBell={greenBell} aicon={aicon} greyIcon={greyBio}
           dummyKpiData={[
            { title: "Biological Alarms", value: "No Data" },
            { title: "Detector Health Faults", value: "No Data" },
            { title: "Analytics Alert", value: "No Data" }
          ]}/>
          {/* <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} /> */}
        </HvStack>
        <Box mt={2}>
        <IndividualParameters paramsData={param} notifications={notifications} />
        </Box>
        <Box mt={2}>
          <PlotlyDataChart bioParamChartData={bioParamChartData} onRangeChange={handlePlotlyRangeChange} title={'Biological Readings'} lastFetchTime={lastFetchTimes.bioParam} />
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart anomalyChartData={anomalyChartData} onRangeChange={handleAnomalyRangeChange} title={'Anomaly Detection'} lastFetchTime={lastFetchTimes.anomaly}/>
          </Box>
          <Box width={"50%"}>
            <OutlierChart outlierChartData={outlierChartData} onRangeChange={handleOutlierRangeChange} title={'Outlier Detection'} lastFetchTime={lastFetchTimes.outlier}/>
          </Box>
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width="33.33%">
            <IntensityChart />
          </Box>
          <Box width="33.33%">
            <PredictionChart />
          </Box>
          <Box width="33.33%">
            <Corelation />
          </Box>
        </Box>
        <Connectivitydata />
      </Box>
    </Box>
  );
};
export default IbacIndividual;