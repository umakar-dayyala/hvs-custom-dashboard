import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://localhost:5000/api/alarmSummary`;

export const fetchAlarmSummary = async () => {
  try {
    const url = `${API_BASE_URL}/getAlarmSummary`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching location data:", error); // fixed message
    throw error;
  }
};


