import React, { useEffect, useState } from 'react';
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
  const [param,setParam]=useState([]);
  const [notifications,setNotifications]=useState([]);

  // Time range states
  const [plotlyRange, setPlotlyRange] = useState({ fromTime: null, toTime: null });
  const [anomalyRange, setAnomalyRange] = useState({ fromTime: null, toTime: null });
  const [outlierRange, setOutlierRange] = useState({ fromTime: null, toTime: null
  });

  const formatDateForApi = (isoDate)   => {
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

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("WebSocket closed");
      }
    };
  }, []); // Run once on mount

  // Fetch Data Function
  const fetchData = async (fromTime, toTime, component) => {
    if (!fromTime || !toTime) return;

    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

    try {
      if (component === 'PlotlyDataChart') {
        const chart = await fetchVRMParamChartData(deviceId, formattedFromTime, formattedToTime);
        setVRMParamChartData(chart?.data || {}); // Ensure it's not null
      } else if (component === 'AnomalyChart') {
        const anomaly = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
        setAnomalyChartData(anomaly?.data || {}); // Ensure it's not null
      }
       else if (component === 'OutlierChart') {
        const outlier = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
        setOutlierChartData(outlier?.data || {}); // Ensure it's not null
      }
    } catch (error) {
      console.error(`Error fetching ${component} data:`, error);
      if (component === 'OutlierChart') setOutlierChartData({});
    }
  };

  const handleRangeChange = (range, component) => {
    const fromTime = new Date(range[0]); // Ensure it's a Date object
    const toTime = new Date(range[1]);
  
    if (isNaN(fromTime) || isNaN(toTime)) {
      console.error("Invalid date range:", range);
      return;
    }
  
    if (component === 'PlotlyDataChart') {
      setPlotlyRange({ fromTime: fromTime.toISOString(), toTime: toTime.toISOString() });
    } else if (component === 'AnomalyChart') {
      setAnomalyRange({ fromTime: fromTime.toISOString(), toTime: toTime.toISOString() });
    } else if (component === 'OutlierChart') {
      setOutlierRange({ fromTime: fromTime.toISOString(), toTime: toTime.toISOString() });
    }
  };
  

  // Fetch data on range changes
  useEffect(() => {
    fetchData(plotlyRange.fromTime, plotlyRange.toTime, 'PlotlyDataChart');
  }, [plotlyRange]);

  useEffect(() => {
    fetchData(anomalyRange.fromTime, anomalyRange.toTime, 'AnomalyChart');
  }, [anomalyRange]);

  useEffect(() => {
    fetchData(outlierRange.fromTime, outlierRange.toTime, 'OutlierChart');
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
          <IndividualKPI kpiData={kpiData} ricon={radioicon} gicon={gradioicon} rbell={rbell} amberBell={amberBell}  greenBell ={greenBell}/>
          <Alertbar />
        </HvStack>
        <IndividualParameters paramsData={param} notifications={notifications} />
        <Box mt={2}>
          <PlotlyDataChart bioParamChartData={vrmParamChartData} onRangeChange={(range) => handleRangeChange(range, 'PlotlyDataChart')} title={'Radiation Readings'} />
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
