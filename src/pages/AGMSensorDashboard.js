import { Box, Grid, HStack, Select, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusCards from "../components/StatusCards";
import ParameterTable from "../components/ParameterTable";
import LineChart from "../components/LineChart";
import StatusHeader from "../components/StatusHeader";
import {
  getAGMSensordashboardData,
  getParamsData,
  getRadiationParameterData,
  getHealthParameterData,
} from "../service/AGMSensorService";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";


const AGMSensor = () => {
  const [AGMSensordashboardData, setAGMSensordashboardData] = useState();
  const [parameterData, setParameterData] = useState();
  const [radiationparamchartData, setradiationParamChartData] = useState();
  const [healthparamchartData, setHealthParamChartData] = useState();

  // For the dropdowns
  const [selectedradiationTimestamp, setSelectedradiationTimestamp] = useState("10 minutes");
  const [selectedradiationLabel, setSelectedradiationLabel] = useState("Chemical Parameters");
  const [selectedHealthTimestamp, setSelectedHealthTimestamp] = useState("10 minutes");
  const [selectedHealthLabel, setSelectedHealthLabel] = useState("Chemical Parameters");
  const [sensorLocation, setSensorLocation] = useState("Building 1");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const deviceId = queryParams.get("device_id");
      const location = decodeURIComponent(queryParams.get("location") || "");
      
      setSensorLocation(location);
      try {
        // If device_id is missing, redirect to home page
        if (!deviceId) {
          navigate("/"); // Redirect to home page
          return;
        }
        const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
          if (err) {
            console.error("Error receiving data:" + JSON.stringify(err));
          } else {
       
            // Check if sensor_name contains 'AGM'
            // if (data.sensor_name && data.sensor_name.includes("AGM")) {
              console.log("Sensor name contains AGM");
        
              // If it contains AGM, extract wstatusCards and parameter_data
              const wstatusCardsData = data.wstatusCards;
              const parameterData = data.parameter_data;
        
              // Set the state with the extracted data
              setAGMSensordashboardData(wstatusCardsData);
              setParameterData(parameterData);
            // } else {
            //   console.log("Sensor name does not contain AGM");
            // }
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error); // Log error
      }

      try {

        // Fetch data for radiation and health parameters
        const radiationData = await getRadiationParameterData(selectedradiationTimestamp, selectedradiationLabel);
        setradiationParamChartData(radiationData);

        const healthData = await getHealthParameterData(selectedHealthTimestamp, selectedHealthLabel);
        setHealthParamChartData(healthData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [selectedradiationTimestamp, selectedradiationLabel, selectedHealthTimestamp, selectedHealthLabel]);

  return (
    <Box p={4} bg="gray.900">
      {(
        <>
          <Box width="100%">
            <StatusHeader title="AGM Sensor Dashboard" location={sensorLocation} />
          </Box>
          <Box width="100%">
            <StatusCards data={AGMSensordashboardData} />
          </Box>
          <Box width="100%">
            <ParameterTable parameters={parameterData} />
          </Box>

          <HStack templateColumns="repeat(2, 1fr)" gap={5}>
            <Box width={{ base: "100%", md: "50%" }}>
              <HStack spacing={6} marginBottom={4}>
                <Text fontSize="sm" color="white">radiation Readings:</Text>
                <Select
                  value={selectedradiationTimestamp}
                  onChange={(e) => setSelectedradiationTimestamp(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="10 minutes">Last 10 Minutes</option>
                  <option value="30 minutes">Last 30 Minutes</option>
                  <option value="60 minutes">Last 60 Minutes</option>
                </Select>
                <Select
                  value={selectedradiationLabel}
                  onChange={(e) => setSelectedradiationLabel(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="radiation Parameters">Analytics Model</option>
                  <option value="Outlier">Outlier</option>
                  <option value="Anomaly">Anomaly</option>
                </Select>
              </HStack>
              <LineChart chartData={radiationparamchartData} title={selectedradiationLabel} />
            </Box>
            <Box width={{ base: "100%", md: "50%" }}>
              <HStack spacing={6} marginBottom={4}>
                <Text fontSize="sm" color="white">radiation Readings:</Text>
                <Select
                  value={selectedHealthTimestamp}
                  onChange={(e) => setSelectedHealthTimestamp(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="10 minutes">Last 10 Minutes</option>
                  <option value="30 minutes">Last 30 Minutes</option>
                  <option value="60 minutes">Last 60 Minutes</option>
                </Select>
                <Select
                  value={selectedHealthLabel}
                  onChange={(e) => setSelectedHealthLabel(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="Health Parameters">Analytics Model</option>
                  <option value="Intensity">Intensity</option>
                  <option value="Predictive">Predictive</option>
                </Select>
              </HStack>
              <LineChart chartData={healthparamchartData} title={selectedHealthLabel} />
            </Box>
          </HStack>
        </>
      )}
    </Box>
  );
};

export default AGMSensor;
