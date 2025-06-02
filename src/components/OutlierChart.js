import React, { useEffect, useState } from "react";
import { Select, MenuItem, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Plot from "react-plotly.js";
import { HvCard, HvTypography } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import dayjs from "dayjs";
import "../css/Anomaly.css";

const OutlierChart = ({ outlierChartData, onRangeChange, title, lastFetchTime }) => {
  const [selectedDataset, setSelectedDataset] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedRange, setSelectedRange] = useState();

  // Check if outlierChartData is valid
  const isValidData =
    outlierChartData &&
    Array.isArray(outlierChartData.datasets) &&
    outlierChartData.datasets.length > 0 &&
    Array.isArray(outlierChartData.labels);

  useEffect(() => {
    if (isValidData && !selectedDataset) {
      setSelectedDataset(outlierChartData.datasets[0].label);
    }
  }, [outlierChartData, selectedDataset]);

  useEffect(() => {
    if (selectedRange && isValidData) {
      filterData(selectedRange);
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
  };

  const filterData = ([start, end]) => {
    if (!isValidData) return;

    if (!outlierChartData.labels || !outlierChartData.datasets) return;

    const filteredLabels = outlierChartData.labels.filter((label) => {
      const timestamp = dayjs(label);
      return timestamp.isAfter(start) && timestamp.isBefore(end);
    });

    const filteredDatasets = outlierChartData.datasets.map((dataset) => {
      if (!dataset.data || !dataset.outlierValues) return dataset;

      return {
        ...dataset,
        data: dataset.data.filter((_, index) => filteredLabels.includes(outlierChartData.labels[index])),
        outlierValues: dataset.outlierValues.filter((_, index) => filteredLabels.includes(outlierChartData.labels[index])),
      };
    });

    setFilteredData({ labels: filteredLabels, datasets: filteredDatasets });
  };

  const currentDataset = filteredData?.datasets?.find((d) => d.label === selectedDataset) || filteredData?.datasets?.[0];

  const normalX = [];
  const normalY = [];
  const outlierX = [];
  const outlierY = [];

  if (currentDataset && filteredData?.labels) {
    currentDataset.data?.forEach((value, index) => {
      if (currentDataset.outlierValues?.[index] === 0) {
        normalX.push(filteredData.labels[index]);
        normalY.push(value);
      } else {
        outlierX.push(filteredData.labels[index]);
        outlierY.push(value);
      }
    });
  }

  const hasData = filteredData && filteredData.datasets?.some((dataset) => dataset.data?.length > 0);

  // Accordion default expanded only if there's data
  const defaultExpanded = hasData;

  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="outlier-chart-content"
        id="outlier-chart-header"
      >
        <HvTypography variant="title3">{title}</HvTypography>
      </AccordionSummary>

      <AccordionDetails >
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '1rem', paddingRight: '1rem' }}>
            {lastFetchTime && (
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
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
            <div /> {/* Empty div to align title in AccordionSummary */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {isValidData && (
                <Select
                  id="quick-select2"
                  value={selectedDataset}
                  onChange={handleDatasetChange}
                  variant="outlined"
                  style={{ height: "2rem" }}
                >
                  {outlierChartData.datasets.map((dataset) => (
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
                      x: normalX,
                      y: normalY,
                      mode: "markers",
                      name: "Normal Data",
                      marker: { color: "blue", size: 6, symbol: "circle" },
                    },
                    {
                      x: outlierX,
                      y: outlierY,
                      mode: "markers",
                      name: "Outliers",
                      marker: { color: "red", size: 10, symbol: "circle" },
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

export default OutlierChart;
