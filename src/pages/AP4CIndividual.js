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
import IntensityChart from '../components/IntensityChart';
import PredictionChart from '../components/PredictionChart';
import chemicon from "../assets/rChemical.svg";
import gchemicon from "../assets/gChemical.svg";
import Corelation from '../components/Corelation';
import ToggleButtons from '../components/ToggleButtons';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  fetchAP4CParamChartData,
  fetchAnomalyChartData,
  fetchOutlierChartData,
} from "../service/AP4CSensorService";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from "dayjs";
import ConfirmationModal from '../components/ConfirmationModal';
import amberBell  from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";

export const AP4CIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [ap4cParamChartData, setap4cParamChartData] = useState({});
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

  const formatDateForApi = (date) => {
    if (!date) return null;
    // If date is already a Date object or can be converted by dayjs
    return `'${dayjs(date).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };

  useEffect(() => {
    // Real-time data updates (WebSocket)
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

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
      if (component === "PlotlyDataChart") {
        const chart = await fetchAP4CParamChartData(deviceId, formattedFromTime, formattedToTime);
        setap4cParamChartData(chart.data);
      } else if (component === "AnomalyChart") {
        const anomaly = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
        setAnomalyChartData(anomaly.data);
      } else if (component === "OutlierChart") {
        const outlier = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
        setOutlierChartData(outlier.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle Range Change for each component
  const handleRangeChange = (range, component) => {
    if (!range || !range[0] || !range[1]) return;
    
    // Ensure we have valid Date objects
    const fromDate = range[0] instanceof Date ? range[0] : new Date(range[0]);
    const toDate = range[1] instanceof Date ? range[1] : new Date(range[1]);

    if (component === "PlotlyDataChart") {
      setPlotlyRange({ fromTime: fromDate, toTime: toDate });
    } else if (component === "AnomalyChart") {
      setAnomalyRange({ fromTime: fromDate, toTime: toDate });
    } else if (component === "OutlierChart") {
      setOutlierRange({ fromTime: fromDate, toTime: toDate });
    }
  };

  // Fetch data when the range changes for each component
  useEffect(() => {
    if (plotlyRange.fromTime && plotlyRange.toTime) {
      fetchData(plotlyRange.fromTime, plotlyRange.toTime, "PlotlyDataChart");
    }
  }, [plotlyRange]);

  useEffect(() => {
    if (anomalyRange.fromTime && anomalyRange.toTime) {
      fetchData(anomalyRange.fromTime, anomalyRange.toTime, "AnomalyChart");
    }
  }, [anomalyRange]);

  useEffect(() => {
    if (outlierRange.fromTime && outlierRange.toTime) {
      fetchData(outlierRange.fromTime, outlierRange.toTime, "OutlierChart");
    }
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs />
        <div style={{ display: "flex", gap: "10px" }}>
          <ToggleButtons onToggleChange={handleToggleClick} currentRole={toggleState} />
        </div>
      </div>

      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <HvStack direction="column" divider spacing="sm">
            <IndividualKPI kpiData={kpiData} ricon={chemicon} gicon={gchemicon} rbell={rbell}  amberBell={amberBell} greenBell={greenBell}/>
            <Alertbar />
          </HvStack>
          <IndividualParameters paramsData={param}  notifications={notifications}/>
          <Box mt={2}>
            <PlotlyDataChart
              bioParamChartData={ap4cParamChartData}
              onRangeChange={(range) => handleRangeChange(range, "PlotlyDataChart")}
            />
          </Box>
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart
              anomalyChartData={anomalyChartData}
              onRangeChange={(range) => handleRangeChange(range, "AnomalyChart")}
            />
          </Box>
          <Box width={"50%"}>
            <OutlierChart
              outlierChartData={outlierChartData}
              onRangeChange={(range) => handleRangeChange(range, "OutlierChart")}
            />
          </Box>
        </Box>

        {/* Conditional Rendering for IntensityChart, Corelation, and PredictionChart */}
        <Box style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "stretch" }} mt={2} gap={2}>
          <Box width={toggleState === "Operator" ? "100%" : "33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <IntensityChart />
          </Box>
          {toggleState !== "Operator" && (
            <>
              <Box width={"33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Corelation />
              </Box>
              <Box width={"33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <PredictionChart />
              </Box>
            </>
          )}
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