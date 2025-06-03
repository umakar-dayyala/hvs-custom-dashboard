import React, { useEffect, useState, useCallback, useMemo } from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvStack } from '@hitachivantara/uikit-react-core';
import OutlierChart from '../components/OutlierChart';
import AnomalyChart from '../components/AnomalyChart';
import { Box } from '@mui/material';
import bioicon from "../assets/rBiological.svg";
import gbioicon from "../assets/gBiological.svg";
import PlotlyDataChart from '../components/PlotlyDataChart';
import rbell from "../assets/rbell.svg";
import Alertbar from '../components/Alertbar';
import PredictionChart from '../components/PredictionChart';
import IntensityChart from '../components/IntensityChart';
import BreadCrumbsIndividual from '../components/BreadCrumbsIndividual';
import Connectivitydata from '../components/Connectivitydata';
import {
  fetchMABParamChartData,
  fetchAnomalyChartData,
  fetchOutlierChartData,
  fetchASUData,
} from "../service/MABSensorService";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from "dayjs";
import amberBell from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";
import aicon from "../assets/aBiological.svg";
import greyBio from "../assets/greyBio.svg";
import { fetchDeviceNotifications } from '../service/notificationService';

export const MABIndividual = React.memo(() => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [paramsData, setParamsData] = useState([]);
  const [mabParamChartData, setMabParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [param, setParam] = useState([]);
  const [lastFetchTimes, setLastFetchTimes] = useState({
    plotly: null,
    anomaly: null,
    outlier: null
  });
  const [LastFetchLiveData, setLastFetchLiveData] = useState(null);

  // State to hold ASU data (replacing dummy AsmData)
  const [asmData, setAsmData] = useState({
    fan_status: "OK",
    pump_status: "OK",
    cyclone_fluid: "OK",
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

  // Memoized device ID
  const deviceId = useMemo(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("device_id");
  }, []);

  // Memoized date formatter
  const formatDateForApi = useCallback((date) => {
    if (!date) return null;
    return `'${dayjs(date).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  }, []);

  // WebSocket connection for live streaming data
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

  // Fetch ASU Data every 10 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchASU = async () => {
      if (!deviceId) return;
      try {
        const response = await fetchASUData(deviceId);
        // Expecting response.data to be an array with one object
        if (isMounted && response?.data && response.data.length > 0) {
          const asu = response.data[0];
          setAsmData({
            fan_status: asu.fan_status ?? "N/A",
            pump_status: asu.pump_status ?? "N/A",
            cyclone_fluid: asu.cyclone_fluid ?? "N/A",
          });
        }
      } catch (error) {
        console.error("Error fetching ASU data:", error);
      }
    };

    fetchASU();
    const interval = setInterval(fetchASU, 10000); // 10 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [deviceId]);

  // Memoized fetch data function
  const fetchData = useCallback(async (fromTime, toTime, component) => {
    if (!fromTime || !toTime || !deviceId) return;

    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);

    try {
      let response;
      switch (component) {
        case 'PlotlyDataChart':
          response = await fetchMABParamChartData(deviceId, formattedFromTime, formattedToTime);
          setMabParamChartData(response?.data || {});
          break;
        case 'AnomalyChart':
          response = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
          setAnomalyChartData(response?.data || {});
          break;
        case 'OutlierChart':
          response = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
          setOutlierChartData(response?.data || {});
          break;
      }

      // Update last fetch time on success
      setLastFetchTimes(prev => ({
        ...prev,
        [component.toLowerCase().replace('datachart', '').replace('chart', '')]: new Date().toLocaleString()
      }));
    } catch (error) {
      console.error(`Error fetching ${component} data:`, error);
    }
  }, [deviceId, formatDateForApi]);

  // Range change handlers
  const handlePlotlyRangeChange = useCallback((range) => {
    handleRangeChange(range, 'PlotlyDataChart', setPlotlyRange);
  }, []);

  const handleAnomalyRangeChange = useCallback((range) => {
    handleRangeChange(range, 'AnomalyChart', setAnomalyRange);
  }, []);

  const handleOutlierRangeChange = useCallback((range) => {
    handleRangeChange(range, 'OutlierChart', setOutlierRange);
  }, []);

  // Generic range change handler
  const handleRangeChange = useCallback((range, component, setRange) => {
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

    setRange({ fromTime, toTime });
  }, []);

  // Fetch data when ranges change
  useEffect(() => {
    if (plotlyRange.fromTime && plotlyRange.toTime) {
      fetchData(plotlyRange.fromTime, plotlyRange.toTime, 'PlotlyDataChart');
    }
  }, [plotlyRange, fetchData]);

  useEffect(() => {
    if (anomalyRange.fromTime && anomalyRange.toTime) {
      fetchData(anomalyRange.fromTime, anomalyRange.toTime, 'AnomalyChart');
    }
  }, [anomalyRange, fetchData]);

  useEffect(() => {
    if (outlierRange.fromTime && outlierRange.toTime) {
      fetchData(outlierRange.fromTime, outlierRange.toTime, 'OutlierChart');
    }
  }, [outlierRange, fetchData]);

  // Memoized layout values based on toggle state
  const chartLayout = useMemo(() => {
    return toggleState === "Operator" ? "100%" : "33.33%";
  }, [toggleState]);

  const setLocationDetails = (floor, zone, location, sensorType) => {
    setUdatedLocationDetails({
      floor: floor || locationDetails.floor,
      zone: zone || locationDetails.zone,
      location: location || locationDetails.location,
      sensorType: sensorType || locationDetails.sensorType
    });
  }

  return (
    <Box>
      <Box>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BreadCrumbsIndividual locationDetails={locationDetails} />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
              <IndividualKPI
                kpiData={kpiData}
                ricon={bioicon}
                gicon={gbioicon}
                rbell={rbell}
                amberBell={amberBell}
                greenBell={greenBell}
                aicon={aicon}
                greyIcon={greyBio}
                dummyKpiData={[
                  { title: "Biological Alarms", value: "No Data" },
                  { title: "Detector Health Faults", value: "No Data" },
                  { title: "Analytics Alert", value: "No Data" }
                ]}
              />
              {/* <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} /> */}
            </HvStack>

            {/* Pass the actual asmData instead of dummy data */}
            <Box mt={2}>
            <IndividualParameters paramsData={param} notifications={notifications} AsmData={asmData} />
            </Box>

            <Box mt={2}>
              <PlotlyDataChart
                bioParamChartData={mabParamChartData}
                onRangeChange={handlePlotlyRangeChange}
                title={'Biological Readings'}
                lastFetchTime={lastFetchTimes.plotly}
              />
            </Box>
          </Box>

          <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
            <Box width={"50%"}>
              <AnomalyChart
                anomalyChartData={anomalyChartData}
                onRangeChange={handleAnomalyRangeChange}
                title={'Anomaly Detection'}
                lastFetchTime={lastFetchTimes.anomaly}
              />
            </Box>

            <Box width={"50%"}>
              <OutlierChart
                outlierChartData={outlierChartData}
                onRangeChange={handleOutlierRangeChange}
                title={'Outlier Detection'}
                lastFetchTime={lastFetchTimes.outlier}
              />
            </Box>
          </Box>

          <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
            <Box width={"50%"} >
              <IntensityChart />
            </Box>

            <Box width={"50%"}>
              <PredictionChart />
            </Box>

          </Box>
          <Connectivitydata />
        </Box>
      </Box>
    </Box>
  );
});
