import { Box, Grid, HStack, Select, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusCards from "../components/StatusCards";
import ParameterTable from "../components/ParameterTable";
import LineChart from "../components/LineChart";
import StatusHeader from "../components/StatusHeader";
import {
  getAP4CSensordashboardData,
  getParamsData,
  getChemicalParameterData,
  getHealthParameterData,
} from "../service/AP4CSensorService";
import { getLiveStreamingDataForSensors } from "../service/WebSocket";

const AP4CSensor = () => {
  const [AP4CSensordashboardData, setAP4CSensordashboardData] = useState();
  const [parameterData, setParameterData] = useState();
  const [chemicalparamchartData, setchemicalParamChartData] = useState();
  const [healthparamchartData, setHealthParamChartData] = useState();

  // For the dropdowns
  const [selectedchemicalTimestamp, setSelectedchemicalTimestamp] = useState("last10");
  const [selectedchemicalLabel, setSelectedchemicalLabel] = useState("Chemical Parameters");
  const [selectedHealthTimestamp, setSelectedHealthTimestamp] = useState("last10");
  const [selectedHealthLabel, setSelectedHealthLabel] = useState("Chemical Parameters");

  const [sensorLocation, setSensorLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const deviceId = queryParams.get("device_id");
      const location = decodeURIComponent(queryParams.get("location") || "");
      setSensorLocation(location);
      if (!deviceId) {
        navigate("/"); // Redirect to home page
        return;
      }
      try{
        const eventSource = getLiveStreamingDataForSensors(deviceId, (err, data) => {
          if (err) {
            console.error("Error receiving data:" + JSON.stringify(err));
          } else {
       
            // Check if sensor_name contains 'AP4C'
            // if (data.sensor_name && data.sensor_name.includes("AP4C")) {
              console.log("Sensor name contains AP4C");
        
              // If it contains AP4C, extract wstatusCards and parameter_data
              const wstatusCardsData = data.wstatusCards;
              const parameterData = data.parameter_data;

              // Set the state with the extracted data
              setAP4CSensordashboardData(wstatusCardsData);
              setParameterData(parameterData);
            // } else {
            //   console.log("Sensor name does not contain AP4C");
            // }
          }
        });
      }catch(error){
        console.error("Error fetching dashboard data:", error);
      }
      try {

        const chemicalData = await getChemicalParameterData(selectedchemicalTimestamp, selectedchemicalLabel);
        setchemicalParamChartData(chemicalData);

        const healthData = await getHealthParameterData(selectedHealthTimestamp, selectedHealthLabel);
        setHealthParamChartData(healthData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [selectedchemicalTimestamp, selectedchemicalLabel, selectedHealthTimestamp, selectedHealthLabel]);

  return (
    <Box p={4} bg="gray.900">
      {AP4CSensordashboardData && (
        <>
          <Box width="100%">
            <StatusHeader title="AP4C Sensor Dashboard" location={sensorLocation} />
          </Box>
          <Box width="100%">
            <StatusCards data={AP4CSensordashboardData} />
          </Box>
          <Box width="100%">
            <ParameterTable parameters={parameterData} />
          </Box>

          <HStack templateColumns="repeat(2, 1fr)" gap={5}>
            <Box width={{ base: "100%", md: "50%" }}>
              <HStack spacing={6} marginBottom={4}>
                <Text fontSize="sm" color="white">chemical Readings:</Text>
                <Select
                  value={selectedchemicalTimestamp}
                  onChange={(e) => setSelectedchemicalTimestamp(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="last10">Last 10 Minutes</option>
                  <option value="last30">Last 30 Minutes</option>
                  <option value="last60">Last 60 Minutes</option>
                </Select>
                <Select
                  value={selectedchemicalLabel}
                  onChange={(e) => setSelectedchemicalLabel(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="chemical Parameters">Analytics Model</option>
                  <option value="Outlier">Outlier</option>
                  <option value="Anomaly">Anomaly</option>
                </Select>
              </HStack>
              <LineChart chartData={chemicalparamchartData} title={selectedchemicalLabel} />
            </Box>
            <Box width={{ base: "100%", md: "50%" }}>
              <HStack spacing={6} marginBottom={4}>
                <Text fontSize="sm" color="white">chemical Readings:</Text>
                <Select
                  value={selectedHealthTimestamp}
                  onChange={(e) => setSelectedHealthTimestamp(e.target.value)}
                  color="white"
                  bg="gray.800"
                  fontSize="sm"
                >
                  <option value="last10">Last 10 Minutes</option>
                  <option value="last30">Last 30 Minutes</option>
                  <option value="last60">Last 60 Minutes</option>
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

export default AP4CSensor;
