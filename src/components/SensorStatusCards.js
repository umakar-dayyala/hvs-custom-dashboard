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

  // Extract values for the summary card
  const sensorSummary = {
    active: "00",
    inactive: "00",
    faulty: "00/00",
    alert: false,
  };

  let openIncidentCardIndex = -1;

  cards.forEach((card, index) => {
    if (card.title === "Open Incident") openIncidentCardIndex = index;
    if (card.title === "Active Sensor") sensorSummary.active = card.value.padStart(2, "0");
    if (card.title === "Inactive Sensor") sensorSummary.inactive = card.value.padStart(2, "0");
    if (card.title === "Faulty Sensors") {
      sensorSummary.faulty = card.value;
      const [unhealthy] = card.value.split("/").map(Number);
      sensorSummary.alert = unhealthy > 0;
    }
  });

  // Stacked Progress Bar Configuration with Legend
  const chartOptions = {
    chart: {
      type: "bar",
      height: "100%", // Ensures chart height takes the full space
      stacked: true, // Keep the stacked structure for counts
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "90%",
      },
    },
    stroke: { width: 1, colors: ["#fff"] },
    xaxis: {
      categories: [""],
      labels: { show: false }, // Hide x-axis labels to focus on the count
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
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
    legend: {
      show: true,
      position: "top", // Position of the legend
      horizontalAlign: "center", // Align the legend horizontally
      labels: {
        colors: ["#000"], // Set text color of the legend
      },
    },
    colors: ["#29991d", " RGB(128, 128,128)", "#ff9933"], // Green, Amber, Red
  };

  // Actual count series for the chart (showing counts, not percentages)
  const chartSeries = [
    { name: "Active", data: [Number(sensorSummary.active)] },
    { name: "Inactive", data: [Number(sensorSummary.inactive)] },
    { name: "Unhealthy Sensors", data: [Number(sensorSummary.faulty.split("/")[0] || 0)] },
  ];

  return (
    <div className="sensor-status-container">
      {cards.map((card, index) => {
        if (card.title === "Total Sensor" || card.title === "Inactive Sensor" || card.title === "Active Sensor" || card.title === "Faulty Sensors" || card.title === 'Disconnected Sensor') {
          return null; // Skip rendering these since they'll be in the summary
        }

        let sensorValue = card.value;

        let alertBorder = false;
        let cardContentColor = "green"; // Default color
        let textColor = "white"; // Always white text for the sensor value

        // Check if the card title is one of the alarm types
        if (["Chemical Alarms", "Biological Alarms", "Radiological Alarms"].includes(card.title)) {
          // Split the faulty value using "/"
          const [alertValue] = card.value.split("/").map(Number);
          alertBorder = alertValue > 1; // Alert if first value > 1
          cardContentColor = alertBorder ? "red" : "green";
        }
        if (["Open Incident", "CBRN Alarms"].includes(card.title)) {
          alertBorder = card.value > 1;
          cardContentColor = alertBorder ? "red" : "green";

        }

        const currentImage =
          sensorImages[card.title]?.[alertBorder ? "alert" : "normal"] || null;

        return (
          <React.Fragment key={index}>
            <HvCard
              statusColor={alertBorder ? "red" : "green"}
              className={`sensor-card ${alertBorder ? "alert-border" : ""}`}
              {...props}
            >
              <HvCardHeader title={<HvTypography variant="title2">{card.title}</HvTypography>} />

              {currentImage && <img src={currentImage} alt={card.title} className="sensor-icon" />}

              <HvCardContent style={{ backgroundColor: cardContentColor }}>
                <div className="sensor-card-content">
                  <HvTypography variant="title1" style={{ color: textColor }}>
                    {card.value}
                  </HvTypography>
                </div>
              </HvCardContent>
            </HvCard>

            {index === openIncidentCardIndex && (
              <HvCard
                statusColor="green" // Fixed color for the Sensor Summary card border
                className="sensor-card"
                {...props}
              >
                <HvCardContent style={{ padding: "5px 0 0 0" }}>
                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <ReactApexChart
                      options={chartOptions}
                      series={chartSeries}
                      type="bar"
                      width="100%"
                      height="110"
                    />
                  </div>
                </HvCardContent>
              </HvCard>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SensorStatusCards;
