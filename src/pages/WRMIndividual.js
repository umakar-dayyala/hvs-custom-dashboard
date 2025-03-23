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
} from "../service/WRMSensorService";

import{
    fetchAnomalyChartData,
  fetchOutlierChartData,
} from "../service/IbacSensorService";

import { getLiveStreamingDataForSensors } from "../service/WebSocket";
import dayjs from "dayjs";
import Alertbar from '../components/Alertbar';

import Breadcrumbs from '../components/Breadcrumbs';
import ToggleButtons from '../components/ToggleButtons';
import ConfirmationModal from '../components/ConfirmationModal';
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
  const[addParams, setAddParams] = useState([]);


  // New States for Time Range
  const [fromTime, setFromTime] = useState(dayjs().subtract(5, "minute").toISOString());
  const [toTime, setToTime] = useState(dayjs().toISOString());

  const formatDateForApi = (isoDate) => {
    return `'${dayjs(isoDate).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  };
  // useEffect(() => {
  //   // Real-time data updates (WebSocket)
  //   const queryParams = new URLSearchParams(window.location.search);
  //   const deviceId = queryParams.get("device_id") ;

  //   const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
  //     if (err) {
  //       console.error("Error receiving data:", err);
  //     } else {
        
  //         setKpiData(data.kpiData);
  //         setParamsData(data.parametersData);
  //         setAddParams(data.supervisor_data);
       
  //     }
  //   });

  //   return () => {
  //     if (eventSource) {
  //       eventSource.close();
  //       console.log("WebSocket closed");
  //     }
  //   };
  // }, []); // Run once on mount

  // Fetch Data Function (includes fromTime and toTime)
  const fetchData = async (fromTime, toTime) => {

    const formattedFromTime = formatDateForApi(fromTime);
    console.log("Formatted From Time: ", formattedFromTime);
    const formattedToTime = formatDateForApi(toTime);
    console.log("Formatted To Time: ", toTime);
    // const formattedFromTime = "'2024/11/15 17:15:30.543'";
    // const formattedToTime = "'2026/03/20 12:10:38.140'";

    const queryParams = new URLSearchParams(window.location.search);
    const deviceId = queryParams.get("device_id");
    console.log("Device ID: ", deviceId);
    //const deviceId = "1148";
    try {
      // Fetch Charts with Time Range
      const chart = await fetchWRMParamChartData(deviceId, formattedFromTime, formattedToTime);
      setWrmParamChartData(chart.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const anomaly = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
      setAnomalyChartData(anomaly.data);
      console.log("Anomaly Data for checking from ibac" +JSON.stringify(anomaly.data));

    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const outlier = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
      setOutlierChartData(outlier.data);
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
           onRangeChange={handleRangeChange} 
          />
        </Box>

        <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
          <Box width={"50%"}>
            <AnomalyChart
              anomalyChartData={anomalyChartData}
              onRangeChange={handleRangeChange}
            />
          </Box>
          <Box width={"50%"}>
            <OutlierChart
              outlierChartData={outlierChartData}
              onRangeChange={handleRangeChange}
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


