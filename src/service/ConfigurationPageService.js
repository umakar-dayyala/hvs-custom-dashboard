import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `http://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`

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
