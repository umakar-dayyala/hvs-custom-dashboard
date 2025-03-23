import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `http://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/ibac`

export const fetchBioParamChartData = async (deviceId, fromTime, toTime) => {
  try {
    const url = `${API_BASE_URL}/getIbacChart`;
    const params = {
      param_device_id: deviceId,
      // param_device_id: 1148,
      param_start_date: `${fromTime}`,  // Add single quotes around the dates
      param_end_date: `${toTime}`,

    
    // param_start_date: "'2024/11/15 17:15:30.543'",  // Add single quotes around the dates
    // param_end_date: "'2025/03/19 12:10:38.140'",
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
      const url = `${API_BASE_URL}/getIbacChartAnomaly`;
      const params = {
        param_device_id: deviceId,
        // param_device_id: 1148,
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
      const url = `${API_BASE_URL}/getIbacChartOutlier`;
      const params = {
        param_device_id: deviceId,
        // param_device_id:1148,
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


export const getIBACSensordashboardData = async (device_id) => {


  try {
    const url = `${API_BASE_URL}/latest-ibac-sensor-data?device_id=${device_id}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonData = response.data;

    const sensorMappings = Object.keys(jsonData).map((key) => ({
      key,
      label:
        key === "algo_arm_status"
          ? "Algo Alarm Status"
          : key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: jsonData[key],
      hasNotification:
        jsonData[key] == "Alarm" ||
        jsonData[key] === 0 ||
        jsonData[key] == "Fault"
          ? true
          : false,
      type: "biological",
    }));

    const IBACSensordashboardData = {
      statusCards: sensorMappings,
    };

    return IBACSensordashboardData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const getParamsData = async (device_id) => {
  try {
    const url = `${API_BASE_URL}/latest-detailed-ibac-sensor-data?device_id=${device_id}`;
    return [];
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;

    if (!jsonData || !response.data) {
      console.warn("API response is empty or malformed");
      return [];
    }

    // Mapping category names
    const categoryMappings = {
      biological_parameters: "Biological Parameters",
      health_status: "Health Status",
      health_parameters: "Health Parameters",
    };

    // Convert JSON into table-friendly format
    const transformData = (data) => {
      return Object.entries(data).flatMap(([category, values]) =>
        Object.entries(values).map(([key, value]) => ({
          category: categoryMappings[category] || category, // Map category name
          name: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()), // Format name
          value:
            typeof value === "number" ? parseFloat(value.toFixed(2)) : value,
        }))
      );
    };

    const formattedData = transformData(jsonData.data);
    console.log("API Response new:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const getBioParameterData = async (
  device_id,
  timeRange,
  analysisType
) => {
  return [];
  try {
    const url = `${API_BASE_URL}/chart-data?param_device_id=${device_id}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;

    if (!jsonData || !Array.isArray(jsonData)) {
      console.warn("API response is empty or malformed");
      return { labels: [], datasets: [] };
    }
// Function to format labels into camel case (first letter uppercase)
const formatLabel = (str) =>
  str
    .split("_")
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");

// Extract unique sorted timestamps
const labels = [...new Set(jsonData.map((item) => item.timestamp))]
  .map((ts) => new Date(ts).toISOString())
  .sort();

// Get all measurement keys dynamically (excluding timestamp, anomaly, and outlier)
const allKeys = Object.keys(jsonData[0] || {}).filter(
  (key) => !["timestamp", "anomaly", "outlier"].includes(key)
);

// Initialize datasets
let datasets = allKeys.map((key) => ({
  label: formatLabel(key), // Format label in readable format
  data: Array(labels.length).fill(null),
  outlierIndices: [],
  anomalyIndices: [],
}));

// Populate dataset values and track outliers/anomalies
labels.forEach((timestamp, index) => {
  const record = jsonData.find(
    (item) => new Date(item.timestamp).toISOString() === timestamp
  );

  if (record) {
    allKeys.forEach((key, datasetIndex) => {
      datasets[datasetIndex].data[index] = record[key] ?? 0;

      // Identify outliers and anomalies
      if (record.outlier === record[key]) {
        datasets[datasetIndex].outlierIndices.push(index);
      }
      if (record.anomaly === record[key]) {
        datasets[datasetIndex].anomalyIndices.push(index);
      }
    });
  }
});

// Format datasets dynamically for visualization
const formattedDatasets = datasets.map((dataset) => ({
  label: dataset.label,
  data: dataset.data,
  pointRadius: dataset.data.map((_, index) =>
    analysisType === "Outlier" && dataset.outlierIndices.includes(index)
      ? 6 // Red dot for outliers
      : analysisType === "Anomaly" && dataset.anomalyIndices.includes(index)
      ? 6 // Yellow dot for anomalies
      : 0
  ),
  pointBackgroundColor: dataset.data.map((_, index) =>
    analysisType === "Outlier" && dataset.outlierIndices.includes(index)
      ? "red"
      : analysisType === "Anomaly" && dataset.anomalyIndices.includes(index)
      ? "yellow"
      : "transparent"
  ),
}));

return { labels, datasets: formattedDatasets };

    //console.log("bio vishal API Response:", jsonData);
    // Convert JSON into table-friendly format
    /*const transformSensorData = (jsonData) => {
        if (!jsonData || !Array.isArray(jsonData)) {
          console.error("Invalid JSON data: ", jsonData);
          return { labels: [], datasets: [] };
        }
      
        return {
          labels: jsonData.map((entry) => entry.timestamp ? new Date(entry.timestamp).toISOString() : "Invalid Date"),
          datasets: [
            {
              label: "Small Bio",
              data: jsonData.map((entry) => entry.small_bio_count ?? 0),
            },
            {
              label: "Large Bio",
              data: jsonData.map((entry) => entry.large_bio_count ?? 0),
            },
            {
              label: "Small Particles",
              data: jsonData.map((entry) => entry.small_particle_count ?? 0),
            },
            {
              label: "Large Particles",
              data: jsonData.map((entry) => entry.large_particle_count ?? 0),
            },
          ],
        };
      };
      
      const formattedData = transformSensorData(jsonData);
      return formattedData; */
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const getHealthParameterData = async (
  device_id,
  timeRange,
  analysisType
) => {
  return [];
  try {
    const url = `${API_BASE_URL}/ibac-health-chart?param_device_id=${device_id}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;

    if (!jsonData || !response.data) {
      console.warn("API response is empty or malformed");
      return [];
    }
    // Function to format labels into camel case (first letter uppercase)
  const formatLabel = (str) =>
    str
      .split("_")
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join(" ");

  // Extract unique sorted timestamps
  const labels = [...new Set(jsonData.map((item) => item.timestamp))]
    .map((ts) => new Date(ts).toISOString())
    .sort();

  // Get all measurement keys dynamically (excluding timestamp, anomaly, and outlier)
  const allKeys = Object.keys(jsonData[0] || {}).filter(
    (key) => !["timestamp", "anomaly", "outlier"].includes(key)
  );

  // Initialize datasets
  let datasets = allKeys.map((key) => ({
    label: formatLabel(key), // Format label in readable format
    data: Array(labels.length).fill(null),
    outlierIndices: [],
    anomalyIndices: [],
  }));

  // Populate dataset values and track outliers/anomalies
  labels.forEach((timestamp, index) => {
    const record = jsonData.find(
      (item) => new Date(item.timestamp).toISOString() === timestamp
    );

    if (record) {
      allKeys.forEach((key, datasetIndex) => {
        datasets[datasetIndex].data[index] = record[key] ?? 0;

        // Identify outliers and anomalies
        if (record.outlier === record[key]) {
          datasets[datasetIndex].outlierIndices.push(index);
        }
        if (record.anomaly === record[key]) {
          datasets[datasetIndex].anomalyIndices.push(index);
        }
      });
    }
  });

  // Format datasets dynamically for visualization
  const formattedDatasets = datasets.map((dataset) => ({
    label: dataset.label,
    data: dataset.data,
    pointRadius: dataset.data.map((_, index) =>
      analysisType === "Outlier" && dataset.outlierIndices.includes(index)
        ? 6 // Red dot for outliers
        : analysisType === "Anomaly" && dataset.anomalyIndices.includes(index)
        ? 6 // Yellow dot for anomalies
        : 0
    ),
    pointBackgroundColor: dataset.data.map((_, index) =>
      analysisType === "Outlier" && dataset.outlierIndices.includes(index)
        ? "red"
        : analysisType === "Anomaly" && dataset.anomalyIndices.includes(index)
        ? "yellow"
        : "transparent"
    ),
  }));

  return { labels, datasets: formattedDatasets };
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

/*
export const getIBACSensordashboardData = async () => {
    const IBACSensordashboardData = {
        statusCards: [
            { label: "System Alert Status", value: 1, hasNotification: true,type: "biological" },
            { label: "Algo Alarm Status", value: 0, hasNotification: false,type: "biological" },
            { label: "Diagnostic Fault Status", value: 0, hasNotification: false,type: "biological" },
        ]
    };
    return IBACSensordashboardData;
};
*/

/*
 export const getParamsData = async () => {
    const parameterData = [
        { category: "Biological Parameter", name: "Small Bio", value: 1325 },
        { category: "Biological Parameter", name: "Large Bio", value: 5422 },
        { category: "Biological Parameter", name: "Small Particle", value: 4598 },
        { category: "Biological Parameter", name: "Large Particle", value: 4598 },
        { category: "Biological Parameter", name: "Particle Size​", value: 4598 },
        { category: "Health Parameter", name: "Exhaust Pressur", value: 3.44 },
        { category: "Health Parameter", name: "Laser PD", value: 40.28 },
        { category: "Health Parameter", name: "Laser Current", value: 370 },
        { category: "Health Parameter", name: "Background Monitor", value: 1.4 },
        { category: "Health Parameter", name: "3.3V Power Supply", value: 3.33 },
        { category: "Health Parameter", name: "Input Voltage", value: 23.93 },
        { category: "Health Parameter", name: "Internal Temperature", value: 45.25 },
        { category: "Health Status", name: "Pressure ", value: "OK" },
        { category: "Health Status", name: "Laser Power ", value: "OK" },
        { category: "Health Status", name: "Laser Current ", value: "OK" },
        { category: "Health Status", name: "Low Battery ", value: "OK" },
        { category: "Health Status", name: "Background Light Monitor ", value: "OK" },
        
      ];
    return parameterData;

 };

 */
/*
 export const getBioParameterData = async (timeRange, analysisType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          labels: [
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
          ], // Direct timestamps
          datasets: [
            {
              label: "Small Bio",
              data: [2325, 2330, 2338, 2345, 2350, 2360, 2375, 2380, 2390, 2400],
            },
            {
              label: "Large Bio",
              data: [5422, 5450, 4480, 4495, 4510, 4535, 4560, 4590, 4610, 4650],
            },
            {
              label: "Small Particles",
              data: [1200, 1215, 1230, 1245, 1260, 1275, 1290, 1305, 1320, 1335],
            },
            {
              label: "Large Particles",
              data: [3100, 3125, 3150, 3175, 3200, 3225, 3250, 3275, 3300, 3325],
            },
            {
              label: "Medium Particles",
              data: [2100, 2120, 2140, 2160, 2180, 2200, 2220, 2240, 2260, 2280],
            },
          ],
        });
      }, 1000);
    });
  };
  */

/*
  export const getHealthParameterData = async (timeRange, analysisType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          labels: [
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
          ], // Direct timestamps
          datasets: [
            {
              label: "Pressure",
              data: [72, 75, 78, 74, 77, 79, 81, 80, 76, 78],
            },
            {
              label: "Laser Power",
              data: [98, 97, 96, 95, 96, 97, 98, 97, 96, 95],
            },
            {
              label: "Background Light Monitor",
              data: [36.5, 36.6, 36.7, 36.4, 36.8, 36.9, 37.0, 36.7, 36.6, 36.5],
            },
            {
              label: "Low Battery",
              data: [120, 122, 124, 121, 123, 125, 126, 124, 123, 122],
            },
          ],
        });
      }, 1000);
    });
  };
  */
