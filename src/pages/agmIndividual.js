import React, { useEffect, useMemo, useState } from 'react';
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
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from 'dayjs';
import { fetchAGMParamChartData, fetchAnomalyChartData, fetchOutlierChartData } from '../service/AGMSensorService';
import { fetchDeviceNotifications } from '../service/notificationService';
import BreadCrumbsIndividual from '../components/BreadCrumbsIndividual';
import Connectivitydata from '../components/Connectivitydata';
import IntensityChart from '../components/IntensityChart';
import PredictionChart from '../components/PredictionChart';
import amberBell from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";
import aicon from "../assets/aRadiological.svg";
import greyradio from "../assets/greyRadio.svg";

const AgmIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [agmParamChartData, setAgmParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [param, setParam] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [lastFetchTimes, setLastFetchTimes] = useState({
    plotly: null,
    anomaly: null,
    outlier: null
  });
  const [LastFetchLiveData, setLastFetchLiveData] = useState(null);

  const [plotlyRange, setPlotlyRange] = useState({ fromTime: null, toTime: null });
  const [anomalyRange, setAnomalyRange] = useState({ fromTime: null, toTime: null });
  const [outlierRange, setOutlierRange] = useState({ fromTime: null, toTime: null });
  const [intensityData, setIntensityData] = useState({});

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

    // Memoized device ID
    const deviceId = useMemo(() => {
      const queryParams = new URLSearchParams(window.location.search);
      return queryParams.get("device_id");
    }, []);
    
  // Real-time data connection (SSE/WebSocket)
  useEffect(() => {
    const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Error receiving data:", err);
      } else {
        setKpiData(data.kpiData);
        setParamsData(data.parametersData);
        setParam(data.parametersData);
        setLastFetchLiveData(data.lastfetched.time);
        setIntensityData(data["Intensity Data"]);
      }
    });

    return () => {
      if (eventSource) eventSource.close();
      console.log("Cleaned up WebSocket");
    };
  }, [deviceId]);

  // Polling notifications
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

  // Chart data fetching
  const fetchData = async (fromTime, toTime, component) => {
    if (!fromTime || !toTime) return;

    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);

    try {
      if (component === 'PlotlyDataChart') {
        const chart = await fetchAGMParamChartData(deviceId, formattedFromTime, formattedToTime);
        setAgmParamChartData(chart?.data || {});
      } else if (component === 'AnomalyChart') {
        const anomaly = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
        setAnomalyChartData(anomaly?.data || {});
      } else if (component === 'OutlierChart') {
        const outlier = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
        setOutlierChartData(outlier?.data || {});
      }

      setLastFetchTimes(prev => ({
        ...prev,
        [component.toLowerCase().replace('datachart', '').replace('chart', '')]: new Date().toLocaleString()
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
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

    if (component === 'PlotlyDataChart') {
      setPlotlyRange({ fromTime, toTime });
    } else if (component === 'AnomalyChart') {
      setAnomalyRange({ fromTime, toTime });
    } else if (component === 'OutlierChart') {
      setOutlierRange({ fromTime, toTime });
    }
  };

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

  const setLocationDetails = (floor, zone, location, sensorType) => {
    setUdatedLocationDetails({
      floor: floor || locationDetails.floor,
      zone: zone || locationDetails.zone,
      location: location || locationDetails.location,
      sensorType: sensorType || locationDetails.sensorType
    });
  };

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BreadCrumbsIndividual locationDetails={locationDetails} />
        <Box style={{ whiteSpace: "nowrap" }}>
          {LastFetchLiveData && <span>Last Live Data fetched time: {LastFetchLiveData}</span>}
        </Box>
      </div>
      <Box mt={2}>
        <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} />
      </Box>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <HvStack direction="column" divider spacing="sm">
          <IndividualKPI
            kpiData={kpiData}
            ricon={bioicon}
            gicon={gbioicon}
            rbell={rbell}
            amberBell={amberBell}
            greenBell={greenBell}
            aicon={aicon}
            greyIcon={greyradio}
            dummyKpiData={[
              { title: "Radiological Alarms", value: "No Data" },
              { title: "Detector Health Faults", value: "No Data" },
              { title: "Analytics Alert", value: "No Data" }
            ]}
          />
        </HvStack>
        <Box mt={2}>
          <IndividualParameters paramsData={param} notifications={notifications} />
        </Box>
        <Box mt={2}>
          <PlotlyDataChart
            bioParamChartData={agmParamChartData}
            onRangeChange={(range) => handleRangeChange(range, 'PlotlyDataChart')}
            title={'Radiation Readings'}
            lastFetchTime={lastFetchTimes.plotly}
          />
        </Box>
        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart
              anomalyChartData={anomalyChartData}
              onRangeChange={(range) => handleRangeChange(range, 'AnomalyChart')}
              title={'Anomaly Detection'}
              lastFetchTime={lastFetchTimes.anomaly}
            />
          </Box>
          <Box width={"50%"}>
            <OutlierChart
              outlierChartData={outlierChartData}
              onRangeChange={(range) => handleRangeChange(range, 'OutlierChart')}
              title={'Outlier Detection'}
              lastFetchTime={lastFetchTimes.outlier}
            />
          </Box>
        </Box>
        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width="50%">
            <IntensityChart intensityData={intensityData}/>
          </Box>
          <Box width="50%">
            <PredictionChart />
          </Box>
        </Box>
        <Connectivitydata />
      </Box>
    </Box>
  );
};
export default AgmIndividual;
