// Choose the appropriate URL
const Live_stream_url = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_STREAM_IP}:${process.env.REACT_APP_STREAM_PORT}/sse`; 

// Function to get live streaming data for a specific sensor
export const getLiveStreamingDataForSensors = (device_id, callback) => {
  const eventSource = new EventSource(Live_stream_url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Filter data based on the provided device_id
      if (parseInt(data.device_id) === parseInt(device_id)) {
        callback(null, data);
      }
    } catch (err) {
      console.error("Error parsing SSE data:", err);
      callback(err, null);
    }
  };

  eventSource.onerror = (error) => {
    console.error("SSE Error:", error);
    callback(error, null);
    eventSource.close();
  };

  return eventSource;
};

// Function to subscribe to summary card stats
export const subscribeToSummaryCardStats = (onMessage, onError) => {
  const summaryCardURL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_SSE_STREAM_URL}:${process.env.REACT_APP_SSE_STREAM_PORT}/sse/summarycardstats`;
  const eventSource = new EventSource(summaryCardURL);

  eventSource.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      onMessage(parsedData);
    } catch (err) {
      console.error("Error parsing SSE data:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
    if (onError) onError(err);
    eventSource.close();
  };

  return eventSource;
};
