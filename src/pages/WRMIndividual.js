import React, { useEffect, useState } from "react";
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
import {
  fetchWRMParamChartData,
  fetchAnomalyChartData,
  fetchOutlierChartData,
} from "../service/WRMSensorService";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from "dayjs";
import Alertbar from "../components/Alertbar";
import Breadcrumbs from "../components/Breadcrumbs";
import ToggleButtons from "../components/ToggleButtons";
import ConfirmationModal from "../components/ConfirmationModal";
import WRMadditionalParameters from "../components/WRMadditionalParameter";

export const WRMIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [wrmParamChartData, setWrmParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);
  const [addParams, setAddParams] = useState([]);

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
    const deviceId = queryParams.get("device_id");

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
      if (component === "PlotlyDataChart") {
        const chart = await fetchWRMParamChartData(deviceId, formattedFromTime, formattedToTime);
        setWrmParamChartData(chart.data);
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
  

  // Fetch data when the range changes for each component
  useEffect(() => {
    fetchData(plotlyRange.fromTime, plotlyRange.toTime, "PlotlyDataChart");
  }, [plotlyRange]);

  useEffect(() => {
    fetchData(anomalyRange.fromTime, anomalyRange.toTime, "AnomalyChart");
  }, [anomalyRange]);

  useEffect(() => {
    fetchData(outlierRange.fromTime, outlierRange.toTime, "OutlierChart");
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
        <HvStack direction="column" divider spacing="sm">
          <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} />
          <Alertbar />
        </HvStack>
        <IndividualParameters paramsData={paramsData} />
        <Box mt={2}>
          <PlotlyDataChart
            bioParamChartData={wrmParamChartData}
            onRangeChange={(range) => handleRangeChange(range, "PlotlyDataChart")}
          />
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

        <Box display={"flex"} style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={toggleState === "Operator" ? "100%" : "33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <IntensityChart />
          </Box>
          {toggleState !== "Operator" && (
            <>
              <Box width={"33.33%"} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <WRMadditionalParameters addParams={addParams} />
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