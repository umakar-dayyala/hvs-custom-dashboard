import React, { useEffect, useState } from 'react';
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
import AGMadditionalParameters from '../components/AGMadditionalParameters';
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from 'dayjs';
import { fetchAGMParamChartData } from '../service/AGMSensorService';
import { fetchAnomalyChartData, fetchOutlierChartData } from '../service/AGMSensorService';
import Breadcrumbs from '../components/Breadcrumbs';
import ToggleButtons from '../components/ToggleButtons';
import ConfirmationModal from '../components/ConfirmationModal';
import IntensityChartAGM from '../components/IntensityChartAGM';

export const AgmIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [agmParamChartData, setAgmParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);
  const [addParams, setAddParams] = useState([]);

  // Time range states for each component
  const [plotlyRange, setPlotlyRange] = useState({
    fromTime: dayjs().subtract(5, "minute").toISOString(),
    toTime: dayjs().toISOString(),
  });
  const [anomalyRange, setAnomalyRange] = useState({
    fromTime: dayjs().subtract(5, "minute").toISOString(),
    toTime: dayjs().toISOString(),
  });
  const [outlierRange, setOutlierRange] = useState({
    fromTime: dayjs().subtract(5, "minute").toISOString(),
    toTime: dayjs().toISOString(),
  });

  const formatDateForApi = (isoDate) => {
    return `'${dayjs(isoDate).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };

  useEffect(() => {
    // Real-time data updates (WebSocket)
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    console.log("Device ID AGM: ", deviceId);

    const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Error receiving data:", err);
      } else {
        setKpiData(data.kpiData);
        setParamsData(data.parametersData);
        setAddParams(data.supervisor_data);
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
        const chart = await fetchAGMParamChartData(deviceId, formattedFromTime, formattedToTime);
        setAgmParamChartData(chart.data);
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

  // Handle Range Change for each component
  const handleRangeChange = (range, component) => {
    if (component === 'PlotlyDataChart') {
      setPlotlyRange({ fromTime: range[0].toISOString(), toTime: range[1].toISOString() });
    } else if (component === 'AnomalyChart') {
      setAnomalyRange({ fromTime: range[0].toISOString(), toTime: range[1].toISOString() });
    } else if (component === 'OutlierChart') {
      setOutlierRange({ fromTime: range[0].toISOString(), toTime: range[1].toISOString() });
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs />
        <div style={{ display: "flex", gap: "10px" }}>
          <ToggleButtons onToggleChange={handleToggleClick} currentRole={toggleState} />
        </div>
      </div>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <HvStack direction="column" divider spacing="sm">
            <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} />
            <Alertbar />
          </HvStack>
          <IndividualParameters paramsData={paramsData} />
          <Box mt={2}>
            <PlotlyDataChart
              bioParamChartData={agmParamChartData}
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
        <Box style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "stretch" }} mt={2} mb={2} gap={2}>
          <Box width={"50%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <IntensityChartAGM />
          </Box>
          <Box width={"50%"} style={{ display: "flex", flexDirection: "column", height: "80%" }}>
            <AGMadditionalParameters addParams={addParams} />
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
    </Box>
  );
};