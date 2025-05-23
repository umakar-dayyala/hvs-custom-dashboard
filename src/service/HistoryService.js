import axios from "axios";
import dayjs from "dayjs";
 
const BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/historical`;
 
export const getSensorEventHistory = async (filters) => {
  try {
    const params = {};

    if (!filters.deviceId && !filters.sensorType) {
      throw new Error("Device ID or Sensor Type is required");
    }

    if (filters.sensorType) {
      if (!filters.sensorNames?.length) {
        throw new Error("Sensor Name is required");
      }
      if (!filters.sensorLocation?.length) {
        throw new Error("Location is required");
      }
      params.sensorType = filters.sensorType;
      params.sensorName = filters.sensorNames[0]; // Use single value
      params.location = filters.sensorLocation[0]; // Use single value
    } else if (filters.deviceId) {
      params.deviceId = filters.deviceId;
    }

    if (!filters.dateRange || !filters.dateRange[0] || !filters.dateRange[1]) {
      throw new Error("Start and End dates are required");
    }

    params.startTime = filters.dateRange[0].format("YYYY-MM-DD HH:mm:ss.000");
    params.endTime = filters.dateRange[1].format("YYYY-MM-DD HH:mm:ss.000");

    console.log("Fetching historical data with params:", params);
    const response = await axios.get(`${BASE_URL}/getHistoricalData`, { params });
    console.log("Historical data response:", response.data);

    if (response.data.success) {
      return response.data.data.map((item) => ({
        device_id: item.device_id ?? "N/A",
        sensor_status: item.sensor_status ?? "Unknown",
        sensor_type: item.sensor_type ?? "Unknown",
        sensor_name: item.sensor_name ?? "Unknown",
        description: item.description ?? "N/A",
        connection: item.connection ?? false,
        health: item.health ?? false,
        timestamp: item.timestamp ?? "N/A",
        datetime: item.datetime ?? "N/A",
        ...item,
      }));
    }
    throw new Error(`API returned success: false - ${response.data.message || "Unknown error"}`);
  } catch (error) {
    console.error("Error fetching historical data:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      request: error.config,
    });
    throw error;
  }
};

export const getHistDeviceId = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getHistDeviceId`);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error("No device IDs returned");
  } catch (error) {
    console.error("Error fetching device IDs:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      request: error.config,
    });
    throw error;
  }
};

export const getSensorTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getSensorType`);
    if (response.data.data) {
      console.log("Fetched sensor types:", response.data.data);
      return response.data.data;
    }
    throw new Error("No sensor types returned");
  } catch (error) {
    console.error("Error fetching sensor types:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      request: error.config,
    });
    throw error;
  }
};

export const getSensorNamesByType = async (sensorType) => {
  try {
    const response = await axios.get(`${BASE_URL}/getSensorName`, {
      params: { param_sensor_type: sensorType },
    });
    if (response.data.data) {
      console.log(`Fetched sensor names for ${sensorType}:`, response.data.data);
      return response.data.data;
    }
    throw new Error("No sensor names returned");
  } catch (error) {
    console.error(`Error fetching sensor names for ${sensorType}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      request: error.config,
    });
    throw error;
  }
};

export const getSensorLocations = async (sensorNames = null) => {
  try {
    const params = {};
    if (sensorNames?.length > 0) {
      params.param_sensor_name = sensorNames.join(",");
    }
    console.log("Fetching sensor locations with params:", params);
    const response = await axios.get(`${BASE_URL}/getSensorLocation`, { params });
    console.log("Sensor locations response:", response.data);
    const locations = response.data.data
      ? [...new Set(response.data.data.map((item) => item.location))]
      : [];
    console.log("Fetched sensor locations:", locations);
    return locations;
  } catch (error) {
    console.error("Error fetching sensor locations:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      request: error.config,
    });
    return [];
  }
};