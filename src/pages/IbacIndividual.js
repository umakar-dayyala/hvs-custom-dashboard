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
import amberBell  from "../assets/amberBell.svg";
import greenBell from "../assets/greenBell.svg";

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

export const IbacIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [bioParamChartData, setBioParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});
  const [toggleState, setToggleState] = useState("Operator");
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState(null);
  const [notifications,setNotifications]=useState([]);
  const [param,setParam]=useState([]);

  // **Separate State for Each Chart's Time Range**
  const [plotlyTimeRange, setPlotlyTimeRange] = useState({ fromTime: null, toTime: null });
  const [anomalyTimeRange, setAnomalyTimeRange] = useState({ fromTime: null, toTime: null });
  const [outlierTimeRange, setOutlierTimeRange] = useState({ fromTime: null, toTime: null });

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
          setParam(data.parametersData);
          setNotifications(data.Notifications);
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

  const handlePlotlyRangeChange = (range) => {
    const start = dayjs(range[0]); // Ensure it's a dayjs object
    const end = dayjs(range[1]);
  
    if (!start.isValid() || !end.isValid()) {
      console.error("Invalid date range:", range);
      return;
    }
  
    setPlotlyTimeRange([start.toISOString(), end.toISOString()]);
  };
  
  const handleAnomalyRangeChange = (range) => {
    console.log("Received range:", range); // Debugging log
  
    const start = dayjs(range[0]); 
    const end = dayjs(range[1]);
  
    if (!start.isValid() || !end.isValid()) {
      console.error("Invalid date range received:", range);
      return;
    }
  
    setAnomalyTimeRange([start.toISOString(), end.toISOString()]);
  };
  
  const handleOutlierRangeChange = (range) => {
    if (!range || range.length < 2) {
        console.error("Invalid range received:", range);
        return;
    }

    const start = new Date(range[0]);
    const end = new Date(range[1]);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid date values:", range);
        return;
    }

    setOutlierTimeRange([start.toISOString(), end.toISOString()]);
};

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
          <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} amberBell={amberBell} greenBell={greenBell}/>
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
