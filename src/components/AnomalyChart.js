import React, { useEffect, useState } from "react";
import { Select, MenuItem, Box } from "@mui/material";
import Plot from "react-plotly.js";
import { HvCard } from "@hitachivantara/uikit-react-core";
import DateTimeRangePicker from "./DateTimeRangePicker";
import dayjs from "dayjs";
import "../css/Anomaly.css";

const AnomalyChart = ({ responseData }) => {
  const [selectedDataset, setSelectedDataset] = useState(responseData.datasets[0].label);
  const [filteredData, setFilteredData] = useState(responseData);
  const [selectedRange, setSelectedRange] = useState([dayjs(), dayjs().subtract(5, "minute")]);
  
  const handleDatasetChange = (event) => {
    setSelectedDataset(event.target.value);
  };

  // Function to filter data based on selected time range
  const filterData = ([start, end]) => {
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

  // Get the currently selected dataset
  const currentDataset = filteredData.datasets.find((d) => d.label === selectedDataset) || filteredData.datasets[0];

  // Extract normal and anomaly data points
  const normalX = [];
  const normalY = [];
  const anomalyX = [];
  const anomalyY = [];

  console.log("currentdataset",currentDataset.data);
  currentDataset.data.forEach((value, index) => {
    
    if (currentDataset.anomalyValues[index] === 0) {
      normalX.push(filteredData.labels[index]);
      normalY.push(value);
    } else {
      anomalyX.push(filteredData.labels[index]);
      anomalyY.push(value);
    }
  });

  useEffect(() => {
    filterData(selectedRange);
  }, [selectedRange]);

  const handleDateRangeChange = (range) => {
    setSelectedRange(range);
  }

  return (
    <HvCard style={{ height: "100%", width: "100%", backgroundColor: "white" ,minHeight:"500px"}} statusColor="red">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1rem", paddingLeft: "1rem",width:"100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1rem", paddingLeft: "1rem", width: "100%",marginRight:"1rem" }}>
  <Select
  id="quick-select2"
    value={selectedDataset}
    onChange={handleDatasetChange}
    variant="outlined"
    style={{  marginTop:"1rem" ,height:"2rem" }}
  >
    {responseData.datasets.map((dataset) => (
      <MenuItem key={dataset.label} value={dataset.label}>
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
            title: { text: currentDataset.label, font: { size: 18 } },
            xaxis: { title: "Time", tickangle: 45 },
            yaxis: { title: "Values", automargin: true }, // Ensure Y-axis labels have enough space
            margin: { t: 60, b: 80, l: 80, r: 50 }, // Increased left margin from 50 to 80
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

export default AnomalyChart;
