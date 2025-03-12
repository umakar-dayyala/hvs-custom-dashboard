import React, { useState } from "react";
import { 
  Box, Flex, Grid, Select, Input, Button, Text, Switch, Divider, Icon, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure
} from "@chakra-ui/react";
import { FaBiohazard } from "react-icons/fa";
import "../css/Header.css";
import { useEffect } from "react";
import axios from "axios";

const IBACParameterSettings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // State for authentication modal
  const [auth, setAuth] = useState({ username: "", password: "", isAuthenticated: false });
  
  // State for dropdown selections
  const [selectedValues, setSelectedValues] = useState({});
  
  // State for switches
  const [switchValues, setSwitchValues] = useState({
    alarmFunction: false,
    pumpStatus: false,
    auxiliaryStatus: false,
    auxiliaryAlarmStatus: false,
    autoCollect: false,
    collect: false,
  });

  // State for other inputs
  const [inputValues, setInputValues] = useState({
    datetime: "",
    ipAddress: "",
    networkMask: "",
    routerIP: ""
  });

  // Flag to track if user has attempted to change any setting
  const [hasAttemptedChange, setHasAttemptedChange] = useState(false);

  // Dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    Floor: [],
    Zone: [],
    Location: [],
    SensorType: [],
    Sensor: [],
    DeviceID: [],
  });

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.get("/api/dropdown-options");
        setDropdownOptions(response.data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchDropdownOptions();
  }, []);

  //Handle dropdown selection
  const handleDropdownChange = (key, value) => {
    setSelectedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSwitchChange = (key) => {
    if (!auth.isAuthenticated) {
      if (!hasAttemptedChange) {
        setHasAttemptedChange(true);
        onOpen();
      }
    } else {  
      setSwitchValues((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleInputChange = (key, value) => {
    if (!auth.isAuthenticated) {
      if (!hasAttemptedChange) {
        setHasAttemptedChange(true);
        onOpen();
      } else {
        onOpen();
      }
      
    } else {
      setInputValues((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Handle authentication submission
  const handleAuthSubmit = () => {
    if (auth.username === "admin" && auth.password === "admin1234") {
      setAuth((prev) => ({ ...prev, isAuthenticated: true }));
      onClose(); // Close modal after authentication
    } else {
      alert("Invalid credentials! Try again.");
    }
  };
  
  // Handle authentication Cancel
  const handleAuthCancel = () => {
    setAuth((prev) => ({ ...prev, isAuthenticated: false }));
    onClose();
  };  

  return (
    <Box bg="gray.800" p={5} borderRadius="lg" color="white" height="100vh">
      {/* Dropdown Selectors */}
      <Grid templateColumns="repeat(6, 1fr)" gap={4} mb={6}>
        {["Floor", "Zone", "Location", "SensorType", "Sensor", "DeviceID"].map((key) => (
          <Select 
            key={key} 
            placeholder={key.replace(/([A-Z])/g, " $1")} 
            bg="gray.700" 
            borderColor="gray.600"
            onChange={(e) => handleDropdownChange(key, e.target.value)}
          >
            {dropdownOptions[key].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        ))}
      </Grid>

      {/* Header Section */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Parameter Setting</Text>
      </Flex>

      <Divider borderColor="gray.600" mb={4} />

      {/* Sensor Details */}
      <Flex align="center" mb={4}>
        <Icon as={FaBiohazard} w={12} h={12} color="green.400" mr={4} />
        <Box>
          <Text fontSize="md" fontWeight="bold">IBAC Sensor Parameter</Text>
        </Box>
      </Flex>

      {/* Network & Alarm Settings */}
      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
        {/* Static Input Fields */}
        {["Datetime", "IP Address", "Network Mask", "Router IP"].map((label) => (
          <Flex key={label} align="center" justify="space-between" bg="gray.700" p={2} borderRadius="md">
            <Text>{label}</Text>
            <Input 
              placeholder={label} 
              width="60%" 
              bg="gray.600" 
              borderColor="gray.500" 
              value={inputValues[label.toLowerCase().replace(/ /g, '')]}
              onChange={(e) => handleInputChange(label.toLowerCase().replace(/ /g, ''), e.target.value)}
            />
          </Flex>
        ))}

        {/* Switches for Enable/Disable Options */}
        {Object.keys(switchValues).map((key) => (
          <Flex key={key} align="center" justify="space-between" bg="gray.700" p={2} borderRadius="md">
            <Text>{key.replace(/([A-Z])/g, " $1")}</Text>
            <Switch 
              colorScheme="blue" 
              isChecked={switchValues[key]} 
              onChange={() => handleSwitchChange(key)}
            />
          </Flex>
        ))}
      </Grid>

      {/* Update Button */}
      <Button colorScheme="blue" width="100px" mt={4}>Update</Button>

      <Divider borderColor="gray.600" my={6} />

      {/* Custom ICCC Settings */}
      <Box>
        <Flex justify="space-between" align="center">
          <Text>Enable Predictive Analytics</Text>
          <Switch colorScheme="blue" />
        </Flex>
      </Box>

      {/* Authentication Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.700" color="white">
          <ModalHeader>Authentication Required</ModalHeader>
          <ModalBody>
            <Text mb={4} color="red.300">⚠️ Please enter your credentials to proceed.</Text>
            <Input 
              placeholder="Username" 
              mb={3} 
              bg="gray.600" 
              borderColor="gray.500" 
              value={auth.username} 
              onChange={(e) => setAuth({ ...auth, username: e.target.value })}
            />
            <Input 
              type="password" 
              placeholder="Password" 
              mb={3} 
              bg="gray.600" 
              borderColor="gray.500" 
              value={auth.password} 
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAuthSubmit}>Submit</Button>
            <Button colorScheme="red" ml={3} onClick={handleAuthCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default IBACParameterSettings;
