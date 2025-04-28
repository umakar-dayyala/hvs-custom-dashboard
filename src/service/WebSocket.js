//const Live_stream_url = `http://10.131.19.202:4000/sse`; // SSE endpoint
const Live_stream_url = `http://${process.env.REACT_APP_STREAM_IP}:${process.env.REACT_APP_STREAM_PORT}/sse`; 
export const getLiveStreamingDataForSensors = (device_id, callback) => {

    console.log("device_id web socket: ", device_id);
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
