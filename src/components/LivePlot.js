import React, { useEffect, useState, useRef } from "react";
import Plot from "react-plotly.js";

const LivePlot = ({ data }) => {
  const [plotData, setPlotData] = useState({});
  const [visibilityMap, setVisibilityMap] = useState({});
  const dataRef = useRef(data);

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Periodically update the plot data
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setPlotData((prevData) => {
        const updated = { ...prevData };

        for (const [label, value] of Object.entries(dataRef.current)) {
          const y = parseFloat(value);
          if (!isNaN(y)) {
            const series = updated[label] || [];
            updated[label] = [...series.slice(-19), { x: timestamp, y }];
          }
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sanitize label for uid (no spaces, parentheses, etc.)
  const sanitizeLabel = (label) => label.replace(/[^\w-]/g, "_");

  const traces = Object.entries(plotData).map(([label, points]) => {
    const latestY = points.at(-1)?.y ?? "";
    const sanitizedUid = sanitizeLabel(label);
    const isVisible = visibilityMap[label];
    return {
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      type: "scatter",
      mode: "lines+markers",
      name: `${label} : ${latestY}`,
      uid: sanitizedUid,
      visible: isVisible === false ? "legendonly" : true,
      customdata: Array(points.length).fill(label), // Include label in every point
    };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {traces.length ? (
        <Plot
          data={traces}
          layout={{
            xaxis: { title: "Time", showticklabels: false },
            yaxis: { title: "Value" },
            showlegend: true,
            legend: {
              orientation: "h",
              x: 0,
              y: -0.1,
              xanchor: "left",
              yanchor: "top",
              traceorder: "normal",
              tracegroupgap: 10,
              font: {
                size: 18,
                color: "#000",
              },
            },
            autosize: true,
            margin: { t: 50, r: 30, b: 40, l: 50 },
          }}
          config={{
            displayModeBar: false,
            useResizeHandler: true,
          }}
          style={{ width: "100%", height: "100%" }}
          onLegendClick={(event) => {
            const index = event.curveNumber;
            const label = traces[index].customdata[0]; // Use customdata to get the label
            const newVisibility =
              traces[index].visible === true ? "legendonly" : true;

            setVisibilityMap((prev) => ({
              ...prev,
              [label]: newVisibility !== "legendonly",
            }));

            return false; // Prevent default toggle behavior
          }}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default LivePlot;
