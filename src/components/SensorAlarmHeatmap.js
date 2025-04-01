import React from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

// Import your icons (replace these with actual paths)
import bioIcon from "../assets/rBiological.svg";
import chemIcon from "../assets/rChemical.svg";
import radIcon from "../assets/rRadiological.svg";

// Sensor type to icon mapping
const sensorTypeIcons = {
  Biological: bioIcon,
  Chemical: chemIcon,
  Radiation: radIcon,
};

const SensorAlarmHeatmap = ({ sensorsData = [], title = "" }) => {
  const navigate = useNavigate();

  // Status and Alarm Mapping
  const statusToValue = {
    Active: 1,
    Inactive: 2,
    Fault: 3,
    Disconnected: 4,
  };

  const alarmToValue = (alarmCount) => (alarmCount > 0 ? 1 : 0);

  // Route Mapping
  const routeName = (detector) => {
    const routes = {
      AGM: "agmindividual",
      "AP4C-F": "AP4CIndividual",
      FCAD: "FCADIndividual",
      PRM: "PRMIndividual",
      VRM: "vrmIndividual",
      IBAC: "ibacIndividual",
      MAB: "MABIndividual",
    };
    return routes[detector] || null;
  };

  // Determine if it's Alarm or Status based on the title
  const isAlarmHeatmap = title.toLowerCase().includes("alarm");

  // Group data by location
  const groupedData = sensorsData.reduce((acc, { location, sensor, status, alarmCount, deviceId }) => {
    if (!acc[location]) acc[location] = [];
    const value = isAlarmHeatmap ? alarmToValue(alarmCount) : statusToValue[status] || 0;
    acc[location].push({ sensor, value, deviceId });
    return acc;
  }, {});

  // Map grouped data into chart series
  const series = Object.entries(groupedData).map(([location, sensors]) => ({
    name: location,
    data: sensors.map(({ sensor, value, deviceId }) => ({
      x: sensor,
      y: value,
      deviceId,
    })),
  }));
console.log("Series: "+JSON.stringify(series));
  // Chart Options
  const options = {
    chart: {
      type: "treemap",
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const { seriesIndex, dataPointIndex } = config;
          const clickedSensor = series[seriesIndex]?.data[dataPointIndex];
          if (clickedSensor) {
            const route = routeName(clickedSensor.x);
            if (route) {
              navigate(`/${route}?device_id=${clickedSensor.deviceId}`);
            }
          }
        },
      },
    },
    title: {
      text: title,
      align: "center",
      style: { fontSize: "20px", fontWeight: "bold" },
    },
    legend: { show: false },
    dataLabels: {
      enabled: true,
      formatter: (text) => text,
      style: { fontSize: "18px", fontWeight: "bold", colors: ["#fff"] },
    },
    plotOptions: {
      treemap: {
        distributed: false,
        colorScale: {
          ranges: isAlarmHeatmap
            ? [
                { from: 0, to: 0, color: "#008000", name: "No Alarm" },
                { from: 1, to: 1, color: "red", name: "Alarm" },
              ]
            : [
              { from: 1, to: 1, color: "#29991d", name: "Active" },
              { from: 2, to: 2, color: "rgb(128, 128, 128)", name: "Inactive" },
              { from: 3, to: 3, color: "#ff9933", name: "Fault" },
              { from: 4, to: 4, color: "rgb(128, 128, 128)", name: "Disconnected" },
            ],
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          if (isAlarmHeatmap) {
            return value === 1 ? "Alarm" : "No Alarm";
          }
          switch (value) {
            case 1:
              return "Active";
            case 2:
              return "Inactive";
            case 3:
              return "Fault";
            case 4:
              return "Disconnected";
            default:
              return "Unknown";
          }
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px" }}>
      {series.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px 0",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#666",
          }}
        >
          No Data Available
        </div>
      ) : (
        <Chart options={options} series={series} type="treemap" height={600} />
      )}
    </div>
  );
};

export default SensorAlarmHeatmap;
