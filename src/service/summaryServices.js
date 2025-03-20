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
      { title: "Chemical Alert", value: data.chemical_alerts.toString() },
      { title: "Biological Alert", value: data.biological_alerts.toString() },
      { title: "Radiological Alert", value: data.radiological_alerts.toString() },
      { title: "Total Sensor", value: data.total_sensors.toString() },
      { title: "Active Sensor", value: data.active_sensors.toString() },
      { title: "Inactive Sensor", value: data.inactive_sensors.toString() },
      { title: "Unhealthy Sensors", value: data.sensor_health },
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
    const response = await axios.get(`${API_BASE_URL}/floor/getFloorSummary?${filterData}`); // Replace with your actual API URL
    const data = response.data;

    // Transform API response to match expected format
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return []; // Return an empty array in case of error
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






