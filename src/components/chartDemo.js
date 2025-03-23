import { HvCard } from "@hitachivantara/uikit-react-core";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import AnomalyChart from "./AnomalyChart";
import AnomalyChartDemo from "./AnomalyChartDemo";

// Generate dummy data
const generateDummyData = () => {
  const now = new Date();
  return Array.from({ length: 50 }, (_, i) => {
    const time = new Date(now - i * 60 * 1000).toISOString(); // 1-minute interval
    return {
      Time: time,
      "DET 1 Count": Math.floor(Math.random() * 2000 + 1000),
      "DET 2 Count": Math.floor(Math.random() * 2000 + 1000),
    };
  }).reverse(); // Keep chronological order
};

const ChartDemo = () => {
  const rawData = generateDummyData();
  const [filteredData, setFilteredData] = useState(rawData);
  const [timeRange, setTimeRange] = useState("last 10 mins");

  useEffect(() => {
    filterData(timeRange);
  }, [timeRange]);

  const filterData = (range) => {
    const now = new Date();
    let filtered;

    switch (range) {
      case "last 5 mins":
        filtered = rawData.filter((d) => now - new Date(d.Time) <= 5 * 60 * 1000);
        break;
      case "last 10 mins":
        filtered = rawData.filter((d) => now - new Date(d.Time) <= 10 * 60 * 1000);
        break;
      case "last week":
        filtered = rawData.filter((d) => now - new Date(d.Time) <= 7 * 24 * 60 * 60 * 1000);
        break;
      case "last month":
        filtered = rawData.filter((d) => now - new Date(d.Time) <= 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        filtered = rawData;
    }

    setFilteredData(filtered);
  };

  return (
    <Box>
    <HvCard>
    <div style={{ width: "100%", height: "100%",backgroundColor:"white" }}>
    
      <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange} style={{  height:"30px",width:"200px"}}>
        <option value="last 5 mins">Last 5 Minutes</option>
        <option value="last 10 mins">Last 10 Minutes</option>
        <option value="last week">Last Week</option>
        <option value="last month">Last Month</option>
      </select>
      

      <Plot
      config={{displayModeBar: false}}
        data={[
          {
            x: filteredData.map((d) => d.Time),
            y: filteredData.map((d) => d["DET 1 Count"]),
            type: "scatter",
            mode: "lines+markers",
            name: "DET 1 Count",
          },
          {
            x: filteredData.map((d) => d.Time),
            y: filteredData.map((d) => d["DET 2 Count"]),
            type: "scatter",
            mode: "lines+markers",
            name: "DET 2 Count",
          },
        ]}
        layout={{
          title: "Sensor Data Over Time",
          xaxis: { title: "Time" },
          yaxis: { title: "Count" },
          autosize: true, // Enables auto-resizing
        }}
        style={{ width: "100%", height: "100%" }} // Ensures full width
        useResizeHandler={true} // Allows responsive resizing
      />
    </div>
    </HvCard>
    <AnomalyChartDemo />
    </Box>
  );
};

export default ChartDemo;
