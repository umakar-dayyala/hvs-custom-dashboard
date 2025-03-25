import React, { useEffect, useRef, useState } from 'react';
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


export const VRMIndividual = () => {
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

  // Track initial mount
  const initialMount = useRef(true);

  // Initialize with default 5-minute ranges
  const defaultRange = {
    fromTime: dayjs().subtract(5, 'minute').toISOString(),
    toTime: dayjs().toISOString()
  };

  // Time range states with default values
  const [plotlyRange, setPlotlyRange] = useState(defaultRange);
  const [anomalyRange, setAnomalyRange] = useState(defaultRange);
  const [outlierRange, setOutlierRange] = useState(defaultRange);

  const formatDateForApi = (isoDate) => {
    return `'${dayjs(isoDate).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };

  useEffect(() => {
    // Real-time WebSocket data updates
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

    const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Error receiving data:", err);
      } else {
        setKpiData(data.kpiData);
        setParamsData(data.parametersData);
        setAddParams(data.supervisor_data);
        setParam(data.parametersData);
        setNotifications(data.Notifications);
      }
    });

    // Initial data fetch for all charts
    if (initialMount.current) {
      fetchData(defaultRange.fromTime, defaultRange.toTime, 'PlotlyDataChart');
      fetchData(defaultRange.fromTime, defaultRange.toTime, 'AnomalyChart');
      fetchData(defaultRange.fromTime, defaultRange.toTime, 'OutlierChart');
      initialMount.current = false;
    }

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("WebSocket closed");
      }
    };
  }, []);

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

    // Only update if range actually changed
    if (component === 'PlotlyDataChart') {
      if (fromTime !== plotlyRange.fromTime || toTime !== plotlyRange.toTime) {
        setPlotlyRange({ fromTime, toTime });
      }
    } else if (component === 'AnomalyChart') {
      if (fromTime !== anomalyRange.fromTime || toTime !== anomalyRange.toTime) {
        setAnomalyRange({ fromTime, toTime });
      }
    } else if (component === 'OutlierChart') {
      if (fromTime !== outlierRange.fromTime || toTime !== outlierRange.toTime) {
        setOutlierRange({ fromTime, toTime });
      }
    }
  };

  // Fetch data when ranges change (skipping initial mount)
  useEffect(() => {
    if (!initialMount.current) {
      fetchData(plotlyRange.fromTime, plotlyRange.toTime, 'PlotlyDataChart');
    }
  }, [plotlyRange]);

  useEffect(() => {
    if (!initialMount.current) {
      fetchData(anomalyRange.fromTime, anomalyRange.toTime, 'AnomalyChart');
    }
  }, [anomalyRange]);

  useEffect(() => {
    if (!initialMount.current) {
      fetchData(outlierRange.fromTime, outlierRange.toTime, 'OutlierChart');
    }
  }, [outlierRange]);

  
  

  // Toggle state handling
  const handleToggleClick = (state) => {
    if (toggleState === "Operator" && state === "Supervisor") {
      setNewState(state);
      setShowModal(true);
    } else {
      setToggleState(state);
    }
  };

  const handleConfirmChange = () => {
    if (newState) {
      setToggleState(newState);
    }
    setShowModal(false);
  };

  const handleCancelChange = () => {
    setNewState(null);
    setShowModal(false);
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
          <IndividualKPI kpiData={kpiData} ricon={radioicon} gicon={gradioicon} rbell={rbell} amberBell={amberBell}  greenBell ={greenBell} aicon={aicon}
          dummyKpiData={[
            { title: "Radiological Alarms", value: "No Live Data" },
            { title: "Detector Health Faults", value: "No Live Data" },
            { title: "Analytics Alert", value: "No Live Data" }
          ]}/>
          <Alertbar />
        </HvStack>
        <IndividualParameters paramsData={param} notifications={notifications} />
        <Box mt={2}>
          <PlotlyDataChart bioParamChartData={vrmParamChartData} onRangeChange={(range) => handleRangeChange(range, 'PlotlyDataChart')} title={'Radiation Readings'}
           />
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart
              anomalyChartData={anomalyChartData}
              onRangeChange={(range) => handleRangeChange(range, "AnomalyChart")}
              title={'Anomaly Detection'}
            />
          </Box>
          <Box width={"50%"}>
            <OutlierChart
              outlierChartData={outlierChartData}
              onRangeChange={(range) => handleRangeChange(range, "OutlierChart")}
              title={'Outlier Detection'}
            />
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

      {showModal && <ConfirmationModal open={showModal} onClose={handleCancelChange} onConfirm={handleConfirmChange} title="Confirm Role Change" message="Are you sure you want to switch to Supervisor mode?" />}
    </Box>
  );
};
