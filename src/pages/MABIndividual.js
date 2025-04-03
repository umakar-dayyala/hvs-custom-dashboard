import React, { useEffect, useState } from 'react';
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
import amberBell from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";
import aicon from "../assets/aBiological.svg";
import greyBio from "../assets/greyBio.svg";

export const MABIndividual = () => {
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

  // Time range states initialized as null
  const [plotlyRange, setPlotlyRange] = useState({ fromTime: null, toTime: null });
  const [anomalyRange, setAnomalyRange] = useState({ fromTime: null, toTime: null });
  const [outlierRange, setOutlierRange] = useState({ fromTime: null, toTime: null });

  const formatDateForApi = (isoDate) => {
    if (!isoDate) return null;
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
  }, []);

  const fetchData = async (fromTime, toTime, component) => {
    if (!fromTime || !toTime) return;

    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);

    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

    try {
      if (component === 'PlotlyDataChart') {
        const chart = await fetchMABParamChartData(deviceId, formattedFromTime, formattedToTime);
        setMabParamChartData(chart?.data || {});
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
              <Alertbar />
            </HvStack>
            <IndividualParameters paramsData={param} notifications={notifications}/>
            <Box mt={2}>
              <PlotlyDataChart
                bioParamChartData={mabParamChartData}
                onRangeChange={(range) => handleRangeChange(range, 'PlotlyDataChart')}
                title={'Biological Readings'}
                lastFetchTime={lastFetchTimes.plotly}
              />
            </Box>
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