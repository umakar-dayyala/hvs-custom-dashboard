import React, { useState } from "react";
import Plot from "react-plotly.js";
import { HvCard } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";

const dummyData = {
  Time: [
    "2025-03-17T15:32:15.497Z",
    "2025-03-017T15:32:17.435Z",
    "2025-03-17T15:32:18.775Z",
    "2025-03-17T15:32:19.733Z",
    "2025-03-17T15:32:20.694Z",
    "2025-02-17T15:32:21.954Z",
  ],
  "Small Particle Count": [2, 3, 1, 5, 4, 6],
  "Large Particle Count": [5, 8, 6, 9, 7, 10],
  "Large Bio Count": [10, 12, 14, 15, 16, 18],
  "Small Bio Count": [22, 25, 27, 26, 28, 30],
};

export default function PlotlyChart() {
  const [selectedRange, setSelectedRange] = useState([
    dummyData.Time[0],
    dummyData.Time[dummyData.Time.length - 1],
  ]);
  const [rate, setRate] = useState(1);

  const handleRangeChange = (range, selectedRate) => {
    setSelectedRange(range);
    setRate(selectedRate);
  };

  const filteredIndices = dummyData.Time
    .map((time, index) => ({ index, time: new Date(time) }))
    .filter(({ time }) =>
      time >= new Date(selectedRange[0]) && time <= new Date(selectedRange[1])
    );

  const filteredData = {
    Time: filteredIndices.map(({ index }) => dummyData.Time[index]),
    "Small Particle Count": filteredIndices.map(({ index }) => dummyData["Small Particle Count"][index]),
    "Large Particle Count": filteredIndices.map(({ index }) => dummyData["Large Particle Count"][index]),
    "Large Bio Count": filteredIndices.map(({ index }) => dummyData["Large Bio Count"][index]),
    "Small Bio Count": filteredIndices.map(({ index }) => dummyData["Small Bio Count"][index]),
  };

  const traces = Object.keys(filteredData)
    .filter((key) => key !== "Time")
    .map((key, index) => ({
      x: filteredData.Time.filter((_, i) => i % rate === 0),
      y: filteredData[key].filter((_, i) => i % rate === 0),
      mode: "lines+markers", // Adds dots at each data point
      name: key,
      line: { color: ["blue", "green", "orange", "red"][index] },
      marker: { size: 6 }, // Adjust dot size if needed
    }));

  const layout = {
    
    title: "Particle & Bio Count Over Time",
    xaxis: { title: "Time", tickangle: 45 },
    yaxis: { title: "Count" },
    legend: { orientation: "h", x: 0.5, xanchor: "center", y: 1.3,
      font: { size: 18 }, // Increase font size of legend,
     },
    margin: { b: 80 },
  };

  return (
    <HvCard bgcolor="white" height="auto" statusColor="red">
      <DateTimeRangePicker onChange={handleRangeChange} />
      <div style={{ width: "100%" }}>
        <Plot
          config={{ displayModeBar: false }}
          data={traces}
          layout={layout}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </HvCard>
  );
}
