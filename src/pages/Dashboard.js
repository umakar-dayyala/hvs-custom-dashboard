import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Tabs, TabList, Tab, Text } from '@chakra-ui/react';
import Cards from '../components/Cards';
import Filters from '../components/Filters';
import { all_floor, summeryDashboardData, fetchFilterOptions, summeryDashboardCardsData } from '../service/summeryDashboard'; 
import AccordionTable from '../components/Accordion';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [filterParams, setFilterParams] = useState({});
  const [dashboardData, setDashboardData] = useState([]);
  const [floorData, setFloorData] = useState([]);
  const [alertData, setAlertData] = useState([]);
  const [cardData, setCardData] = useState([]);

  const [locations, setLocations] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorType, setSensorType] = useState([]);
  const [sensorStatus, setSensorStatus] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const defaultFilters = {
    location: '',
    sensorType: '',
    sensor: '',
    sensorStatus: '',
    incident: '',
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { locations, sensorTypes, sensorStatus, sensors, incidents } = await fetchFilterOptions();
        setLocations(locations || []);
        setSensorType(sensorTypes || []);
        setSensorStatus(sensorStatus || []);
        setSensors(sensors || []);
        setIncidents(incidents || []);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    handleApplyFilters(defaultFilters);
  }, []);

  const handleApplyFilters = async (filters) => {
    setFilterParams(filters);
    try {
      const data = await summeryDashboardData(filters);
      if (selectedTab === 'dashboard') {
        setDashboardData(data.floors || []);
      } else {
        setAlertData(data.alertData || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard or alert data:', error);
    }

    try {
      const cardData = await summeryDashboardCardsData();
      setCardData(cardData.data || []);
    } catch (error) {
      console.error('Error fetching card data:', error);
    }
  };

  useEffect(() => {
    floors();
  }, []);

  const floors = async () => {
    try {
      const data = await all_floor();
      setFloorData(data.floors || []);
    } catch (error) {
      console.error('Error fetching floor data:', error);
    }
  }


  const transformedData = Object.keys(cardData).length > 0 ? [
    { label: "CBRN Alerts", value: cardData.cbrn_alarms },
    { label: "Chemical Alerts", value: cardData.chemical_alerts },
    { label: "Biological Alerts", value: cardData.biological_alerts },
    { label: "Radiological Alerts", value: cardData.radiological_alerts },
    { label: "Sensor Health", value: cardData.sensor_health },
    { label: "Total Sensors", value: cardData.total_sensors },
    { label: "Active Sensors", value: cardData.active_sensors },
    { label: "Inactive Sensors", value: cardData.inactive_sensors },
    { label: "Open Incident", value: cardData.incident_tracked }
  ] : [];


  return (
    <Box
      maxWidth={{ base: '100%', md: '100%' }}
      borderRadius="sm"
      //bg="#282828" Black
      bg="#f5f5f5"
      //color="#faf9fd"
      color="#676a6c"
      boxShadow="md"
    >
      <VStack spacing={1} mt={5}>
        {selectedTab === 'dashboard' ? (
          <>
            <Box width="100%">
              <Cards data={transformedData} />
            </Box>

            <Box width="100%" bg={'#f5f5f5'} borderRadius={5}>
              <Filters
                onApplyFilters={handleApplyFilters}
                locations={locations}
                sensorType={sensorType}
                sensors={sensors}
                sensorStatus={sensorStatus}
                all_floor={floorData}
                defaultFilters={defaultFilters}
              />
            </Box>
            <Box width="100%" borderRadius={5}>
              {dashboardData.length > 0 ? (
                <AccordionTable floors={dashboardData} />
              ) : (
                <Box bg="#f5f5f5" width="100%" borderRadius={5} p={4}>
                  <Text>No Data To Display</Text>
                </Box>
              )}
            </Box>
          </>
        ) : null}
      </VStack>
    </Box>
  );
};

export default Dashboard;
