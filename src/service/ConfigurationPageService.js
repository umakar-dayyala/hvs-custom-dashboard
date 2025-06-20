import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`

export const fetchConfigurationData = async () => {
  try {
    const url = `${API_BASE_URL}/config/getOuterTableData`;
    
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("Error fetching config data:", error);
    throw error;
  }
};



export const sendParams = (cmd) =>
  axios.post("/mqtt/send", cmd);


export const fetchDetectorParameters = async (device_id, sensor_name) => {
  const url = `${API_BASE_URL}/config/getSensorParameters`;
  const body = { device_id, sensor_name };

  try {
    const { data } = await axios.post(url, body);
    return data;                          // the JSON you showed
  } catch (err) {
    console.error("Error fetching detector parameters:", err);
    throw err;
  }
};

export const fetchSensorStatusData = async () => {
  try {
    const url = `${API_BASE_URL}/config/getAllSensors`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor status data:", error);
    throw error;
  }
};

// ConfigurationPageService.js

export const toggleSensorStatus = async (deviceId, action) => {
  try {
    const url = `${API_BASE_URL}/config/toggleSensorStatus`;
    const payload = { device_id: deviceId, action };
    console.log("Toggling sensor status:", payload);
    
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error toggling sensor status:", error);
    throw error;
  }
};


export const getStopLedParams = async (sensor_name, device_id) => {
  const response = await fetch(`${API_BASE_URL}/config/getStopLedParams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sensor_name, device_id }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch LED/Buzzer parameters");
  }

  const data = await response.json();
  return data;
};

export const fetchStopLedAckData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/config/getAckAlarmData`);
    return response.data;
  } catch (error) {
    console.error("Error fetching acknowledged alarm data:", error?.response?.data || error.message);
    throw new Error("Failed to fetch acknowledged alarm data");
  }
};