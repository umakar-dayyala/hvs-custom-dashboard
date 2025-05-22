import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/prm`

export const fetchPRMParamChartData = async (deviceId, fromTime, toTime) => {
  try {
    const url = `${API_BASE_URL}/getPrmChart`;
    const params = {
      param_device_id: deviceId,
      // param_device_id:43,
      
      param_start_date: `${fromTime}`,  // Add single quotes around the dates
      param_end_date: `${toTime}`,
    };
    // console.log("Request URL:", url);
    // console.log("Request Params:", params);

    const response = await axios.get(url, { params });

    // console.log("Fetched bio param chart data:"+JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error("Error fetching bio param chart data:", error);
    throw error;
  }
};


export const fetchAnomalyChartData = async (deviceId, fromTime, toTime) => {
  try {
      const url = `${API_BASE_URL}/getPrmChartAnomaly`;
      const params = {
        param_device_id: deviceId,
        // param_device_id: 43,
        param_start_date: `${fromTime}`,  // Add single quotes around the dates
        param_end_date: `${toTime}`,

        // param_device_id:43,
        // param_start_date: "'2025-03-07 19:52:37.000'",  // Add single quotes around the dates
        // param_end_date: "'2025-03-07 20:09:29.000'",
      };
  
      // console.log("Request URL:", url);
      // console.log("Request Params:", params);
  
      const response = await axios.get(url, { params });
  
      //console.log("Fetched anomaly chart data:"+JSON.stringify(response.data));
      return response.data.data;
    } catch (error) {
      console.error("Error fetching anomaly chart data:", error);
      throw error;
    }
  };

export const fetchOutlierChartData = async (deviceId, fromTime, toTime) => {
  try {
      const url = `${API_BASE_URL}/getPrmChartOutlier`;
      const params = {
        param_device_id: deviceId,
        // param_device_id: 43,
        param_start_date: `${fromTime}`,  // Add single quotes around the dates
        param_end_date: `${toTime}`,
        // param_device_id:43,
        // param_start_date: "'2025-03-07 19:52:37.000'",  // Add single quotes around the dates
        // param_end_date: "'2025-03-07 20:09:29.000'",
      };
  
      // console.log("Request URL:", url);
      // console.log("Request Params:", params);
  
      const response = await axios.get(url, { params });
  
      // console.log("Fetched bio param chart data:"+JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching outlier chart data:", error);
      throw error;
    }
  };

