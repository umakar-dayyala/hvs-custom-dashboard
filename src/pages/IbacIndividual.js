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

export const IbacIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [bioParamChartData, setBioParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);

  // **Separate State for Each Chart's Time Range**
  const [plotlyTimeRange, setPlotlyTimeRange] = useState([dayjs().subtract(5, "minute").toISOString(), dayjs().toISOString()]);
  const [anomalyTimeRange, setAnomalyTimeRange] = useState([dayjs().subtract(5, "minute").toISOString(), dayjs().toISOString()]);
  const [outlierTimeRange, setOutlierTimeRange] = useState([dayjs().subtract(5, "minute").toISOString(), dayjs().toISOString()]);

  const formatDateForApi = (isoDate) => {
    return `'${dayjs(isoDate).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id") || "1149";

    const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Error receiving data:", err);
      } else {
        if (data.sensor_name && data.sensor_name.includes("IBAC")) {
          setKpiData(data.kpiData);
          setParamsData(data.parametersData);
        } else {
          console.log("Sensor name does not contain IBAC");
        }
      }
    });

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("WebSocket closed");
      }
    };
  }, []);

  // **Fetch Data for Each Chart Separately**
  const fetchData = async (deviceId, fromTime, toTime, setDataFunc, fetchFunc) => {
    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);

    try {
      const response = await fetchFunc(deviceId, formattedFromTime, formattedToTime);
      setDataFunc(response.data);
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

    fetchData(deviceId, plotlyTimeRange[0], plotlyTimeRange[1], setBioParamChartData, fetchBioParamChartData);
  }, [plotlyTimeRange]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

    fetchData(deviceId, anomalyTimeRange[0], anomalyTimeRange[1], setAnomalyChartData, fetchAnomalyChartData);
  }, [anomalyTimeRange]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");

    fetchData(deviceId, outlierTimeRange[0], outlierTimeRange[1], setOutlierChartData, fetchOutlierChartData);
  }, [outlierTimeRange]);

  // **Independent Range Handlers**
  const handlePlotlyRangeChange = (range) => setPlotlyTimeRange([range[0].toISOString(), range[1].toISOString()]);
  const handleAnomalyRangeChange = (range) => setAnomalyTimeRange([range[0].toISOString(), range[1].toISOString()]);
  const handleOutlierRangeChange = (range) => setOutlierTimeRange([range[0].toISOString(), range[1].toISOString()]);

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
          <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} />
          <Alertbar />
        </HvStack>
        <IndividualParameters paramsData={paramsData} />
        <Box mt={2}>
          <PlotlyDataChart bioParamChartData={bioParamChartData} onRangeChange={handlePlotlyRangeChange} />
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart anomalyChartData={anomalyChartData} onRangeChange={handleAnomalyRangeChange} />
          </Box>
          <Box width={"50%"}>
            <OutlierChart outlierChartData={outlierChartData} onRangeChange={handleOutlierRangeChange} />
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
