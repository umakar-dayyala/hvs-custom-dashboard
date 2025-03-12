import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  VStack,
  Input,
  Button,
  Text,
  HStack,
} from '@chakra-ui/react';
import {getFloorZone, getLocationAndAll, summeryDashboardData} from '../service/summeryDashboard'; 

const Filters = ({
  onApplyFilters,
  zones = [],
  all_floor = [],
  locations = [],
  sensorType = [],
  sensors = [],
  sensorStatuses = [],
  defaultFilters = {
    all_floor: 'ALL',
    location: 'ALL',
    sensorType: 'ALL',
    sensor: 'ALL',
    sensorStatus: 'ALL',
    incident: 'ALL',
  },
}) => {
  const [locationsData, setSelectedLocations] = useState([]);
  const [sensorTypeData, setSelectedSensorTypes] = useState([]);
  const [sensorsData, setSelectedSensors] = useState([]);

  const [filterType] = useState('location'); // Default filter type
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [zoneData, setZoneData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(defaultFilters.location || 'ALL');
  const [selectedSensorType, setSelectedSensorType] = useState(defaultFilters.sensorType || '');
  const [selectedSensor, setSelectedSensor] = useState(defaultFilters.sensor || '');
  const [selectedSensorStatus, setSelectedSensorStatus] = useState(defaultFilters.sensorStatus || 'ALL');
  const [selectedIncident, setSelectedIncident] = useState(defaultFilters.incident || '');

  // Synchronize state with defaultFilters if they change
  useEffect(() => {
    setSelectedLocation(defaultFilters.location || '');
    setSelectedSensorType(defaultFilters.sensorType || '');
    setSelectedSensor(defaultFilters.sensor || '');
    setSelectedSensorStatus(defaultFilters.sensorStatus || '');
    setSelectedIncident(defaultFilters.incident || '');
  }, [defaultFilters]);

  const handleSearch = async() => {
    const filters = {
      filterType,
      selectedZone,
      selectedFloor,
      selectedLocation,
      selectedSensorType,
      selectedSensor,
      selectedSensorStatus,
      selectedIncident,
    };
    //alert(`Filters Applied: ${JSON.stringify(filters)}`);
    await summeryDashboardData(filters);
    onApplyFilters(filters); // Call parent callback with selected filters
  };

  const handleFloorChange = async (e) => {
    const newFloor = e.target.value;
    const floorParams = newFloor.split(',').map(floor => `param_floor=${floor}`).join('&');
    setSelectedFloor(newFloor);

    console.log('Selected Floor:', floorParams);

    // Call the API with the new floor value
    try {
      const response = await getFloorZone(floorParams);
      setZoneData(response.zones);
      console.log('zone API response:', response.zones);
      // Handle the API response data as needed
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleZoneChange = async(e) => {
    const newZone = e.target.value;
    setSelectedZone(newZone);
    const selectedFloors = selectedFloor.split(',');
    const zoneParams = selectedFloors.map(floor => `param_floor=${floor}`).join('&') + '&' + newZone.split(',').map(zone => `param_zone=${zone}`).join('&');

    const response = await getLocationAndAll(zoneParams);

    setSelectedLocations(response.locations || '');
    setSelectedSensorTypes(response.sensorTypes || '');
    setSelectedSensors(response.sensors || '');

    console.log('All API response:', response);
  }

  return (
    <Box 
    // borderWidth="1px"
    borderRadius="md" p={4} bg="#f4f5f5" boxShadow="sm" color="#676a6c">
      <VStack align="stretch" spacing={4}>
        <Text fontWeight="bold" fontSize="lg">
          View Sensors By
        </Text>
        <HStack align="stretch" spacing={4}>
        <Select
            placeholder="Select Floor"
            value={selectedFloor}
            onChange={handleFloorChange}
          >
            {all_floor.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Zone"
            value={selectedZone}
            onChange={handleZoneChange}
          >
            {zoneData.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locationsData.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Sensor Type"
            value={selectedSensorType}
            onChange={(e) => setSelectedSensorType(e.target.value)}
          >
            {sensorTypeData.map((sensorType) => (
              <option key={sensorType} value={sensorType}>
                {sensorType}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Sensor"
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
          >
            {sensorsData.map((sensor) => (
              <option key={sensor} value={sensor}>
                {sensor}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Status"
            value={selectedSensorStatus}
            onChange={(e) => setSelectedSensorStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
          
          {/* <Select
            placeholder="Select Active Incident"
            value={selectedIncident}
            onChange={(e) => setSelectedIncident(e.target.value)}
          >
            {incidents.map((incident) => (
              <option key={incident} value={incident}>
                {incident}
              </option>
            ))}
          </Select> */}
        </HStack>
        <HStack justify="flex-end">
          <Button colorScheme="blue" size={{ base: 'sm', md: 'md' }} onClick={handleSearch}>
            Search
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Filters;
