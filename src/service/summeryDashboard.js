import axios from "axios";


// Get API Base URL from environment variables
const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/summary`

export const summeryDashboardCardsData = async () => {
  try {
    const url = `${API_BASE_URL}/getCardData`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;
    console.log("API Data :: :"+ JSON.stringify(jsonData));
    
    return jsonData;
  } catch (error) {
    //alert("Error fetching data from API:"+JSON.stringify(error));
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const all_floor = async () => {
  try {
    const url = `${API_BASE_URL}/floors`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;
    return jsonData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const getFloorZone = async (floor) => {
  try {
    const url = `${API_BASE_URL}/zones?${floor}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;
    console.log("floor API Data:", jsonData.data);
    return jsonData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const getLocationAndAll = async (floor_zone) => {
  try {
    const url = `${API_BASE_URL}/selectorsparam?${floor_zone}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;
    console.log("location API Data:", jsonData.data);
    return jsonData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export const tableFloors = async (floor) => {
  try {
    const url = `${API_BASE_URL}/floordatasummarytable?param_floor=${floor}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonData = response.data;
    return jsonData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};


export const fetchFilterOptions = async () => {
  try {
    // Call all APIs in parallel
    const [locationDataResponse, sensorTypesResponse, sensorStatusResponse] =
      await Promise.all([
        axios.get(`${API_BASE_URL}/locationData`),
        axios.get(`${API_BASE_URL}/sensorTypes`),
        axios.get(`${API_BASE_URL}/sensorStatus`),
      ]);

    // Extract data from responses
    const location = locationDataResponse.data;
    const sensorTypes = sensorTypesResponse.data.sensor_types;
    const sensorStatus = sensorStatusResponse.data.sensor_status;

    // Combine responses into a single object
    const combinedData = {
      location,
      sensorTypes,
      sensorStatus,
    };

    console.log("Combined API Data:", combinedData);
    alert(JSON.stringify(combinedData)); // Debugging

    return combinedData;
  } catch (error) {
    console.error(
      "Error fetching filter options:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error fetching filter options"
    );
  }
};

/*
export const summeryDashboardCardsData = async () => {
    try {
       //const response = await axios.get(`${API_BASE_URL}/summary`);
        //const response = await axios.get('http://localhost:3002/api/summary');

        const response =
        {
          "data": [
            {
              "totalSensors": 4,
              "chemicalAlerts": 0,
              "biologicalAlerts": 0,
              "radiologicalAlerts": 0,              
              "activeSensors": 4,
              "inactiveSensors": 0,
              "sensorHealth": "0/4",
              "receivedAlerts": 0,
              "incidentTracked": 0
            }
          ]
        }

        //return response.data;
        return response;
    } catch (error) {
         throw new Error(error.response?.data?.message || "Error fetching summary data");
    }
};
*/

// Fetch summary data from API
export const fetchSummaryData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary`);
    alert(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching summary data"
    );
  }
};

export const statusParamData = async () => {
  // Simulate an API call with filters
  return new Promise((resolve) => {
    resolve({
      cards: [
        { label: "System Alert State", value: "" },
        { label: "Algo Alarm Status", value: "" },
        { label: "Diagnostic Fault", value: "" },
      ],
    });
  });
};

export const bioParamData = async () => {
  // Simulate an API call with filters
  return new Promise((resolve) => {
    resolve({
      cards: [
        { label: "Small Bio", value: "1325" },
        { label: "Large Bio", value: "5422" },
        { label: "Small Particle", value: "4598" },
        { label: "Large Particle", value: "3453" },
        { label: "Particle Size", value: "9898" },
      ],
    });
  });
};

export const healthParamData = async () => {
  // Simulate an API call with filters
  return new Promise((resolve) => {
    resolve({
      cards: [
        { label: "pressure", value: "150" },
        { label: "Laser Power", value: "12" },
        { label: "Laser Current", value: "42" },
        { label: "Background Light monitor", value: "10" },
        { label: "Low Battery", value: "05" },
      ],
    });
  });
};

export const summeryDashboardData = async (filters) => {

  console.log("Filters:", filters); 
  const transformedFilters = {
    param_floor: filters.selectedFloor || "ALL",
    param_zone: filters.selectedZone || "ALL",
    param_location: filters.selectedLocation || "ALL",
    param_sensor_type: filters.selectedSensorType || "ALL",
    param_sensor_name: filters.selectedSensor || "ALL",
    param_sensor_status: filters.selectedSensorStatus || "ALL",
  };

  const queryString = Object.keys(transformedFilters)
    .map(key => `${key}=${transformedFilters[key]}`)
    .join("&");

  console.log("Transformed Filters:", queryString);

  try {
    const url = `${API_BASE_URL}/getSummaryTable?${queryString}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonData = response.data;
    console.log("floor API Data:", jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
  
  /*return new Promise((resolve) => {
    resolve({
      floors: [
        // Changed from 'dashboardZones' to 'floors'
        {
          floorName: "UGF", // Changed from 'floor' to 'floorName'
          zones: [
            {
              zoneNumber: "ZONE 1",
              locations: 1,
              sensors: 1,
              activeSensors: 1,
              inactiveSensors: 0,
              cbrnAlarms: 0,
              healthAlerts: 0,
              openIncidents: 0,
              columns: [
                "No",
                "Location",
                "Sensor",
                "Status",
                "Alarm",
                "Health Alert",
                "Open Incident",
              ],
              data: [
                [
                  1,
                  "At Makar Dwar (Left side)",
                  "Radiological AGM-3",
                  "Active",
                  "No alarm",
                  "Healthy",
                  "0",
                ],
              ],
            },
            {
              zoneNumber: "ZONE 2 (PMO)",
              locations: 1,
              sensors: 1,
              activeSensors: 1,
              inactiveSensors: 0,
              cbrnAlarms: 0,
              healthAlerts: 0,
              openIncidents: 0,
              columns: [
                "No",
                "Location",
                "Sensor",
                "Status",
                "Alarm",
                "Health Alert",
                "Open Incident",
              ],
              data: [
                [
                  1,
                  "Zone-2 Corridor",
                  "Biological IBAC-1",
                  "Active",
                  "No alarm",
                  "Healthy",
                  "0",
                ],
              ],
            },
            {
              zoneNumber: "ZONE-3",
              locations: 1,
              sensors: 1,
              activeSensors: 1,
              inactiveSensors: 0,
              cbrnAlarms: 0,
              healthAlerts: 0,
              openIncidents: 0,
              columns: [
                "No",
                "Location",
                "Sensor",
                "Status",
                "Alarm",
                "Health Alert",
                "Open Incident",
              ],
              data: [
                [
                  1,
                  "At Hans Dwar (Left side)",
                  "Radiological AGM-4",
                  "Active",
                  "No alarm",
                  "Healthy",
                  "0",
                ],
              ],
            },
          ],
        },
        {
          floorName: "Terrace", // Changed from 'floor' to 'floorName'
          zones: [
            {
              zoneNumber: "LS Chamber Zone",
              locations: 1,
              sensors: 1,
              activeSensors: 1,
              inactiveSensors: 0,
              cbrnAlarms: 0,
              healthAlerts: 0,
              openIncidents: 0,
              columns: [
                "No",
                "Location",
                "Sensor",
                "Status",
                "Alarm",
                "Health Alert",
                "Open Incident",
              ],
              data: [
                [
                  1,
                  "LS AHU Room Wall (Air Inlet)",
                  "Biological IBAC-2",
                  "Active",
                  "No alarm",
                  "Healthy",
                  "0",
                ],
              ],
            },
          ],
        },
      ],
    });
  });
  */
};

export const fetchFilterOptions_1 = async () => {
  // Simulate an API call for filter options
  return new Promise((resolve) => {
    resolve({
      locations: ["location-1", "Slocation-2", "location-3"],
      sensors: ["Sensor-1", "Sensor-2", "Sensor-3"],
      incidents: ["Incident-1", "Incident-2", "Incident-3"],
    });
  });
};
