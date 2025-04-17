import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `http://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/floor`;

export const fetchLocationData = async (deviceId) => {
  try {
    const url = `${API_BASE_URL}/getZoneDetails`;
    const params = {
      param_device_id: deviceId,
    };

    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching location data:", error); // fixed message
    throw error;
  }
};



