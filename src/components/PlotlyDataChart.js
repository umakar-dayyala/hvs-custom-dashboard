import React, { useState } from "react";
import Plot from "react-plotly.js";
import { HvCard } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";


const PlotlyDataChart = ({ data, title }) => {
 
  const keys = Object.keys(data).filter((key) => key !== "Time");
  const [selectedRange, setSelectedRange] = useState([
    data.Time[0],
    data.Time[data.Time.length - 1],
  ]);
  const [rate, setRate] = useState(1);

  const handleRangeChange = (range, selectedRate) => {
    setSelectedRange(range);
    setRate(selectedRate);
  };

  const filteredIndices = data.Time
    .map((time, index) => ({ index, time: new Date(time) }))
    .filter(({ time }) => time >= new Date(selectedRange[0]) && time <= new Date(selectedRange[1]));

  const filteredData = {
    Time: filteredIndices.map(({ index }) => data.Time[index]),
    ...keys.reduce((acc, key) => {
      acc[key] = filteredIndices.map(({ index }) => data[key][index]);
      return acc;
    }, {}),
  };

  const colors = ["blue", "green", "orange", "red", "purple", "brown", "cyan"];
  
  const traces = keys.map((key, index) => ({
    x: filteredData.Time.filter((_, i) => i % rate === 0),
    y: filteredData[key].filter((_, i) => i % rate === 0),
    mode: "lines+markers",
    name: key,
    line: { color: colors[index % colors.length] },
    marker: { size: 6 },
  }));

  const layout = {
    title: { 
      text: title || "Data Visualization", 
      font: { size: 20 } 
    },
    xaxis: { title: "Time", tickangle: 45 },
    yaxis: { title: "Count" },
    legend: { 
      orientation: "h", 
      x: 0.5, 
      xanchor: "center", 
      y: 1.1, 
      font: { size: 18 } 
    },
    margin: { t: 100, b: 80 }, // Increase top margin for title visibility
  };
  

  return (
    <HvCard bgcolor="white" height="auto" statusColor="red">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem",paddingLeft:"1rem" }}>
      <DateTimeRangePicker onChange={handleRangeChange} />
      {/* <QuickTimeSelector/> */}
      </div>
      <div style={{ width: "100%" }}>
        <Plot config={{ displayModeBar: false }} data={traces} layout={layout} useResizeHandler style={{ width: "100%", height: "100%" }} />
      </div>
    </HvCard>
  );
};

export default PlotlyDataChart;
