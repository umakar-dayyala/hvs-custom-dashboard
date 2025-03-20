import React, { useState } from "react";
import Plot from "react-plotly.js";
import { HvCard } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import { Paper } from "@mui/material";
import { background, border } from "@chakra-ui/react";
import { legendClasses } from "@mui/x-charts";


const PlotlyDataChart = ({ data }) => {
 
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
   
    xaxis: { title: "Time", tickangle: 45 },
    yaxis: { title: "Count" },
    legend: { 
      orientation: "h", // Vertical stacking
      x: 0.3, // Position it next to the chart
      y: -0.5, // Center vertically
      
      font: { size: 15 }, // Increase font size
      traceorder: "normal", // Keep order intact
      
    },
    margin: { t: 50, b: 80, l: 50, r: 50 }, // Increase right margin for legend space
    plot_bgcolor: "#F5F6F6",  // Set the chart background to gray
   
    
  
  };
  
  return (
    <HvCard bgcolor="white" height="auto" statusColor="red" style={{borderRadius: "0px",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
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
