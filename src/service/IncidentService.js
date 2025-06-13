import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/floor`;
const INCIDENT_API_URL = 'https://haproxy.hitachivisualization.com:6443/api/Incidents';

export const acknowledgeAlarm = async (deviceId, timestamp, accessToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/postAcknowledgeAlarm`, {
      device_id: deviceId,
      timestamp: timestamp || new Date().toISOString(),
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return response.data.message;
  } catch (error) {
    console.error('Error in acknowledgeAlarm:', error.message);
    throw new Error(`Acknowledge alarm failed: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data || error.message}`);
  }
};

export const getIncidentBySourceId = async (sourceId, token) => {
  try {
    const response = await axios.get(`${INCIDENT_API_URL}/getbycorrelatedentitysourceid?sourceId=${sourceId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in getIncidentBySourceId:', error.message);
    throw new Error(`Failed to fetch incident: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data || error.message}`);
  }
};

export const getRedisAlarms = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getRedisAlarms`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in getRedisAlarms:', error.message);
    throw new Error(`Failed to fetch Redis alarms: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data || error.message}`);
  }
};

export const subscribeToIncidentData = (onMessage, onError) => {
  const incidentCardURL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_SSE_STREAM_URL}:${process.env.REACT_APP_SSE_STREAM_PORT}/sse/incidentdata`;
  const eventSource = new EventSource(incidentCardURL);

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    } catch (err) {
      console.error("Error parsing SSE incidentdata:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE incidentdata connection error:", err);
    if (onError) onError(err);
    eventSource.close();
  };

  return eventSource;
};

