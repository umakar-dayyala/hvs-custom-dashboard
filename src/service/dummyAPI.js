import axios from "axios";

// Get API Base URL from environment variables
//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = 'http://localhost:3002/api';

// Fetch filter options from API
export const fetchFilterOptions = async () => {
    // Simulate an API call for filter options
    try {
        const response = await axios.get(`${API_BASE_URL}/locationData`);
        return response.data;
    } catch (error) {
        console('Error: ' + (error.response?.data?.message || error.message || "Error fetching location data"));
        throw new Error(error.response?.data?.message || "Error fetching location data");
    }
};

// Fetch summary data from API
export const fetchSummaryData = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/summary`);
      alert(response.data);
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || "Error fetching summary data");
  }
};

export const statusParamData = async () => {
  // Simulate an API call with filters
  return new Promise((resolve) => {
    resolve({
      cards: [
        { label: 'System Alert State', value: '' },
        { label: 'Algo Alarm Status', value: '' },
        { label: 'Diagnostic Fault', value: ''},
      ]
    });
  });
};

export const bioParamData = async () => {
    // Simulate an API call with filters
    return new Promise((resolve) => {
        resolve({
          cards: [
            { label: 'Small Bio', value: '1325' },
            { label: 'Large Bio', value: '5422' },
            { label: 'Small Particle', value: '4598'},
            { label: 'Large Particle', value: '3453' },
            { label: 'Particle Size', value: '9898' },
          ]
        });
    });
  };

  export const healthParamData = async () => {
    // Simulate an API call with filters
    return new Promise((resolve) => {
        resolve({
          cards: [
            { label: 'pressure', value: '150' },
            { label: 'Laser Power', value: '12' },
            { label: 'Laser Current', value: '42'},
            { label: 'Background Light monitor', value: '10' },
            { label: 'Low Battery', value: '05' },
          ]
        });
    });
  };

  export const summeryDashboardData = async (filters) => {
    return new Promise((resolve) => {
        resolve({
          cards: [
            { label: 'Total Sensor', value: '150' },
            { label: 'Active Sensor', value: '149/150' },
            { label: 'Sensor Health', value: 'Good', bg: 'green.100' },
            { label: 'Received Alerts', value: '10' },
            { label: 'Incident Tracked', value: '05' },
          ],
          dashboardZones: [
            {
              zoneNumber: 1,
              locations: 40,
              sensors: 150,
              columns: ['No', 'Location', 'Sensor', 'Status', 'Received Alert', 'Incident'],
              data: [
                [1, 'Inside AHU room no. L-49', 'Link', 'AAM (Air Activity Monitor)', 'Not Found', 'Not Found'],
                [2, 'Inside AHU room no. L-50', 'Link', 'AAM (Air Activity Monitor)', 'Not Found', 'Not Found'],
              ],
            },
            {
              zoneNumber: 2,
              locations: 30,
              sensors: 120,
              columns: ['No', 'Location', 'Sensor', 'Status', 'Received Alert', 'Incident'],
              data: [
                [1, 'Inside AHU room no. L-51', 'Link', 'AAM (Air Activity Monitor)', 'Not Found', 'Not Found'],
              ],
            },
          ],
          alertData: {
            columns: ['Time', 'Alert Type', 'Severity', 'Details'],
            data: [
              ['10:00 AM', 'Sensor Failure', 'Critical', 'Sensor #12 has failed.'],
              ['10:30 AM', 'Temperature Spike', 'High', 'Temperature exceeded threshold in Zone 3.'],
            ],
          },
        });
    });
  };
    
  export const fetchFilterOptions_1 = async () => {
    // Simulate an API call for filter options
    return new Promise((resolve) => {
        resolve({
          locations: ['location-1', 'Slocation-2', 'location-3'],
          sensors: ['Sensor-1', 'Sensor-2', 'Sensor-3'],
          incidents: ['Incident-1', 'Incident-2', 'Incident-3'],
        });
    });
  };
  