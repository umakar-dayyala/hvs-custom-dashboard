import axios from "axios";

//const API_BASE_URL = "http://10.131.19.205:5000/api";
const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`

export const getSensorData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary/getCardData`); // Replace with your actual API URL
    const data = response.data.data;

    // Transform API response to match expected format
    return [
      { title: "CBRN Alarms", value: data.cbrn_alarms.toString() },
      { title: "Chemical Alarms", value: data.chemical_alarms.toString() },
      { title: "Biological Alarms", value: data.biological_alarms.toString() },
      { title: "Radiological Alarms", value: data.radiological_alarms.toString() },
      { title: "Total Sensor", value: data.total_sensors.toString() },
      {title: "Disconnected Sensor", value:data.disconnected_sensors},
      { title: "Active Sensor", value: data.active_sensors.toString() },
      { title: "Inactive Sensor", value: data.inactive_sensors.toString() },
      { title: "Faulty Sensors", value: data.sensor_health },
      // { title: "Open Incident", value: data.incident_tracked.toString() },
    ];
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return []; // Return an empty array in case of error
  }
};

export const summaryData = async () => {
     try {

      const response = await axios.get(`${API_BASE_URL}/summary/getCardData`); // Replace with your actual API URL
      const data = response.data.data;
      console.log("Summary Data: ", data);
      return data;
      
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

export const getDeviceNotifications = async (deviceIds) => {
  try {
    const idsParam = deviceIds.join(',');
    const response = await axios.get(`${API_BASE_URL}/floor/getRedisCache`, {
      params: { device_ids: idsParam },
    });
    return response.data;
  } catch (error) {
    console.error('API error while getting Floor wise notifications :', error);
    throw error;
  }
};

export const getDeviceNotifications_1 = async (deviceIds) => {
  // Fake the deviceIds check if needed
  const hardcodedResponse = {
    count: 2,
    devices: [
      {
        device_id: "145",
        cached: true,
        notifications: [
          {
            label: "Anomaly detected in Dose Rate 14",
            value: "2025-01-25 14:01:17.243",
            device_id: "145",
            sensor_name: "Gamdemo",
            description: "Gamdemoma Area Monitor",
            timestamp: "2025-01-25 14:01:17.243",
          },
          {
            label: "Intensity detected in Arsenic Concentration: Preliminary Warning 2 with value 14",
            value: "2025-01-25 14:01:17.243",
            device_id: "145",
            sensor_name: "Gamdemo",
            description: "Gamdemoma Area Monitor",
            timestamp: "2025-01-25 14:01:17.243",
          },
          {
            label: "Outlier detected in Dose Rate 16",
            value: "2025-01-25 14:01:17.243",
            device_id: "145",
            sensor_name: "Gamdemo",
            description: "Gamdemoma Area Monitor",
            timestamp: "2025-01-25 14:01:17.243",
          },
          {
            label: "Anomaly detected in Dose Rate 16",
            value: "2025-01-25 14:01:17.243",
            device_id: "145",
            sensor_name: "Gamdemo",
            description: "Gamdemoma Area Monitor",
            timestamp: "2025-01-25 14:01:17.243",
          },
          {
            label: "Intensity detected in Arsenic Concentration: Preliminary Warning 3 with value 16",
            value: "2025-01-25 14:01:17.243",
            device_id: "145",
            sensor_name: "Gamdemo",
            description: "Gamdemoma Area Monitor",
            timestamp: "2025-01-25 14:01:17.243",
          },
        ],
      },
      {
        device_id: "111",
        cached: true,
        notifications: [
          {
            label:
              'IBAC Biological Alarm UGF_Z1 - Biological Alarm Occurred - Small Bio Count "95", BG2 "500", BG3 "18"',
            value: "2024-11-1517:15:30.543",
            device_id: "111",
            sensor_name: "IBAC_1121",
            description: "",
            timestamp: "2024-11-1517:15:30.543",
          },
          {
            label: "IBAC Health Alert UGF_Z1 - Pressure Fault Cleared",
            value: "2024-11-1517:15:30.543",
            device_id: "111",
            sensor_name: "IBAC_1121",
            description: "",
            timestamp: "2024-11-1517:15:30.543",
          },
          {
            label: "Outlier detected in Small Particle 208636000",
            value: "2024-11-1517:15:30.543",
            device_id: "111",
            sensor_name: "IBAC_1121",
            description: "",
            timestamp: "2024-11-1517:15:30.543",
          },
        ],
      },
    ],
    timestamp: "2025-05-22T18:55:50.013Z",
  };

  // Simulate async call
  return new Promise((resolve) => setTimeout(() => resolve(hardcodedResponse), 300));
};







