import { filter } from "@chakra-ui/react";
import axios from "axios";

//const API_BASE_URL = "http://10.131.19.205:5000/api";
const API_BASE_URL = `http://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`

export const getSensorData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary/getCardData`); // Replace with your actual API URL
    const data = response.data.data;

    // Transform API response to match expected format
    return [
      { title: "CBRN Alarms", value: data.cbrn_alarms.toString() },
      { title: "Chemical Alarms", value: data.chemical_alerts.toString() },
      { title: "Biological Alarms", value: data.biological_alerts.toString() },
      { title: "Radiological Alarms", value: data.radiological_alerts.toString() },
      { title: "Total Sensor", value: data.total_sensors.toString() },
      { title: "Active Sensor", value: data.active_sensors.toString() },
      { title: "Inactive Sensor", value: data.inactive_sensors.toString() },
      { title: "Faulty Sensors", value: data.sensor_health },
      { title: "Open Incident", value: data.incident_tracked.toString() },
    ];
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return []; // Return an empty array in case of error
  }
};


export const floorList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary/sensor-summary?param_floor=ALL`); // Replace with your actual API URL
    const data = response.data;

    // Transform API response to match expected format
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return []; // Return an empty array in case of error
  }
};


export const getFloorSummary = async (filterData) => {
  try {
    // Convert query string to object
    const params = new URLSearchParams(filterData);
    const body = Object.fromEntries(params.entries());
    
    console.log("Request Body: ", body);
    
    const response = await axios.post(`${API_BASE_URL}/floor/getFloorSummary`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching sensor data: " + JSON.stringify(error));
    return [];
  }
};


export const GetSensorSummary = async (floorName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/floor/getSensorSummary?${floorName}`);
    const data = response.data;
    // Transform API response to match expected format
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return []; // Return an empty array in case of error
  }
};

export const getFloorZoneSelector = async (params) => {
  try {
    console.log((`${API_BASE_URL}/floor/getZoneList?${params}`));
    const response = await axios.get(`${API_BASE_URL}/floor/getZoneList?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const getLocationSelector = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/floor/getLocationSelector?${params}`);
    const data = response.data;
    // Transform API response to match expected format
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return []; // Return an empty array in case of error
  }
};


// Fetch Sensor Type Selector
export const getSensorTypeSelector = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/floor/getSensorTypeSelector?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor type selector:", error);
    return [];
  }
};

// Fetch Sensor Name Selector
export const getSensorNameSelector = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/floor/getSensorNameSelector?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor name selector:", error);
    return [];
  }
};

// Fetch Sensor Status Selector
export const getSensorStatusSelector = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/floor/getSensorStatusSelector?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor status selector:", error);
    return [];
  }
};

export const getFloorAlartList = async () => {
  try {
    console.log("getFloor "+`${API_BASE_URL}/floor/getFloorAlerts`);
    const response = await axios.get(`${API_BASE_URL}/floor/getFloorAlerts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor status selector:", error);
    return [];
  }
};






