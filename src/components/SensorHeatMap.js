import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

// Sample static data
const sensorsData = [
  { "zone": "1", "location": "At Makar Dwar (Left side)", "sensor": "AGM", "status": "Active" },
  { "zone": "1", "location": "At Makar Dwar (Left side)", "sensor": "PRM", "status": "Inactive" },
  { "zone": "1", "location": "Zone-1 Corridor", "sensor": "FC1", "status": "Active" },
  { "zone": "1", "location": "Zone-2 Corridor", "sensor": "FC2", "status": "Active" },
  { "zone": "1", "location": "Zone-2 Corridor", "sensor": "FB1", "status": "Inactive" },
  { "zone": "2 (PMO)", "location": "At Hans Dwar (Right side)", "sensor": "PRM", "status": "Active" },
  { "zone": "2 (PMO)", "location": "At Hans Dwar (Right side)", "sensor": "FC2", "status": "Inactive" },
  { "zone": "2 (PMO)", "location": "At Hans Dwar (Left side)", "sensor": "AGM", "status": "Active" },
  { "zone": "3", "location": "At Garuda Dwar (Right side)", "sensor": "PRM", "status": "Inactive" },
  { "zone": "3", "location": "At Garuda Dwar (Left side)", "sensor": "FC1", "status": "Active" },
  { "zone": "4", "location": "Zone-4 Corridor", "sensor": "FC1", "status": "Active" },
  { "zone": "5", "location": "At Shardul Dwar (Left side)", "sensor": "PRM", "status": "Inactive" },
  { "zone": "5", "location": "Zone-5 Corridor", "sensor": "FC1", "status": "Inactive" },
  { "zone": "6", "location": "Zone-6 Corridor", "sensor": "FC1", "status": "Active" },
  { "zone": "Lok Sabha Chamber", "location": "Inside Lok Sabha Chamber", "sensor": "FC1", "status": "Active" },
  { "zone": "Rajya Sabha Chamber", "location": "Inside Rajya Sabha Chamber", "sensor": "FC2", "status": "Inactive" }
];

// Group sensors by zone, then by location
const groupedByZone = sensorsData.reduce((acc, { zone, location, sensor, status }) => {
  if (!acc[zone]) acc[zone] = {};
  if (!acc[zone][location]) acc[zone][location] = [];
  acc[zone][location].push({ sensor, status });
  return acc;
}, {});

// Get color based on sensor status
const getStatusColor = (status) => (status === "Active" ? "#4CAF50" : "#E30613");

const SensorHeatMap = () => {
  const zones = Object.entries(groupedByZone);
  const zonesPerRow = Math.ceil(zones.length / 3); // Split into 3 rows

  // Split zones into chunks for rows
  const chunkedZones = zones.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / zonesPerRow);
    if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      {/* Rows */}
      {chunkedZones.map((row, rowIndex) => (
        <Box key={rowIndex} display="flex" justifyContent="center" gap="20px" flexWrap="wrap">
          {row.map(([zone, locations]) => (
            <Card key={zone} sx={{ minWidth: 300, maxWidth: 350, boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 2 }}>
                  Zone {zone}
                </Typography>
                <Box display="flex" flexDirection="column" gap="10px">
                  {/* Locations */}
                  {Object.entries(locations).map(([location, sensors]) => (
                    <Card key={location} sx={{ background: "#f5f5f5", borderRadius: 2, boxShadow: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                          {location}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap="5px" justifyContent="center">
                          {/* Sensors */}
                          {sensors.map(({ sensor, status }, index) => (
                            <Box
                              key={index}
                              bgcolor={getStatusColor(status)}
                              color="#fff"
                              borderRadius="4px"
                              p="5px 10px"
                              minWidth="60px"
                              textAlign="center"
                              boxShadow="1px 1px 5px rgba(0, 0, 0, 0.2)"
                            >
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                {sensor}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default SensorHeatMap;
