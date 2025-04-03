import React, { useEffect, useState } from "react";
import { Select, MenuItem, Box } from "@mui/material";
import Plot from "react-plotly.js";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import dayjs from "dayjs";
import "../css/Anomaly.css";

const AnomalyChart = ({ anomalyChartData, onRangeChange ,title,lastFetchTime}) => {
  const [selectedDataset, setSelectedDataset] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedRange, setSelectedRange] = useState();

  // Check if anomalyChartData is valid
  const isValidData =
    anomalyChartData &&
    Array.isArray(anomalyChartData.datasets) &&
    anomalyChartData.datasets.length > 0 &&
    Array.isArray(anomalyChartData.labels);

    useEffect(() => {
      if (isValidData && !selectedDataset) {
        setSelectedDataset(anomalyChartData.datasets[0].label);
      }
    }, [anomalyChartData, selectedDataset]);
    

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
    if (onRangeChange) {
      onRangeChange(range);
      console.log("onRangeChange:", range);
    }
  };

  // 🛠️ Filter data based on the selected time range
  const filterData = ([start, end]) => {
    if (!isValidData) return; // Exit if data is invalid

    // Ensure labels and datasets exist
    if (!anomalyChartData.labels || !anomalyChartData.datasets) return;

    const filteredLabels = anomalyChartData.labels.filter((label) => {
      const timestamp = dayjs(label);
      return timestamp.isAfter(start) && timestamp.isBefore(end);
    });

    const filteredDatasets = anomalyChartData.datasets.map((dataset) => {
      if (!dataset.data || !dataset.anomalyValues) return dataset; // Skip if data or anomalyValues is missing

      return {
        ...dataset,
        data: dataset.data.filter((_, index) => filteredLabels.includes(anomalyChartData.labels[index])),
        anomalyValues: dataset.anomalyValues.filter((_, index) => filteredLabels.includes(anomalyChartData.labels[index])),
      };
    });

    setFilteredData({ labels: filteredLabels, datasets: filteredDatasets });
  };

  // Get the currently selected dataset safely
  const currentDataset = filteredData?.datasets?.find((d) => d.label === selectedDataset) || filteredData?.datasets?.[0];

  // Extract normal and anomaly data points
  const normalX = [];
  const normalY = [];
  const anomalyX = [];
  const anomalyY = [];

  if (currentDataset && filteredData?.labels) {
    currentDataset.data?.forEach((value, index) => {
      if (currentDataset.anomalyValues?.[index] === 0) {
        normalX.push(filteredData.labels[index]);
        normalY.push(value);
      } else {
        anomalyX.push(filteredData.labels[index]);
        anomalyY.push(value);
      }
    });
  }

  // 🛡️ Check if there's valid data after filtering
  const hasData = filteredData && filteredData.datasets?.some((dataset) => dataset.data?.length > 0);

  return (
    <HvCard
    style={{
      height: "100%",
      width: "100%",
      backgroundColor: "white",
      borderRadius: "0px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    }}
    statusColor="red"
  >
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center',paddingTop: '1rem',paddingRight: '1rem' }}>
        
        {lastFetchTime && (
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            Last updated: {lastFetchTime}
          </div>
        )}
      </div>
    {/* Title, Select, and DateTimeRangePicker in a Single Row */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Ensures proper spacing
        padding: "1rem",
        width: "100%",
      }}
    >
      <HvTypography variant="title2">{title}</HvTypography>
  
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {isValidData && (
          <Select
            id="quick-select2"
            value={selectedDataset}
            onChange={handleDatasetChange}
            variant="outlined"
            style={{ height: "2rem" }}
          >
            {anomalyChartData.datasets.map((dataset) => (
              <MenuItem key={dataset.label} value={dataset.label}>
                {dataset.label}
              </MenuItem>
            ))}
          </Select>
        )}
  
        <DateTimeRangePicker onChange={handleDateRangeChange} />
      </div>
    </div>
  
    {/* Show "No Data to Display" if no data after filtering */}
    {isValidData ? (
      hasData ? (
        <Box>
          <Plot
            config={{ displayModeBar: false }}
            data={[
              {
                x: filteredData.labels,
                y: currentDataset.data,
                mode: "lines+markers",
                name: "Data",
                marker: {
                  color: currentDataset.data.map((_, index) =>
                    currentDataset.anomalyValues[index] === 1 ? "red" : "blue"
                  ),
                  size: 6,
                },
                line: {
                  color: "blue",
                  width: 2,
                },
              },
            ]}
            layout={{
              xaxis: {
                showticklabels: false,
                title: "",
                showgrid: false,
                zeroline: false,
              },
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