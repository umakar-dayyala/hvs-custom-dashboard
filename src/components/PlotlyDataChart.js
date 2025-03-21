import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { HvCard } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";

const PlotlyDataChart = ({ bioParamChartData ,onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [rate, setRate] = useState(1);

  // Initialize selectedRange when data changes
  useEffect(() => {
    if (bioParamChartData && bioParamChartData.Time && bioParamChartData.Time.length > 0) {
      setSelectedRange([bioParamChartData.Time[0], bioParamChartData.Time[bioParamChartData.Time.length - 1]]);
    }
  }, [bioParamChartData]);

  const handleRangeChange = (range, selectedRate) => {
    setSelectedRange(range);
    setRate(selectedRate);
    if (onRangeChange) {
      onRangeChange(range);  
    }
  };

  const keys = bioParamChartData ? Object.keys(bioParamChartData).filter((key) => key !== "Time") : [];

  // Handle no data gracefully
  let traces = [];
  if (bioParamChartData && bioParamChartData.Time && bioParamChartData.Time.length > 0) {
    const filteredIndices = bioParamChartData.Time
      .map((time, index) => ({ index, time: new Date(time) }))
      .filter(({ time }) => time >= new Date(selectedRange[0]) && time <= new Date(selectedRange[1]));

    const filteredData = {
      Time: filteredIndices.map(({ index }) => bioParamChartData.Time[index]),
      ...keys.reduce((acc, key) => {
        acc[key] = filteredIndices.map(({ index }) => bioParamChartData[key][index]);
        return acc;
      }, {}),
    };

    const colors = ["blue", "green", "orange", "red", "purple", "brown", "cyan"];

    traces = keys.map((key, index) => ({
      x: filteredData.Time.filter((_, i) => i % rate === 0),
      y: filteredData[key].filter((_, i) => i % rate === 0),
      mode: "lines+markers",
      name: key,
      line: { color: colors[index % colors.length] },
      marker: { size: 6 },
    }));
  }

  const layout = {
    xaxis: { title: "Time", tickangle: 45 },
    yaxis: { title: "Count" },
    legend: {
      orientation: "h",
      x: 0.3,
      y: -0.5,
      font: { size: 15 },
      traceorder: "normal",
    },
    margin: { t: 50, b: 80, l: 50, r: 50 },
    plot_bgcolor: "#F5F6F6",
  };

  return (
    <HvCard
      bgcolor="white"
      height="auto"
      statusColor="red"
      style={{
        borderRadius: "0px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      {/* Always Show Date Picker */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1rem" }}>
        <DateTimeRangePicker onChange={handleRangeChange} />
      </div>

      {/* Show Chart or "No Data" Message */}
      <div style={{ width: "100%", height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {traces.length > 0 ? (
          <Plot
            config={{ displayModeBar: false }}
            data={traces}
            layout={layout}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div style={{ padding: "1rem", textAlign: "center" }}>No Data To Display</div>
        )}
      </div>
    </HvCard>
  );
};

export default PlotlyDataChart;
