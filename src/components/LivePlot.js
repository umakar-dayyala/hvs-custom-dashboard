import React, { useEffect, useState, useRef } from "react";
import Plot from "react-plotly.js";

const LivePlot = ({ data }) => {
  const [plotData, setPlotData] = useState({});
  const dataRef = useRef(data); // to always access latest data

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      

      setPlotData((prevData) => {
        const updatedData = { ...prevData };

        Object.entries(dataRef.current).forEach(([label, value]) => {
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue)) {
            if (!updatedData[label]) updatedData[label] = [];
            updatedData[label] = [
              ...updatedData[label].slice(-20),
              { x: timestamp, y: numericValue },
            ];
          }
        });

        return updatedData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // only runs once

  const traces = Object.entries(plotData).map(([label, points]) => {
    const latestValue = points.length > 0 ? points[points.length - 1].y : "";
    return {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      type: "scatter",
      mode: "lines+markers",
      name: `${label} (${latestValue})`, // append latest value to label
    };
  });
  

  return (
    <div >
      {traces.length > 0 ? (
        <Plot
        data={traces}
        layout={{
          width: 550,
          height: 400,
          title: "Chemical Parameters Live",
          xaxis: { title: "Time" },
          yaxis: { title: "Value" },
          legend: {
            orientation: "h",
            x: 0,
            y: 2,
            itemwidth: 10, // width allocated for each legend item
            traceorder: "normal"
          }
        }}
        config={{
          responsive: true,
          displayModeBar: false
        }}
      />
      
      
      ) : (
        <p>No data to plot yet...</p>
      )}
    </div>
  );
};

export default LivePlot;
