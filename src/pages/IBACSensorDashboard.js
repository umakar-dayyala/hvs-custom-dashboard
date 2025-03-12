import { Box, Grid, HStack, Select, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import StatusCards from "../components/StatusCards";
import ParameterTable from "../components/ParameterTable";
import LineChart from "../components/LineChart";
import StatusHeader from "../components/StatusHeader";
import { useNavigate } from "react-router-dom";
import "../css/IBACSensor.css";
import {
  getIBACSensordashboardData,
  getParamsData,
  getBioParameterData,
  getHealthParameterData,
} from "../service/IbacSensorService";
import {getLiveStreamingDataForSensors} from "../service/WebSocket"

const IBACSensor = () => {
  const [IBACSensordashboardData, setIBACSensordashboardData] = useState();
  const [parameterData, setParameterData] = useState();
  const [bioparamchartData, setBioParamChartData] = useState();
  const [healthparamchartData, setHealthParamChartData] = useState();
  const [sensorLocation, setSensorLocation] = useState("Building 1");

  // For the dropdowns
  const [selectedBioTimestamp, setSelectedBioTimestamp] = useState("10 minutes");
  const [selectedBioLabel, setSelectedBioLabel] = useState(
    "Biological Parameters"
  );
  const [selectedHealthTimestamp, setSelectedHealthTimestamp] =
    useState("10 minutes");
  const [selectedHealthLabel, setSelectedHealthLabel] =
    useState("Health Parameters");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get device_id from the URL query string
        const queryParams = new URLSearchParams(window.location.search);
        const deviceId = queryParams.get("device_id");
        const location = decodeURIComponent(queryParams.get("location") || "");
        setSensorLocation(location);
       
        // If device_id is missing, redirect to home page
        if (!deviceId) {
          navigate("/"); // Redirect to home page
          return;
        }

        const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
          if (err) {
            console.error("Error receiving data:" + JSON.stringify(err));
          } else {
       
            // Check if sensor_name contains 'IBAC'
            if (data.sensor_name && data.sensor_name.includes("IBAC")) {
              console.log("Sensor name contains IBAC");
        
              // If it contains IBAC, extract wstatusCards and parameter_data
              const wstatusCardsData = data.wstatusCards;
              const parameterData = data.parameter_data;
        
              // Set the state with the extracted data
              setIBACSensordashboardData(wstatusCardsData);
              setParameterData(parameterData);
            } else {
              console.log("Sensor name does not contain IBAC");
            }
          }
        });
        
        const bioData = await getBioParameterData(
          deviceId,
          selectedBioTimestamp,
          selectedBioLabel
        );
        
        setBioParamChartData(bioData);

        const healthData = await getHealthParameterData(
          deviceId,
          selectedHealthTimestamp,
          selectedHealthLabel
        );
        setHealthParamChartData(healthData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [
    selectedBioTimestamp,
    selectedBioLabel,
    selectedHealthTimestamp,
    selectedHealthLabel,
  ]);

  
  
  return (
    <Box p={4} bg="gray.900">
      {IBACSensordashboardData && (
        <>
          <Box width="100%">
            <StatusHeader title="IBAC Sensor Dashboard" location={sensorLocation} />
          </Box>
          <Box width="100%">
            <StatusCards data={IBACSensordashboardData} />
          </Box>
          <Box width="100%">
            <ParameterTable parameters={parameterData} />
          </Box>

          {/* <HStack templateColumns="repeat(2, 1fr)" gap={5}>
            <Box width={{ base: "100%", md: "50%" }}>
              <HStack spacing={6} marginBottom={4}>
                <Text fontSize="sm" color="white">
                  Biological Readings:
                </Text>
                <Select
                  value={selectedBioTimestamp}
                  onChange={(e) => setSelectedBioTimestamp(e.target.value)}
                  fontSize="sm"
                  color="white"
                >
                  <option value="10 minutes">10 Minutes</option>
                  <option value="30 minutes">30 Minutes</option>
                  <option value="60 minutes">60 Minutes</option>
                </Select>
                <Select
                  value={selectedBioLabel}
                  onChange={(e) => setSelectedBioLabel(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="Bio Parameters">Analytics Model</option>
                  <option value="Outlier">Outlier</option>
                  <option value="Anomaly">Anomaly</option>
                </Select>
              </HStack>
              <LineChart
                chartData={bioparamchartData}
                title={selectedBioLabel}
              />
            </Box>
            <Box width={{ base: "100%", md: "50%" }}>
              <HStack spacing={6} marginBottom={4}>
                <Text fontSize="sm" color="white">
                  Health Readings:
                </Text>
                <Select
                  value={selectedHealthTimestamp}
                  onChange={(e) => setSelectedHealthTimestamp(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="10 minutes">10 Minutes</option>
                  <option value="30 minutes">30 Minutes</option>
                  <option value="60 minutes">60 Minutes</option>
                </Select>
                <Select
                  value={selectedHealthLabel}
                  onChange={(e) => setSelectedHealthLabel(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="Health Parameters">Analytics Model</option>
                  <option value="Outlier">Outlier</option>
                  <option value="Anomaly">Anomaly</option>
                </Select>
              </HStack>
              <LineChart
                chartData={healthparamchartData}
                title={selectedHealthLabel}
              />
            </Box>
          </HStack> */}
        </>
      )}
    </Box>
  );
};

export default IBACSensor;
