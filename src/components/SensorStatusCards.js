import React, { useEffect, useState } from "react";
import "../css/SensorStatusCards.css";
import { HvCard, HvCardContent, HvCardHeader, HvTypography } from "@hitachivantara/uikit-react-core";
import { getSensorData } from "../service/summaryServices";
import ReactApexChart from "react-apexcharts";

// Import Sensor Images
import gChemical from "../assets/gChemical.svg";
import gBiological from "../assets/gBiological.svg";
import gRadiation from "../assets/gRadiological.svg";

import alertChemical from "../assets/rChemical.svg";
import alertBiological from "../assets/rBiological.svg";
import alertRadiation from "../assets/rRadiological.svg";

// Sensor Image Mapping
const sensorImages = {
  "Chemical Alarms": { normal: gChemical, alert: alertChemical },
  "Biological Alarms": { normal: gBiological, alert: alertBiological },
  "Radiological Alarms": { normal: gRadiation, alert: alertRadiation },
};

const SensorStatusCards = (props) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      try {
        const data = await getSensorData();
        setCards((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData(); // Initial call
    interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Extract values for calculations
  let activeSensors = 0,
    inactiveSensors = 0,
    disconnectedSensors = 0,
    faultySensors = "0/0",
    cbrnAlarms = 0;

  cards.forEach((card) => {
    if (card.title === "Active Sensor") activeSensors = Number(card.value);
    if (card.title === "Inactive Sensor") inactiveSensors = Number(card.value);
    if (card.title === "Disconnected Sensor") disconnectedSensors = Number(card.value);
    if (card.title === "Faulty Sensors") faultySensors = card.value;
    if (card.title === "CBRN Alarms") cbrnAlarms = Number(card.value);
  });

  // Extract Unhealthy Sensors count
  const unhealthySensors = Number(faultySensors.split("/")[0]) || 0;

  // Calculate Live Sensors
  const liveSensors = activeSensors + unhealthySensors;


  const totalInactive = inactiveSensors + disconnectedSensors;

  // Stacked Progress Bar Configuration
  const chartOptions = {
    chart: { type: "bar", height: "100%", stacked: true, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, barHeight: "90%" } },
    stroke: { width: 1, colors: ["#fff"] },
    xaxis: { categories: [""], labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { show: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val, { seriesIndex }) => {
          const labels = ["Active", "Inactive", "Unhealthy Sensors"];
          return `${labels[seriesIndex]} Sensors: ${val}`;
        },
      },
    },
    fill: { opacity: 1 },
    legend: { show: true, position: "top", horizontalAlign: "center", labels: { colors: ["#000"] } },
    colors: ["#29991d", "RGB(128, 128,128)", "#ff9933"], // Green, Gray, Orange
  };

  // Data for Summary Chart
  const chartSeries = [
    { name: "Active", data: [activeSensors] },
    { name: "Inactive", data: [totalInactive] }, // Inactive now includes Disconnected Sensors
    { name: "Unhealthy Sensors", data: [unhealthySensors] },
  ];

  return (
    <div className="sensor-status-container">
      {cards.map((card, index) => {
        if (["Total Sensor", "Inactive Sensor", "Active Sensor", "Faulty Sensors", "Disconnected Sensor", "Open Incident"].includes(card.title)) {
          return null; // Skip unnecessary cards
        }

        let sensorValue = card.value;
        let alertBorder = false;
        let cardContentColor = "green"; // Default color
        let textColor = "white"; // Always white text for the sensor value

        if (["Chemical Alarms", "Biological Alarms", "Radiological Alarms"].includes(card.title)) {
          const [alertValue] = card.value.split("/").map(Number);
          alertBorder = alertValue > 0;
          cardContentColor = alertBorder ? "red" : "green";
        }

        if (card.title === "CBRN Alarms") {
          alertBorder = card.value > 0;
          cardContentColor = alertBorder ? "red" : "green";
          sensorValue = `${card.value}/${liveSensors}`; // Show CBRN Alarms / Live Sensors
        }

        const currentImage = sensorImages[card.title]?.[alertBorder ? "alert" : "normal"] || null;

        return (
          <HvCard key={index} statusColor={alertBorder ? "red" : "green"} className={`sensor-card ${alertBorder ? "alert-border" : ""}`} {...props}>
            <HvCardHeader title={<HvTypography variant="title2">{card.title}</HvTypography>} />
            {currentImage && <img src={currentImage} alt={card.title} className="sensor-icon" />}
            <HvCardContent style={{ backgroundColor: cardContentColor }}>
              <HvTypography variant="title1" style={{ color: textColor }}>{sensorValue}</HvTypography>
            </HvCardContent>
          </HvCard>
        );
      })}

      {/* Sensor Summary Card - Now at the end */}
      <HvCard statusColor="green" className="sensor-card" {...props}>
        <HvCardContent style={{ padding: "5px 0 0 0" }}>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <ReactApexChart options={chartOptions} series={chartSeries} type="bar" width="100%" height="110" />
          </div>
        </HvCardContent>
      </HvCard>
    </div>
  );
};

export default SensorStatusCards;
