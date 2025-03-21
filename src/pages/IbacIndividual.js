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
import Alertbar from "../components/Alertbar";
import {
  fetchBioParamChartData,
  fetchAnomalyChartData,
  fetchOutlierChartData,
} from "../service/IbacSensorService";

import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from "dayjs";

export const IbacIndividual = () => {
  const [paramsData, setParamsData] = useState([]);
  const [bioParamChartData, setBioParamChartData] = useState({});
  const [kpiData, setKpiData] = useState([]);
  const [anomalyChartData, setAnomalyChartData] = useState({});
  const [outlierChartData, setOutlierChartData] = useState({});

  // New States for Time Range
  const [fromTime, setFromTime] = useState(dayjs().subtract(5, "minute").toISOString());
  const [toTime, setToTime] = useState(dayjs().toISOString());

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
  }, []); // Run once on mount

  // Fetch Data Function (includes fromTime and toTime)
  const fetchData = async (fromTime, toTime) => {

    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);
    // const formattedFromTime = "2024/11/15 17:15:30.543";
    // const formattedToTime = "2026/03/20 12:10:38.140";

    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    // const deviceId = "1148";
    try {
      // Fetch Charts with Time Range
      const chart = await fetchBioParamChartData(deviceId, formattedFromTime, formattedToTime);
      setBioParamChartData(chart.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const anomaly = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
      setAnomalyChartData(anomaly.data.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const outlier = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
      setOutlierChartData(outlier);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Initial Data Fetch and Refetch when Time Changes
  useEffect(() => {
    fetchData(fromTime, toTime);
  }, [fromTime, toTime]);

  // Handle Range Change from PlotlyDataChart
  const handleRangeChange = (range) => {
    setFromTime(range[0].toISOString());
    setToTime(range[1].toISOString());
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <HvStack direction="column" divider spacing="sm">
          <IndividualKPI kpiData={kpiData} ricon={bioicon} gicon={gbioicon} rbell={rbell} />
          {/* <Alertbar alerts={dummyData} /> */}
          <Alertbar />
        </HvStack>
        <IndividualParameters paramsData={paramsData} />

        {/* Plotly Data Chart */}
        <Box mt={2}>
          <PlotlyDataChart
            data={bioParamChartData}
            onRangeChange={handleRangeChange}
          />
        </Box>
      </Box>

      {/* Anomaly and Outlier Charts */}
      <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
        <Box width={"50%"}>
          <AnomalyChart 
          anomalyChartData={anomalyChartData} 
          onRangeChange={handleRangeChange}
          />
        </Box>
        <Box width={"50%"}>
          <OutlierChart outlierChartData={outlierChartData} />
        </Box>
      </Box>

      {/* Intensity and Prediction Charts */}
      <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
        <Box width={"50%"}>
          <IntensityChart />
        </Box>
        <Box width={"50%"}>
          <PredictionChart />
        </Box>
      </Box>
    </Box>
  );
};
