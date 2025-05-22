import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`


export const fetchAGMParamChartData = async (deviceId, fromTime, toTime) => {
  try {
    const url = `${API_BASE_URL}/agm/getAgmChart`;
    const params = {
      param_device_id: deviceId,
      // param_device_id: 5,
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
      const url = `${API_BASE_URL}/agm/getAgmChartAnomaly`;
      const params = {
        param_device_id: deviceId,
        // param_device_id: 5,
        param_start_date: `${fromTime}`,  // Add single quotes around the dates
        param_end_date: `${toTime}`,
      };
  
      // console.log("Request URL:", url);
      // console.log("Request Params:", params);
  
      const response = await axios.get(url, { params });
  
      // console.log("Fetched anomaly chart data:"+JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching anomaly chart data:", error);
      throw error;
    }
  };

export const fetchOutlierChartData = async (deviceId, fromTime, toTime) => {
  try {
      const url = `${API_BASE_URL}/agm/getAgmChartOutlier`;
      const params = {
        param_device_id: deviceId,
        // param_device_id: 5,
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


export const getAGMSensordashboardData = async (device_id) => {
  // console.log("API getAGMSensordashboardData called with device_id:", device_id);
  try {
    const url = `${API_BASE_URL}/latest-agm-sensor-data?device_id=${device_id}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;

    const sensorMappings = Object.keys(jsonData).map((key) => ({
      key,
      label: key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: jsonData[key],
      hasNotification: (jsonData[key] == 'Alarm' || jsonData[key] === 0 || jsonData[key] == 'Fault') ? true : false,
      type: "radiological",
    }));

    const IBACSensordashboardData = {
      statusCards: sensorMappings,
    };
    console.log("API statusCards Response:", IBACSensordashboardData);
    return IBACSensordashboardData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

 export const getParamsData = async () => {
    const parameterData = [
        { category: "Radiation parameter", name: "Dose Rate", value: 1325 },
        { category: "Radiation parameter", name: "Scaling Factor", value: 5422 },
        { category: "Radiation parameter", name: "Small Particle", value: 4598 },
        { category: "Radiation parameter", name: "Max Level", value: 4598 },
        { category: "Radiation parameter", name: "Min Level​", value: 4598 },
        { category: "Health Status​", name: "LV status", value: 3.44 },
        { category: "Health Status​", name: "DET status", value: 40.28 },
        { category: "Health Status​", name: "RTC status", value: 370 },
        { category: "Health Status​", name: "HV status", value: 1.4 },
        { category: "Health Status​", name: "SDcard status", value: 3.33 },
        { category: "Health Status​", name: "Input Voltage", value: 23.93 },
        { category: "Health Status​", name: "Mother Board Controller status", value: 45.25 },
        { category: "Sensor Settings", name: "Reset Mode ", value: "OK" },
        { category: "Sensor Settings", name: "Data Logging", value: "OK" },
        { category: "Sensor Settings", name: "Buzzer ", value: "OK" },
        { category: "Sensor Settings", name: "Buzzer Tone ", value: "OK" },
        { category: "Sensor Settings", name: "Background Light Monitor ", value: "OK" },
        
      ];
    return parameterData;

 };
  
export const getRadiationParameterData = async (timeRange, analysisType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const labels = [
        "2025-02-10T10:00:00Z",
        "2025-02-10T10:05:00Z",
        "2025-02-10T10:10:00Z",
        "2025-02-10T10:15:00Z",
        "2025-02-10T10:20:00Z",
        "2025-02-10T10:25:00Z",
        "2025-02-10T10:30:00Z",
        "2025-02-10T10:35:00Z",
        "2025-02-10T10:40:00Z",
        "2025-02-10T10:45:00Z",
      ];

      // Outlier and anomaly mapping per dataset
      const specialPoints = {
        "Dose Rate": {
          outlierIndices: [2, 6], // Outliers at index 2 and 6
          anomalyIndices: [4], // Anomaly at index 4
        }
      };

      const datasets = [
        {
          label: "Dose Rate",
          data: [2325, 2330, 2338, 2345, 2350, 2360, 2375, 2380, 2390, 2400],
        },
      ];

      // Format datasets dynamically
      const formattedDatasets = datasets.map((dataset) => {
        const { outlierIndices = [], anomalyIndices = [] } = specialPoints[dataset.label] || {};

        return {
          ...dataset,
          pointRadius: dataset.data.map((_, index) =>
            analysisType === "Outlier" && outlierIndices.includes(index)
              ? 6 // Show red dot
              : analysisType === "Anomaly" && anomalyIndices.includes(index)
              ? 6 // Show yellow dot
              : 0 // No dots otherwise
          ),
          pointBackgroundColor: dataset.data.map((_, index) =>
            analysisType === "Outlier" && outlierIndices.includes(index)
              ? "red"
              : analysisType === "Anomaly" && anomalyIndices.includes(index)
              ? "yellow"
              : "transparent"
          ),
        };
      });

      resolve({ labels, datasets: formattedDatasets });
    }, 1000);
  });
};
  
export const getHealthParameterData = async (timeRange, analysisType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const labels = [
          "2025-02-10T10:00:00Z",
          "2025-02-10T10:05:00Z",
          "2025-02-10T10:10:00Z",
          "2025-02-10T10:15:00Z",
          "2025-02-10T10:20:00Z",
          "2025-02-10T10:25:00Z",
          "2025-02-10T10:30:00Z",
          "2025-02-10T10:35:00Z",
          "2025-02-10T10:40:00Z",
          "2025-02-10T10:45:00Z",
        ];
   
        // Outlier and anomaly mapping per dataset
        const specialPoints = {
          "Dose Rate": {
            intensityIndices: [2, 6], // Outliers at index 2 and 6
            predictiveIndices: [4], // Anomaly at index 4
          }
        };
  
        const datasets = [
          {
            label: "Dose Rate",
            data: [2325, 2330, 2338, 2345, 2350, 2360, 2375, 2380, 2390, 2400],
          },
        ];
  
        // Format datasets dynamically
        const formattedDatasets = datasets.map((dataset) => {
          const { intensityIndices = [], predictiveIndices = [] } = specialPoints[dataset.label] || {};
  
          return {
            ...dataset,
            pointRadius: dataset.data.map((_, index) =>
              analysisType === "Intensity" && intensityIndices.includes(index)
                ? 6 // Show red dot
                : analysisType === "Predictive" && predictiveIndices.includes(index)
                ? 6 // Show yellow dot
                : 0 // No dots otherwise
            ),
            pointBackgroundColor: dataset.data.map((_, index) =>
              analysisType === "Intensity" && intensityIndices.includes(index)
                ? "red"
                : analysisType === "Predictive" && predictiveIndices.includes(index)
                ? "yellow"
                : "transparent"
            ),
          };
        });
  
        resolve({ labels, datasets: formattedDatasets });
      }, 1000);
    });
  };
