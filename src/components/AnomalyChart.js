import React, { useEffect, useState } from "react";
import { Select, MenuItem, Box } from "@mui/material";
import Plot from "react-plotly.js";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import dayjs from "dayjs";
import "../css/Anomaly.css";

const AnomalyChart = ({ anomalyChartData }) => {
  const [selectedDataset, setSelectedDataset] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedRange, setSelectedRange] = useState([dayjs().subtract(5, "minute"), dayjs()]);

  const isValidData =
    anomalyChartData &&
    Array.isArray(anomalyChartData.datasets) &&
    anomalyChartData.datasets.length > 0;

  useEffect(() => {
    if (isValidData) {
      setSelectedDataset(anomalyChartData.datasets[0].label);
      setFilteredData(anomalyChartData);
    }
  }, [anomalyChartData]);

  useEffect(() => {
    if (selectedRange && isValidData) {
      filterData(selectedRange);
    }
  }, [selectedRange, anomalyChartData]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  const handleDateRangeChange = (range) => {
    setSelectedRange(range);
  };

  // 🛠️ Filter data based on the selected time range
  const filterData = ([start, end]) => {
    const filteredLabels = anomalyChartData.labels.filter((label) => {
      const timestamp = dayjs(label);
      return timestamp.isAfter(start) && timestamp.isBefore(end);
    });

    const filteredDatasets = anomalyChartData.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.filter((_, index) => filteredLabels.includes(anomalyChartData.labels[index])),
      anomalyValues: dataset.anomalyValues.filter((_, index) => filteredLabels.includes(anomalyChartData.labels[index])),
    }));

    setFilteredData({ labels: filteredLabels, datasets: filteredDatasets });
  };

  // Get the currently selected dataset safely
  const currentDataset = filteredData?.datasets.find((d) => d.label === selectedDataset) || filteredData?.datasets[0];

  // Extract normal and anomaly data points
  const normalX = [];
  const normalY = [];
  const anomalyX = [];
  const anomalyY = [];

  currentDataset?.data.forEach((value, index) => {
    if (currentDataset.anomalyValues[index] === 0) {
      normalX.push(filteredData.labels[index]);
      normalY.push(value);
    } else {
      anomalyX.push(filteredData.labels[index]);
      anomalyY.push(value);
    }
  });

  // 🛡️ Check if there's valid data after filtering
  const hasData = filteredData && filteredData.datasets.some((dataset) => dataset.data.length > 0);

  return (
    <HvCard
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        minHeight: "500px",
        borderRadius: "0px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
      statusColor="red"
    >
      {/* Select and Date Picker */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          paddingBottom: "1rem",
          paddingLeft: "1rem",
          width: "100%",
        }}
      >
        <Select
          id="quick-select2"
          value={selectedDataset}
          onChange={handleDatasetChange}
          variant="outlined"
          style={{ marginTop: "1rem", height: "2rem" }}
        >
          {isValidData &&
            anomalyChartData.datasets.map((dataset) => (
              <MenuItem key={dataset.label} value={dataset.label}>
                {dataset.label}
              </MenuItem>
            ))}
        </Select>
        <DateTimeRangePicker onChange={handleDateRangeChange} />
      </div>

      {/* Show "No Data to Display" if no data after filtering */}
      {isValidData ? (
        hasData ? (
          <Box>
            <Plot
              config={{ displayModeBar: false }}
              data={[
                {
                  x: normalX,
                  y: normalY,
                  mode: "lines+markers",
                  name: "Normal Data",
                  marker: { color: "blue", size: 6 },
                  line: { color: "blue", width: 2 },
                },
                {
                  x: anomalyX,
                  y: anomalyY,
                  mode: "markers",
                  name: "Anomalies",
                  marker: { color: "red", size: 10, symbol: "circle" },
                },
              ]}
              layout={{
                xaxis: { title: "Time", tickangle: 45 },
                yaxis: { title: "Values", automargin: true },
                margin: { t: 60, b: 80, l: 80, r: 50 },
                dragmode: "zoom",
                plot_bgcolor: "#F5F6F6",
              }}
              style={{ height: "100%", width: "100%" }}
              useResizeHandler={true}
            />
          </Box>
        ) : (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            <HvTypography variant="title4">No Data to Display</HvTypography>
          </div>
        )
      ) : (
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <HvTypography variant="label">No Data Available</HvTypography>
        </div>
      )}
    </HvCard>
  );
};

export default AnomalyChart;
