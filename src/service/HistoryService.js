export const getSensorEventHistory = async (filters) => {
    // Simulate filter logic
    const mockData = [
      {
        deviceId: "001",
        sensorType: "Radiation",
        status: "Active",
        timestamp: "2025-04-20 10:15:00",
      },
      {
        deviceId: "002",
        sensorType: "Chemical",
        status: "Inactive",
        timestamp: "2025-04-20 11:45:00",
      },
      {
        deviceId: "003",
        sensorType: "Biological",
        status: "Active",
        timestamp: "2025-04-19 09:05:00",
      },
      {
        deviceId: "004",
        sensorType: "Radiation",
        status: "Faulty",
        timestamp: "2025-04-18 14:20:00",
      },
      {
        deviceId: "005",
        sensorType: "Chemical",
        status: "Active",
        timestamp: "2025-04-17 13:33:00",
      },
      {
        deviceId: "006",
        sensorType: "Biological",
        status: "Inactive",
        timestamp: "2025-04-16 08:50:00",
      },
      {
        deviceId: "007",
        sensorType: "Radiation",
        status: "Active",
        timestamp: "2025-04-15 17:10:00",
      },
      {
        deviceId: "008",
        sensorType: "Chemical",
        status: "Active",
        timestamp: "2025-04-14 12:25:00",
      },
      {
        deviceId: "009",
        sensorType: "Biological",
        status: "Faulty",
        timestamp: "2025-04-13 06:40:00",
      },
      {
        deviceId: "010",
        sensorType: "Radiation",
        status: "Inactive",
        timestamp: "2025-04-12 20:30:00",
      },
    ];
  
    // Optional filtering
    if (filters?.deviceId) {
      return mockData.filter((item) =>
        item.deviceId.toLowerCase().includes(filters.deviceId.toLowerCase())
      );
    }
  
    if (filters?.date) {
      return mockData.filter((item) =>
        item.timestamp.startsWith(filters.date)
      );
    }
  
    return mockData;
  };
  