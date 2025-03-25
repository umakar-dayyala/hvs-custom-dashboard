import React, { useEffect, useRef, useState } from "react";
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
import amberBell  from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";
import greyBio from "../assets/greyBio.svg"
import greyChem from "../assets/greyChem.svg"
import greyRad from "../assets/greyRadio.svg"

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



export const IbacIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [bioParamChartData, setBioParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [param, setParam] = useState([]);

 

  // Track initial mount
  const initialMount = useRef(true);

  // Initialize with default 5-minute ranges
  const defaultRange = {
    fromTime: dayjs().subtract(5, 'minute').toISOString(),
    toTime: dayjs().toISOString()
  };

  // Time range states with default values
  const [plotlyTimeRange, setPlotlyTimeRange] = useState(defaultRange);
  const [anomalyTimeRange, setAnomalyTimeRange] = useState(defaultRange);
  const [outlierTimeRange, setOutlierTimeRange] = useState(defaultRange);

  const formatDateForApi = (date) => {
    if (!date) return null;
    return `'${dayjs(date).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };

  useEffect(() => {
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

    // Initial data fetch for all charts
    if (initialMount.current) {
      const deviceId = queryParams.get("device_id");
      if (deviceId) {
        fetchBioData(deviceId, plotlyTimeRange.fromTime, plotlyTimeRange.toTime);
        fetchAnomalyData(deviceId, anomalyTimeRange.fromTime, anomalyTimeRange.toTime);
        fetchOutlierData(deviceId, outlierTimeRange.fromTime, outlierTimeRange.toTime);
      }
      initialMount.current = false;
    }

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("WebSocket closed");
      }
    };
  }, []);

  // Separate fetch functions for better error handling
  const fetchBioData = async (deviceId, fromTime, toTime) => {
    if (!fromTime || !toTime) return;
    try {
      const response = await fetchBioParamChartData(
        deviceId, 
        formatDateForApi(fromTime), 
        formatDateForApi(toTime)
      );
      setBioParamChartData(response?.data || {});
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
    } catch (error) {
      console.error("Error fetching outlier data:", error);
    }
  };

  // Handler functions with improved validation
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

    // Only update if range actually changed
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

  // Effect hooks for data fetching
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    if (deviceId && !initialMount.current) {
      fetchBioData(deviceId, plotlyTimeRange.fromTime, plotlyTimeRange.toTime);
    }
  }, [plotlyTimeRange]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    if (deviceId && !initialMount.current) {
      fetchAnomalyData(deviceId, anomalyTimeRange.fromTime, anomalyTimeRange.toTime);
    }
  }, [anomalyTimeRange]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    if (deviceId && !initialMount.current) {
      fetchOutlierData(deviceId, outlierTimeRange.fromTime, outlierTimeRange.toTime);
    }
  }, [outlierTimeRange]);


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
          <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} amberBell={amberBell} greenBell={greenBell} aicon={aicon} greyIcon={greyBio}
          dummyKpiData={[
            { title: "Biological Alarms", value: "No Live Data" },
            { title: "Detector Health Faults", value: "No Live Data" },
            { title: "Analytics Alert", value: "No Live Data" }
          ]}/>
          <Alertbar />
        </HvStack>
        <IndividualParameters paramsData={param} notifications={notifications} />
        <Box mt={2}>
          <PlotlyDataChart bioParamChartData={bioParamChartData} onRangeChange={handlePlotlyRangeChange} title={'Biological Readings'} />
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart anomalyChartData={anomalyChartData} onRangeChange={handleAnomalyRangeChange} title={'Anomaly Detection'}/>
          </Box>
          <Box width={"50%"}>
            <OutlierChart outlierChartData={outlierChartData} onRangeChange={handleOutlierRangeChange} title={'Outlier Detection'}/>
          </Box>
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
  {toggleState === "Operator" ? (
    <Box width="100%">
      <IntensityChart />
    </Box>
  ) : (
    <>
      <Box width="33.33%">
        <IntensityChart />
      </Box>
      <Box width="33.33%">
        <PredictionChart />
      </Box>
      <Box width="33.33%">
        <Corelation /> {/* Add your third component here */}
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
