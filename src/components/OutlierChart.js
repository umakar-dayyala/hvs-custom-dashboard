import React, { useEffect, useState } from "react";
import { Select, MenuItem,Box } from "@mui/material";
import Plot from "react-plotly.js";
import { HvCard } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import dayjs from "dayjs";
import "../css/Anomaly.css";

const OutlierChart = ({ responseData }) => {
  const [selectedDataset, setSelectedDataset] = useState(responseData.datasets[0].label);
  const [filteredData, setFilteredData] = useState(responseData);
  const [selectedRange, setSelectedRange] = useState([dayjs(), dayjs().subtract(5, "minute")]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  

  // Function to filter data based on selected time range
  const handleDateRangeChange = ([start, end]) => {
    const filteredLabels = responseData.labels.filter((label) => {
      const timestamp = dayjs(label);
      return timestamp.isAfter(start) && timestamp.isBefore(end);
    });

    const filteredDatasets = responseData.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.filter((_, index) => filteredLabels.includes(responseData.labels[index])),
      anomalyValues: dataset.anomalyValues.filter((_, index) => filteredLabels.includes(responseData.labels[index])),
    }));

    setFilteredData({ labels: filteredLabels, datasets: filteredDatasets });
  };

  const currentDataset = filteredData.datasets.find((d) => d.label === selectedDataset) || filteredData.datasets[0];

  const normalData = [];
  const anomalyData = [];

  currentDataset.data.forEach((value, index) => {
    if (currentDataset.anomalyValues[index] === 0) {
      normalData.push({ x: filteredData.labels[index], y: value });
    } else {
      anomalyData.push({ x: filteredData.labels[index], y: value });
    }
  });

  useEffect(() => {
      handleDateRangeChange(selectedRange);
    }, [selectedRange]);

  return (
    <HvCard style={{ height: "auto", width: "100%", backgroundColor: "white" }} statusColor="red">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", paddingLeft: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1rem", paddingLeft: "1rem", width: "100%",marginRight:"1rem" }}>
  <Select
  id="quick-select2"
    value={selectedDataset}
    onChange={handleDatasetChange}
    variant="outlined"
    style={{ marginTop:"1rem",height:"2rem", width: "auto" }}
    size="small"
  >
    {responseData.datasets.map((dataset) => (
      <MenuItem key={dataset.label} value={dataset.label} >
        {dataset.label}
      </MenuItem>
    ))}
  </Select>
  <DateTimeRangePicker 
    onChange={handleDateRangeChange} 
    
  />
</div>
      </div>

      {/* <div style={{ height: "calc(100% - 60px)" }}> */}
      <Box style={{ height: "calc(100% - 60px)"}}>
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
            title: { text: currentDataset.label, font: { size: 18 } },
            xaxis: { title: "Time", tickangle: 45 },
            yaxis: { title: "Values", automargin: true }, // Ensure Y-axis labels have enough space
           
            dragmode: "zoom",
          }}
          style={{ height: "100%", width: "100%" }}
          useResizeHandler={true}
        />
        </Box>
      {/* </div> */}
    </HvCard>
  );
};

export default OutlierChart;
