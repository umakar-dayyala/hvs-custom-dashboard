import React, { useEffect, useState, useCallback, useMemo } from 'react';
import IndividualKPI from '../components/IndividualKPI';
import IndividualParameters from '../components/IndividualParameters';
import { HvButton, HvStack, HvDialog } from '@hitachivantara/uikit-react-core';
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
import BreadCrumbsIndividual from '../components/BreadCrumbsIndividual';
import Connectivitydata from '../components/Connectivitydata';

// Constants
const AsmData= {
  "fan_status": "OK",
  "pump_status": "OK",
  "cyclone_fluid": "OK",
}

export const MABIndividual = React.memo(() => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
  const [LastFetchLiveData, setLastFetchLiveData] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Time range states initialized as null
  const [plotlyRange, setPlotlyRange] = useState({ fromTime: null, toTime: null });
  const [anomalyRange, setAnomalyRange] = useState({ fromTime: null, toTime: null });
  const [outlierRange, setOutlierRange] = useState({ fromTime: null, toTime: null });
  const [locationDetails, setUdatedLocationDetails] = useState({
    floor: 'default',
    zone: 'default',
    location: 'default',
    sensorType: 'default'
  });

  // Memoized device ID
  const deviceId = useMemo(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("device_id");
  }, []);

  // Memoized date formatter
  const formatDateForApi = useCallback((date) => {
    if (!date) return null;
    return `'${dayjs(date).format("YYYY/MM/DD HH:mm:ss.SSS")}'`;
  }, []);

  // WebSocket connection
  useEffect(() => {
    if (!deviceId) return;

    const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
      if (err) {
        console.error("Error receiving data:", err);
      } else {
        setKpiData(data.kpiData);
        setParamsData(data.parametersData);
        setParam(data.parametersData);
        setNotifications(data.Notifications);
        setLastFetchLiveData(data.lastfetched.time);
      }
    });

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("WebSocket closed");
      }
    };
  }, [deviceId]);

  // Memoized fetch data function
  const fetchData = useCallback(async (fromTime, toTime, component) => {
    if (!fromTime || !toTime || !deviceId) return;

    const formattedFromTime = formatDateForApi(fromTime);
    const formattedToTime = formatDateForApi(toTime);

    try {
      let response;
      switch (component) {
        case 'PlotlyDataChart':
          response = await fetchMABParamChartData(deviceId, formattedFromTime, formattedToTime);
          setMabParamChartData(response?.data || {});
          break;
        case 'AnomalyChart':
          response = await fetchAnomalyChartData(deviceId, formattedFromTime, formattedToTime);
          setAnomalyChartData(response?.data || {});
          break;
        case 'OutlierChart':
          response = await fetchOutlierChartData(deviceId, formattedFromTime, formattedToTime);
          setOutlierChartData(response?.data || {});
          break;
      }

      // Update last fetch time on success
      setLastFetchTimes(prev => ({
        ...prev,
        [component.toLowerCase().replace('datachart', '').replace('chart', '')]: new Date().toLocaleString()
      }));
    } catch (error) {
      console.error(`Error fetching ${component} data:`, error);
    }
  }, [deviceId, formatDateForApi]);

  // Range change handlers
  const handlePlotlyRangeChange = useCallback((range) => {
    handleRangeChange(range, 'PlotlyDataChart', setPlotlyRange);
  }, []);

  const handleAnomalyRangeChange = useCallback((range) => {
    handleRangeChange(range, 'AnomalyChart', setAnomalyRange);
  }, []);

  const handleOutlierRangeChange = useCallback((range) => {
    handleRangeChange(range, 'OutlierChart', setOutlierRange);
  }, []);

  // Generic range change handler
  const handleRangeChange = useCallback((range, component, setRange) => {
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

    setRange({ fromTime, toTime });
  }, []);

  // Fetch data when ranges change
  useEffect(() => {
    if (plotlyRange.fromTime && plotlyRange.toTime) {
      fetchData(plotlyRange.fromTime, plotlyRange.toTime, 'PlotlyDataChart');
    }
  }, [plotlyRange, fetchData]);

  useEffect(() => {
    if (anomalyRange.fromTime && anomalyRange.toTime) {
      fetchData(anomalyRange.fromTime, anomalyRange.toTime, 'AnomalyChart');
    }
  }, [anomalyRange, fetchData]);

  useEffect(() => {
    if (outlierRange.fromTime && outlierRange.toTime) {
      fetchData(outlierRange.fromTime, outlierRange.toTime, 'OutlierChart');
    }
  }, [outlierRange, fetchData]);

  // Toggle state handling
  const handleToggleClick = useCallback((state) => {
    if (toggleState === "Operator" && state === "Supervisor") {
      setNewState(state);
      setShowModal(true);
    } else {
      setToggleState(state);
    }
  }, [toggleState]);

  const handleConfirmChange = useCallback(() => {
    if (newState) {
      setToggleState(newState);
    }
    setShowModal(false);
  }, [newState]);

  const handleCancelChange = useCallback(() => {
    setNewState(null);
    setShowModal(false);
  }, []);

  // Image modal handlers
  const handleOpenImageModal = useCallback(() => {
    // Here you could fetch the image URL if needed
    // For now, we'll just set a placeholder
    setSelectedImage("path_to_your_image.jpg"); // Replace with actual image path or API call
    setImageModalOpen(true);
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setImageModalOpen(false);
    setSelectedImage(null);
  }, []);

  // Memoized layout values based on toggle state
  const chartLayout = useMemo(() => {
    return toggleState === "Operator" ? "100%" : "33.33%";
  }, [toggleState]);

  const setLocationDetails = (floor, zone, location, sensorType) => {
    setUdatedLocationDetails({
      floor: floor || locationDetails.floor,
      zone: zone || locationDetails.zone,
      location: location || locationDetails.location,
      sensorType: sensorType || locationDetails.sensorType
    });
  }

  return (
    <Box>
      <Box>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BreadCrumbsIndividual locationDetails={locationDetails} />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Box style={{ whiteSpace: "nowrap" }}>
              {LastFetchLiveData && (
                <span>Last Live Data fetched time: {LastFetchLiveData}</span>
              )}
            </Box>
            <ToggleButtons onToggleChange={handleToggleClick} currentRole={toggleState} />
            <HvButton onClick={handleOpenImageModal}>Image</HvButton>
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
              <Alertbar setLocationDetailsforbreadcrumb={setLocationDetails} />
            </HvStack>
            <IndividualParameters paramsData={param} notifications={notifications} AsmData={AsmData}/>
            <Box mt={2}>
              <PlotlyDataChart
                bioParamChartData={mabParamChartData}
                onRangeChange={handlePlotlyRangeChange}
                title={'Biological Readings'}
                lastFetchTime={lastFetchTimes.plotly}
              />
            </Box>
          </Box>

          <Box style={{ display: "flex", flexDirection: "row", width: "100%" }} mt={2} gap={2}>
            <Box width={"50%"}>
              <AnomalyChart
                anomalyChartData={anomalyChartData}
                onRangeChange={handleAnomalyRangeChange}
                title={'Anomaly Detection'}
                lastFetchTime={lastFetchTimes.anomaly}
              />
            </Box>
            <Box width={"50%"}>
              <OutlierChart
                outlierChartData={outlierChartData}
                onRangeChange={handleOutlierRangeChange}
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
          <Connectivitydata />
        </Box>
      </Box>

      {/* Image Modal */}
      <HvDialog
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        title="Equipment Image"
        maxWidth="sm"
        fullWidth
      >
        <div style={{ 
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  minHeight: '300px' // Ensures minimum height even if image is small
}}>
  {selectedImage ? (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      
      overflow: 'hidden'
    }}>
      <img 
        src={selectedImage}
        alt="fetched image" 
        style={{ 
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block' // Removes extra space below image
        }}
      />
    </div>
  ) : (
    <p>No image available</p>
  )}
  <div style={{ marginTop: 20, textAlign: 'center' }}>
    <HvButton variant="primary" onClick={handleCloseImageModal}>
      Close
    </HvButton>
  </div>
</div>
      </HvDialog>

      {/* Role Change Confirmation Modal */}
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
});