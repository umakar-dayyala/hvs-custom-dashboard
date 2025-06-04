// apiService.js
const API_BASE_URL = 'https://api.hvsapp.com';
const FLOOR_API_URL = 'http://172.16.95.12:31000/api/floor';

export const authenticateUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Added for compatibility
      },
      body: JSON.stringify({
        username: 'marco_marco@hitachivisualization.com',
        password: 'Vishal12345',
        domain: 'marco',
        scope: 'web',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (data.ok && data.data?.access_token) {
      return data.data.access_token;
    } else {
      throw new Error('Invalid authentication response: Missing access token');
    }
  } catch (error) {
    console.error('Error in authenticateUser:', error.message);
    throw error;
  }
};

export const acknowledgeAlarm = async (deviceId, timestamp, accessToken) => {
  try {
    const response = await fetch(`${FLOOR_API_URL}/postAcknowledgeAlarm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Added for compatibility
      },
      body: JSON.stringify({
        device_id: deviceId,
        timestamp: timestamp || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Acknowledge alarm failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error in acknowledgeAlarm:', error.message);
    throw error;
  }
};