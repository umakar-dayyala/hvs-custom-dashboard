import React, { useEffect, useState } from "react";
import { Select, MenuItem, Box } from "@mui/material";
import Plot from "react-plotly.js";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import dayjs from "dayjs";
import "../css/Anomaly.css";

const OutlierChart = ({ outlierChartData, onRangeChange }) => {
  const [selectedDataset, setSelectedDataset] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedRange, setSelectedRange] = useState([
    dayjs().subtract(5, "minute"),
    dayjs(),
  ]);

  const isValidData =
    outlierChartData &&
    Array.isArray(outlierChartData.datasets) &&
    outlierChartData.datasets.length > 0;

  useEffect(() => {
    if (isValidData) {
      setSelectedDataset(outlierChartData.datasets[0].label);
      setFilteredData(outlierChartData);
    }
  }, [outlierChartData]);

  useEffect(() => {
    if (selectedRange && isValidData) {
      handleDateRangeChange(selectedRange);
    }
  }, [selectedRange, outlierChartData]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  const handleDateRangeChange = (range) => {
    setSelectedRange(range);
    if (onRangeChange) {
      onRangeChange(range);
    }

    if (!outlierChartData || !outlierChartData.labels) {
      console.warn("No outlierChartData or labels found!");
      return;
    }

    const [start, end] = range;
    const filteredLabels = outlierChartData.labels.filter((label) => {
      const timestamp = dayjs(label);
      return timestamp.isAfter(start) && timestamp.isBefore(end);
    });

    const filteredDatasets = outlierChartData.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.filter((_, index) =>
        filteredLabels.includes(outlierChartData.labels[index])
      ),
      outlierValues: dataset.outlierValues?.filter((_, index) =>
        filteredLabels.includes(outlierChartData.labels[index])
      ) || [],
    }));

    setFilteredData({
      labels: filteredLabels,
      datasets: filteredDatasets,
    });
  };

  const currentDataset =
    filteredData?.datasets.find((d) => d.label === selectedDataset) ||
    filteredData?.datasets[0];

  const normalData = [];
  const anomalyData = [];

  if (currentDataset?.data) {
    currentDataset.data.forEach((value, index) => {
      if (currentDataset.outlierValues?.[index] === 0) {
        normalData.push({ x: filteredData.labels[index], y: value });
      } else {
        anomalyData.push({ x: filteredData.labels[index], y: value });
      }
    });
  }

  return (
    <HvCard
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        minHeight: "500px",
        borderRadius: "0px",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
      statusColor="red"
    >
      {/* Filters */}
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
            outlierChartData.datasets.map((dataset) => (
              <MenuItem key={dataset.label} value={dataset.label}>
                {dataset.label}
              </MenuItem>
            ))}
        </Select>
        <DateTimeRangePicker onChange={setSelectedRange} />
      </div>

      {/* Data Handling */}
      {isValidData ? (
        filteredData?.datasets.some((dataset) => dataset.data.length > 0) ? (
          <Box>
            <Plot
              config={{ displayModeBar: false }}
              data={[
                {
                  x: normalData.map((d) => d.x),
                  y: normalData.map((d) => d.y),
                  mode: "markers",
                  name: "Normal Data",
                  marker: { color: "blue", size: 10 },
                },
                {
                  x: anomalyData.map((d) => d.x),
                  y: anomalyData.map((d) => d.y),
                  mode: "markers",
                  name: "Outlier Data",
                  marker: { color: "red", size: 12 },
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
          <HvTypography variant="title4">No Data Available</HvTypography>
        </div>
      )}
    </HvCard>
  );
};

export default OutlierChart;
