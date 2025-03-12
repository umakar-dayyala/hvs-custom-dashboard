import axios from "axios";

// Get API Base URL from environment variables
const API_BASE_URL = `http://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api`

export const getAP4CSensordashboardData = async () => {
    const AP4CSensordashboardData = {
        statusCards: [
            { label: "Alarm CH", value: 1, hasNotification: true,type: "chemical" },
            { label: "Alarm AS", value: 0, hasNotification: false,type: "chemical" },
            { label: "Alarm CN", value: 0, hasNotification: false,type: "chemical" },
            { label: "Alarm G", value: 0, hasNotification: false,type: "chemical" },
            { label: "Alarm HD", value: 0, hasNotification: false,type: "chemical" },
        ]
    };
    return AP4CSensordashboardData;
};

 export const getParamsData = async () => {
    const parameterData = [
        { category: "chemical Parameter", name: "Hydrocarbon concentration(CH)", value: 1325 },
        { category: "chemical Parameter", name: "Arsenic Concentration(CAS)", value: 5422 },
        { category: "chemical Parameter", name: "Cyanide Concentration(CHNO)", value: 4598 },
        { category: "chemical Parameter", name: "Phosphorus Concentration(CP)", value: 4598 },
        { category: "chemical Parameter", name: "Sulphur Concentration(CS)​", value: 4598 },
        { category: "Health Status", name: "Power supply too low ", value: "OK" },
        { category: "Health Status", name: "Purge ", value: "OK" },
        { category: "Health Status", name: "Monitor ", value: "OK" },
        { category: "Health Status", name: "Detector ready", value: "OK" },
        { category: "Health Status", name: "Device fault", value: "OK" },
        { category: "Health Status", name: "Lack of hydrogen", value: "OK" },
        { category: "Health Status", name: "Maintenance required ", value: "OK" },
        { category: "Health Status", name: "Test mode in progress ", value: "OK" },
      ];
    return parameterData;

 };

 export const getChemicalParameterData = async (timeRange, analysisType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = {
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
          ],
          datasets: [
            {
              label: "Hydrocarbon concentration(CH)",
              data: [2325, 2330, 2338, 2345, 2350, 2360, 2375, 2380, 2390, 2400],
              outlierIndices: [2, 6],
              anomalyIndices: [4],
            },
            {
              label: "Arsenic Concentration(CAS)",
              data: [5422, 5450, 4480, 4495, 4510, 4535, 4560, 4590, 4610, 4650],
              outlierIndices: [],
              anomalyIndices: [8],
            },
            {
              label: "Cyanide Concentration(CHNO)",
              data: [1200, 1215, 1230, 1245, 1260, 1275, 1290, 1305, 1320, 1335],
              outlierIndices: [1, 5],
              anomalyIndices: [],
            },
            {
              label: "Phosphorus Concentration(CP)",
              data: [3100, 3125, 3150, 3175, 3200, 3225, 3250, 3275, 3300, 3325],
              outlierIndices: [],
              anomalyIndices: [],
            },
            {
              label: "Sulphur Concentration(CS)",
              data: [2100, 2120, 2140, 2160, 2180, 2200, 2220, 2240, 2260, 2280],
              outlierIndices: [],
              anomalyIndices: [7],
            },
          ],
        };
  
        // Format datasets dynamically
        const formattedDatasets = response.datasets.map((dataset) => {
          return {
            ...dataset,
            pointRadius: dataset.data.map((_, index) =>
              analysisType === "Outlier" && dataset.outlierIndices.includes(index)
                ? 6 // Show red dot for outliers
                : analysisType === "Anomaly" && dataset.anomalyIndices.includes(index)
                ? 6 // Show yellow dot for anomalies
                : 0 // No dots otherwise
            ),
            pointBackgroundColor: dataset.data.map((_, index) =>
              analysisType === "Outlier" && dataset.outlierIndices.includes(index)
                ? "red"
                : analysisType === "Anomaly" && dataset.anomalyIndices.includes(index)
                ? "yellow"
                : "transparent"
            ),
          };
        });
  
        resolve({
          labels: response.labels,
          datasets: formattedDatasets,
        });
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
          "Hydrocarbon concentration(CH)": {
            intensityIndices: [2, 6], // Outliers at index 2 and 6
            predictiveIndices: [4], // Anomaly at index 4
          },
          "Arsenic Concentration(CAS)": {
            intensityIndices: [], // No outliers
            predictiveIndices: [8], // Anomaly at index 8
          },
          "Cyanide Concentration(CHNO)": {
            intensityIndices: [1, 5], // Outliers at index 1 and 5
            predictiveIndices: [], // No anomalies
          },
          "Phosphorus Concentration(CP)": {
            intensityIndices: [], // No outliers
            predictiveIndices: [], // No anomalies
          },
          "Sulphur Concentration(CS)": {
            intensityIndices: [], // No outliers
            predictiveIndices: [7], // Anomaly at index 7
          },
        };
  
        const datasets = [
          {
            label: "Hydrocarbon concentration(CH)",
            data: [2325, 2330, 2338, 2345, 2350, 2360, 2375, 2380, 2390, 2400],
          },
          {
            label: "Arsenic Concentration(CAS)",
            data: [5422, 5450, 4480, 4495, 4510, 4535, 4560, 4590, 4610, 4650],
          },
          {
            label: "Cyanide Concentration(CHNO)",
            data: [1200, 1215, 1230, 1245, 1260, 1275, 1290, 1305, 1320, 1335],
          },
          {
            label: "Phosphorus Concentration(CP)",
            data: [3100, 3125, 3150, 3175, 3200, 3225, 3250, 3275, 3300, 3325],
          },
          {
            label: "Sulphur Concentration(CS)",
            data: [2100, 2120, 2140, 2160, 2180, 2200, 2220, 2240, 2260, 2280],
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
