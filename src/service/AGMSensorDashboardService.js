import axios from "axios";

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//const API_BASE_URL = "http://10.131.16.186:4000/api";
const API_BASE_URL = "http://localhost:4000/api";

export const getAGMSensordashboardData = async (device_id) => {
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

export const getParamsData = async (device_id) => {
    try {
        const url = `${API_BASE_URL}/latest-detailed-agm-sensor-data?device_id=${device_id}`;
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const jsonData = response.data;

        if (!jsonData || !jsonData.data) {
            console.warn("API response is empty or malformed");
            return [];
        }

        // Mapping category names
        const categoryMappings = {
            radiation_parameters: "Radiation Parameter",
            health_status: "Health Status",
            sensor_setting: "Sensor Setting",
        };

        // Convert JSON into table-friendly format
        const transformData = (data) => {
            return Object.entries(data).flatMap(([category, values]) =>
                Object.entries(values).map(([key, value]) => ({
                    category: categoryMappings[category] || category, // Map category name
                    name: key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase()), // Format name
                    value: typeof value === "number" ? parseFloat(value.toFixed(2)) : value,
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


export const getGraphData = async (device_id, timeRange, analysisType) => {
  try {
      const url = `${API_BASE_URL}/agmdose-rate-chart?param_device_id=${device_id}`;
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

      console.log("API Response:", jsonData);
      // Convert JSON into table-friendly format
      const transformSensorData = (jsonData) => {
        if (!jsonData || !Array.isArray(jsonData)) {
          console.error("Invalid JSON data: ", jsonData);
          return { labels: [], datasets: [] };
        }
      
        return {
          labels: "Small Bio",
          datasets: [
            {
              label: "Dose Rate",
              data: jsonData.map((entry) => entry.dose_rate ?? 0),
            },
            {
              label: "Anomaly",
              data: jsonData.map((entry) => entry.anomaly ?? 0),
            },
            {
              label: "Outlier",
              data: jsonData.map((entry) => entry.outlier ?? 0),
            }
          ],
        };
      };
      
      const formattedData = transformSensorData(jsonData);
      return formattedData;
  } catch (error) {
      console.error("Error fetching data from API:", error);
      throw error;
  }
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
