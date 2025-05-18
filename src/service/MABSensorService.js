import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `http://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/mab`

export const fetchMABParamChartData = async (deviceId, fromTime, toTime) => {
  try {
    const url = `${API_BASE_URL}/getMabChart`;
    const params = {
      param_device_id: deviceId,
      // param_device_id: 1150,
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


export const fetchASUData = async (deviceId) => {
  try {
    const url = `${API_BASE_URL}/getAsm`;
    const params = {
      param_device_id: deviceId,
    };
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching bio param chart data:", error);
    throw error;
  }
};




export const fetchAnomalyChartData = async (deviceId, fromTime, toTime) => {
  try {
      const url = `${API_BASE_URL}/getMabChartAnomaly`;
      const params = {
        param_device_id: deviceId,
        // param_device_id: 1150,
        param_start_date: `${fromTime}`,  // Add single quotes around the dates
        param_end_date: `${toTime}`,
      };
  
      // console.log("Request URL:", url);
      // console.log("Request Params:", params);
  
      const response = await axios.get(url, { params });
  
      //console.log("Fetched anomaly chart data:"+JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching anomaly chart data:", error);
      throw error;
    }
  };

export const fetchOutlierChartData = async (deviceId, fromTime, toTime) => {
  try {
      const url = `${API_BASE_URL}/getMabChartOutlier`;
      const params = {
        param_device_id: deviceId,
        // param_device_id: 1150,
        param_start_date: `${fromTime}`,  // Add single quotes around the dates
        param_end_date: `${toTime}`,
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

export const getIBACSensordashboardData_test = (device_id, callback) => {
  const url = `http://10.131.19.202:4000/sse`; // SSE endpoint
  const eventSource = new EventSource(url);

  // Handling incoming SSE messages
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Filter data based on the provided device_id
      if (parseInt(data.device_id) === parseInt(device_id)) {
        callback(null, data); // Pass only matching data to the callback
      }
    } catch (err) {
      console.error("Error parsing SSE data:" +err);
      callback(err, null); // Pass error to the callback if any
    }
  };

  // Handling SSE error
  eventSource.onerror = (error) => {
    console.error("SSE Error:"+ error);
    callback(error, null); // Pass error to callback
    eventSource.close();
  };

  return eventSource; // Return EventSource so the caller can close it when done
};
