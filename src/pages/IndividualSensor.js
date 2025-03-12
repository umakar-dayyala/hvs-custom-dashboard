import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, HStack, Image, Text, Divider } from '@chakra-ui/react';
import Cards from '../components/Cards';
import LineChart from '../components/LineChart';
import { bioParamData, healthParamData, statusParamData } from '../service/dummyAPI';

const IndividulSensor = () => {
  const [bioParamCardData, setBioParamCardData] = useState([]);
  const [healthCardData, setHealthCardData] = useState([]);
  const [statusCardData, setStatusCardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bioParamDataResponse = await bioParamData();
        setBioParamCardData(bioParamDataResponse.cards || []);

        const healthParamDataResponse = await healthParamData();
        setHealthCardData(healthParamDataResponse.cards || []);

        const statusDataResponse = await statusParamData();
        setStatusCardData(statusDataResponse.cards || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Transform data for LineChart
  const transformChartData = (data, labelKey, valueKey) => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: data.map((item) => item[labelKey]),
      datasets: [
        {
          label: 'Values',
          data: data.map((item) => parseInt(item[valueKey], 10)),
          borderColor: '#4A90E2',
          backgroundColor: 'rgba(74, 144, 226, 0.5)',
          tension: 0.4,
        },
      ],
    };
  };

  const bioChartData = transformChartData(bioParamCardData, 'label', 'value');
  const healthChartData = transformChartData(healthCardData, 'label', 'value');

  // Function to generate dynamic time labels for the last 10 minutes in the format "HH:mm"
  const generateTimeLabels = (numLabels = 10) => {
    const currentTime = new Date();
    const labels = [];

    for (let i = numLabels; i > 0; i--) {
      // Copy the current time to avoid modifying the same object
      const timeLabel = new Date(currentTime);
      timeLabel.setMinutes(currentTime.getMinutes() - i); // Subtracting minutes

      // Format the time as "HH:mm"
      const hours = timeLabel.getHours().toString().padStart(2, '0');
      const minutes = timeLabel.getMinutes().toString().padStart(2, '0');
      labels.push(`${hours}:${minutes}`);
    }

    return labels;
  };

  // Example chart data with dynamic time labels and updated labels
  const healthparamchartData = {
    labels: generateTimeLabels(), // Dynamically generate the time labels
    datasets: [
      {
        label: "Pressure", // Updated from the healthParamData API
        data: [50, 55, 48, 45, 58, 60, 65, 70, 72, 75],
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Laser Power", // Updated from the healthParamData API
        data: [12, 14, 13, 11, 15, 16, 14, 12, 18, 17],
        borderColor: "red",
        fill: false,
      },
      {
        label: "Laser Current", // Updated from the healthParamData API
        data: [42, 45, 40, 41, 46, 48, 43, 47, 49, 50],
        borderColor: "green",
        fill: false,
      },
      {
        label: "Background Light Monitor", // Updated from the healthParamData API
        data: [10, 12, 9, 11, 13, 14, 8, 15, 16, 10],
        borderColor: "purple",
        fill: false,
      },
      {
        label: "Low Battery", // Updated from the healthParamData API
        data: [5, 6, 4, 3, 7, 8, 6, 5, 7, 6],
        borderColor: "orange",
        fill: false,
      },
    ],
  };

  // Example chart data with dynamic time labels
  const boiparamchartData = {
    labels: generateTimeLabels(), // Dynamically generate the time labels
    datasets: [
      {
        label: "Small Bio",
        data: [2325, 2330, 2338, 2345, 3350, 3360, 2375, 2385, 3400, 3420],
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Large Bio",
        data: [5422, 5450, 4480, 4495, 5500, 5530, 4455, 4570, 5590, 5610],
        borderColor: "red",
        fill: false,
      },
      {
        label: "Small Particle",
        data: [4598, 4605, 3612, 3630, 4650, 4670, 3690, 3705, 4720, 4740],
        borderColor: "green",
        fill: false,
      },
      {
        label: "Large Particle",
        data: [3453, 3470, 2490, 2505, 3520, 3535, 2550, 2565, 3580, 3595],
        borderColor: "purple",
        fill: false,
      },
      {
        label: "Particle Size",
        data: [6898, 6905, 5920, 5930, 6950, 6975, 5400, 5330, 6055, 6080],
        borderColor: "orange",
        fill: false,
      },
    ],
  };

  return (
    <Box
      p={5}
      maxWidth={{ base: '100%', md: '90%' }}
      margin="0 auto"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="md"
    >
      <VStack spacing={6}>
        <Heading size="md" textAlign="center">
          Ibac Sensor Dashboard
        </Heading>
        <Divider borderColor="black.500" />
        <Box width="100%">
          <HStack spacing={4} width="100%">
            <Box>
              <Image
                src="/biological.png"
                alt="Sensor Icon"
                boxSize="50px"
                backgroundColor={"green.400"}
                filter="hue-rotate(90deg) saturate(2)"
              />
            </Box>
            <HStack spacing={4}>
              {statusCardData.map((card, index) => (
                <Cards key={index} data={[card]} />
              ))}
            </HStack>
            <Box></Box>
            <Box></Box>
            <Box></Box>
            <Box></Box>
            <Box></Box>
            <Box></Box>
            <Box alignContent={"flex-end"}>
              <Text>
                <b>Location:</b>
                <Text as="span" color="blue">
                  <b>UGF Zone 2</b>
                </Text>
              </Text>
            </Box>
            <Box alignContent={"flex-end"}>
              <Text>
                <b>Sensor Status:</b>
                <Text as="span" color="green">
                  <b>Active</b>
                </Text>
              </Text>
            </Box>
          </HStack>
        </Box>
        {/* Biological Parameters Section */}
        <Box width="100%">
          <Heading size="md" mb={4} color="blue.500">
            Biological Parameters
          </Heading>
          <Cards data={bioParamCardData} />

          <Box borderBottom="1px" borderColor="gray.300" my={4} />
          <Heading size="md" mb={4} color="blue.500">
            Health Parameters
          </Heading>
          <Cards data={healthCardData} />
        </Box>
        <HStack spacing={4} width="100%">
          <Box width={{ base: '100%', md: '50%' }}>
            {boiparamchartData.labels.length > 0 ? (
              <LineChart chartData={boiparamchartData} title="Biological Parameters" />
            ) : (
              <Text>No data available for Biological Parameters.</Text>
            )}
          </Box>

          {/* Health Parameters Section */}
          <Box width={{ base: '100%', md: '50%' }}>
            {healthparamchartData.labels.length > 0 ? (
              <LineChart chartData={healthparamchartData} title="Health Parameters" />
            ) : (
              <Text>No data available for Health Parameters.</Text>
            )}
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default IndividulSensor;
