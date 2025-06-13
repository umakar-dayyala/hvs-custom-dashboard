//const Live_stream_url = `http://10.131.19.202:4000/sse`; // SSE endpoint
const Live_stream_url = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_STREAM_IP}:${process.env.REACT_APP_STREAM_PORT}/sse`; 
export const getLiveStreamingDataForSensors = (device_id, callback) => {

    // console.log("device_id web socket: ", device_id);
    const eventSource = new EventSource(Live_stream_url);

    // Handling incoming SSE messages
    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
          

            // Filter data based on the provided device_id
            if (parseInt(data.device_id) === parseInt(device_id)) {
                callback(null, data); // Pass only matching data to the callback
            }
        } catch (err) {
            console.error("Error parsing SSE data:" + err);
            callback(err, null); // Pass error to the callback if any
        }
    };

    // Handling SSE error
    eventSource.onerror = (error) => {
        console.error("SSE Error:" + error);
        callback(error, null); // Pass error to callback
        eventSource.close();
    };

    return eventSource; // Return EventSource so the caller can close it when done
};

// WebSocket.js or service/WebSocket.js
// export const getLiveStreamingDataForSensors = (deviceId, callback) => {
//     // simulate an EventSource-like interface
//     const interval = setInterval(() => {
//       const dummyPacket = {
//         parametersData: [
//           {
//             lastfetched: {
//               time: new Date().toLocaleString(),
//             },
//             kpiData: {
//               "Air Temperature": (20 + Math.random() * 15).toFixed(1),
//               "Relative Humidity (%)": (40 + Math.random() * 60).toFixed(1),
//               "Cumulative Rain (mm)": (Math.random() * 10).toFixed(2),
//               Pressure: (990 + Math.random() * 50).toFixed(1),
//               "Solar radiation": (Math.random() * 1000).toFixed(0),
//             },
//             "Direction Data": [
//               { direction: "N", speed: Math.floor(Math.random() * 100) },
//               { direction: "NE", speed: 0 },
//               { direction: "E", speed: 0 },
//               { direction: "SE", speed: 0 },
//               { direction: "S", speed: 0 },
//               { direction: "SW", speed: 0 },
//               { direction: "W", speed: 0 },
//               { direction: "NW", speed: 0 },
//             ],
//           },
//         ],
//       };
  
//       // simulate callback as in SSE
//       callback(null, dummyPacket);
//     }, 5000);
  
//     // return a close function to mimic EventSource.close()
//     return {
//       close: () => clearInterval(interval),
//     };
//   };
  
