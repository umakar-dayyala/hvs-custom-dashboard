import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Plot from "react-plotly.js";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import dayjs from "dayjs";
import "../css/Anomaly.css";

const AnomalyChart = ({ anomalyChartData, onRangeChange, title, lastFetchTime }) => {
  const [selectedDataset, setSelectedDataset] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedRange, setSelectedRange] = useState();

  const isValidData =
    anomalyChartData &&
    Array.isArray(anomalyChartData.datasets) &&
    anomalyChartData.datasets.length > 0 &&
    Array.isArray(anomalyChartData.labels);

  const [expanded, setExpanded] = useState(isValidData);

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
    }
  };

  const filterData = ([start, end]) => {
    if (!isValidData) return;

    const indices = anomalyChartData.labels.reduce((arr, label, index) => {
      const timestamp = dayjs(label);
      if (timestamp.isAfter(start) && timestamp.isBefore(end)) arr.push(index);
      return arr;
    }, []);

    const filteredLabels = indices.map((i) => anomalyChartData.labels[i]);

    const filteredDatasets = anomalyChartData.datasets.map((dataset) => ({
      ...dataset,
      data: indices.map((i) => dataset.data?.[i] ?? null),
      anomalyValues: indices.map((i) => dataset.anomalyValues?.[i] ?? 0),
    }));

    setFilteredData({ labels: filteredLabels, datasets: filteredDatasets });
  };

  const currentDataset =
  filteredData?.datasets?.find((d) => d.label === selectedDataset) ||
  anomalyChartData?.datasets?.find((d) => d.label === selectedDataset) ||
  anomalyChartData?.datasets?.[0] ||
  null;


  const chartLabels = filteredData?.labels || anomalyChartData.labels;
  const chartData = currentDataset?.data || [];
  const chartAnomalies = currentDataset?.anomalyValues || [];

  const hasData = Array.isArray(chartData) && chartData.length > 0;

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded((p) => !p)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <HvTypography variant="title3">{title || "Anomaly Chart"}</HvTypography>
      </AccordionSummary>

      <AccordionDetails>
        <HvCard
          style={{
            height: "500px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "0px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
          statusColor="red"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingTop: "1rem",
              paddingRight: "1rem",
            }}
          >
            {lastFetchTime && (
              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                Last updated: {lastFetchTime}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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

          {isValidData ? (
            hasData ? (
              <Box>
                <Plot
                  config={{ displayModeBar: false }}
                  data={[
                    {
                      x: chartLabels,
                      y: chartData,
                      mode: "lines+markers",
                      name: "Data",
                      marker: {
                        color: chartData.map((_, index) =>
                          chartAnomalies[index] === 1 ? "red" : "blue"
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
      </AccordionDetails>
    </Accordion>
  );
};

export default AnomalyChart;
