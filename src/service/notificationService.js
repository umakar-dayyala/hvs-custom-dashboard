// services/notificationService.js

export const fetchDeviceNotifications = async (deviceId) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://localhost:5000/api/floor/getRedisCache?device_ids=${deviceId}`
    );

    const json = await res.json();

    if (Array.isArray(json?.devices)) {
      const deviceData = json.devices.find(d => d.device_id === deviceId);
      return deviceData?.notifications || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
