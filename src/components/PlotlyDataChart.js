import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import { Box } from "@mui/material";

const PlotlyDataChart = ({ bioParamChartData, onRangeChange, title }) => {
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [rate, setRate] = useState(1);
  const [visibleTraces, setVisibleTraces] = useState({});

  const parseDate = (timeString) => {
    if (typeof timeString !== "string") {
      console.error("Invalid time string:", timeString);
      return new Date();
    }
    return new Date(timeString.replace(/\//g, "-"));
  };

  useEffect(() => {
    if (bioParamChartData?.Time?.length > 0) {
      const sortedTimes = bioParamChartData.Time.map(parseDate).sort((a, b) => a - b);
      setSelectedRange([sortedTimes[0], sortedTimes[sortedTimes.length - 1]]);
    }
  }, [bioParamChartData]);

  const handleRangeChange = (range, selectedRate) => {
    setSelectedRange(range.map(parseDate));
    setRate(selectedRate);
    if (onRangeChange) {
      onRangeChange(range);
    }
  };

  const keys = bioParamChartData ? Object.keys(bioParamChartData).filter((key) => key !== "Time") : [];
  let traces = [];

  if (bioParamChartData?.Time?.length > 0) {
    const sortedIndices = bioParamChartData.Time
      .map((time, index) => ({ index, time: parseDate(time) }))
      .sort((a, b) => a.time - b.time);

    const filteredIndices = sortedIndices.filter(
      ({ time }) => time >= selectedRange[0] && time <= selectedRange[1]
    );

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
      visible: visibleTraces[key] ? "legendonly" : true, // Toggle using "legendonly"
    }));
  }

  const layout = {
    xaxis: {
      showticklabels: false,
      title: "",
      showgrid: false,
      zeroline: false,
    },
    yaxis: { title: "Count" },
    legend: { orientation: "h", x: 0.4, y: -0.1, font: { size: 15 }, traceorder: "normal" },
    margin: { t: 50, b: 80, l: 50, r: 50 },
    plot_bgcolor: "#F5F6F6",
  };

  // Handle legend click event
  const handleLegendClick = (event) => {
    const clickedTraceName = event.data[event.curveNumber].name;
    setVisibleTraces((prev) => ({
      ...prev,
      [clickedTraceName]: !prev[clickedTraceName], // Toggle trace visibility
    }));
    return false; // Prevents default Plotly behavior
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
      <Box display="flex" gap={2} ml={2} justifyContent="space-between" padding={2}>
        <HvTypography variant="title2">{title}</HvTypography>
        <DateTimeRangePicker onChange={handleRangeChange} />
      </Box>
      <div style={{ width: "100%", height: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {traces.length > 0 ? (
          <Plot
            config={{ displayModeBar: false }}
            data={traces}
            layout={layout}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
            onClick={handleLegendClick} // Handle legend click
          />
        ) : (
          <div style={{ padding: "1rem", textAlign: "center" }}>No Data To Display</div>
        )}
      </div>
    </HvCard>
  );
};

export default PlotlyDataChart;
