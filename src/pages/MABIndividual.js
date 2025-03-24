import React, { useEffect, useState } from 'react';
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
import Breadcrumbs from '../components/Breadcrumbs';
import ToggleButtons from '../components/ToggleButtons';
import {
  fetchMABParamChartData,
  fetchAnomalyChartData,
  fetchOutlierChartData,
} from "../service/MABSensorService";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from "dayjs";
import ConfirmationModal from '../components/ConfirmationModal';
import amberBell  from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";


export const MABIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [mabParamChartData, setMabParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);
   const [notifications,setNotifications]=useState([]);
    const [param,setParam]=useState([]);

  // Separate time ranges for each component
  const [plotlyRange, setPlotlyRange] = useState({ fromTime: null, toTime: null });
  const [anomalyRange, setAnomalyRange] = useState({ fromTime: null, toTime: null });
  const [outlierRange, setOutlierRange] = useState({ fromTime: null, toTime: null });

  const formatDateForApi = (isoDate) => {
    return `'${dayjs(isoDate).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };

  useEffect(() => {
    // Real-time data updates (WebSocket)
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id") || "1149";

    const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Error receiving data:", err);
      } else {
        setKpiData(data.kpiData);
        setParamsData(data.parametersData);
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

  // Fetch Data Function (includes fromTime and toTime)
  const fetchData = async (fromTime, toTime, component) => {
    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);

    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    console.log("Device ID: ", deviceId);

    try {
      if (component === 'PlotlyDataChart') {
        const chart = await fetchMABParamChartData(deviceId, formattedFromTime, formattedToTime);
        setMabParamChartData(chart.data);
      } else if (component === 'AnomalyChart') {
        const anomaly = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
        setAnomalyChartData(anomaly.data);
      } else if (component === 'OutlierChart') {
        const outlier = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
        setOutlierChartData(outlier.data);
      }
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

  // Fetch data when the range changes for each component
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
      setNewState(state); // Store new state temporarily
      setShowModal(true); // Show confirmation modal
    } else {
      setToggleState(state); // Directly update state if no confirmation needed
    }
  };

  const handleConfirmChange = () => {
    if (newState) {
      setToggleState(newState); // Apply only confirmed changes
    }
    setShowModal(false); // Close modal
  };

  const handleCancelChange = () => {
    setNewState(null); // Reset temporary state
    setShowModal(false); // Close modal without changing state
  };

  return (
    <Box>
      <Box>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Breadcrumbs />
          <div style={{ display: "flex", gap: "10px" }}>
            <ToggleButtons onToggleChange={handleToggleClick} currentRole={toggleState} />
          </div>
        </div>

        <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <HvStack direction="column" divider spacing="sm">
              <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} amberBell={amberBell} greenBell={greenBell}/>
              <Alertbar />
            </HvStack>
            <IndividualParameters paramsData={param} notifications={notifications}/>
            <Box mt={2}>
              <PlotlyDataChart
                bioParamChartData={mabParamChartData}
                onRangeChange={(range) => handleRangeChange(range, 'PlotlyDataChart')}
              />
            </Box>
          </Box>

          <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
            <Box width={"50%"}>
              <AnomalyChart
                anomalyChartData={anomalyChartData}
                onRangeChange={(range) => handleRangeChange(range, 'AnomalyChart')}
              />
            </Box>
            <Box width={"50%"}>
              <OutlierChart
                outlierChartData={outlierChartData}
                onRangeChange={(range) => handleRangeChange(range, 'OutlierChart')}
              />
            </Box>
          </Box>

          {/* Conditional Rendering for PredictionChart */}
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
      </Box>
      {showModal && (
        <ConfirmationModal
          open={showModal}
          onClose={handleCancelChange}
          onConfirm={handleConfirmChange}
          title="Confirm Role Change"
          message="Are you sure you want to switch to Supervisor mode?"
        />
      )}
    </Box>
  );
};