
import React, { useEffect, useState } from "react";
// import "../css/sensorStatusCards.css";
import "../css/SensorStatusCards.css";
import { FaEye } from "react-icons/fa";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { getSensorData } from "../service/summaryServices";

import gChemical from "../assets/gChemical.svg";
import gBiological from "../assets/gBiological.svg";
import gRadiation from "../assets/gRadiological.svg";

import alertChemical from "../assets/rChemical.svg";
import alertBiological from "../assets/rBiological.svg";
import alertRadiation from "../assets/rRadiological.svg";

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
      const data = await getSensorData();
      setCards(data);
    };

    fetchData(); // Initial call

    interval = setInterval(fetchData, 500000000000000); // Fetch every 500ms need to change later

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="sensor-status-container">
      {cards.map((card, index) => {
        let sensorValue = card.value;
        let alertBorder = false;
        let progressPercentage = 0;

        if (card.title === "Unhealthy Sensors") {
          const [unhealthy, total] = sensorValue.split("/").map(Number);
          progressPercentage = (unhealthy / total) * 100;
          sensorValue = `${unhealthy}/${total}`;
          alertBorder = unhealthy > 0;
        } else if (!["Total Sensor", "Inactive Sensor", "Active Sensor"].includes(card.title)) {
          sensorValue = Number(sensorValue);
          alertBorder = sensorValue > 0;
        } else {
          alertBorder = false; // Ensures these specific cards don't get an alert
        }

        const currentImage =
          sensorImages[card.title] && alertBorder
            ? sensorImages[card.title].alert
            : sensorImages[card.title]?.normal;

        return (
          <HvCard
            key={index}
            statusColor={alertBorder ? "red" : "green"}
            className={`sensor-card ${alertBorder ? "alert-border" : ""}`}
            {...props}
          >
            <HvCardHeader title={<HvTypography variant="title">{card.title}</HvTypography>} />

            {currentImage && (
              <img
                src={currentImage}
                alt={card.title}
                className="sensor-icon"
              />
            )}

            <HvCardContent>
              {card.title === "Unhealthy Sensors" && (
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill green"
                      style={{ width: `${100 - progressPercentage}%` }}
                    ></div>
                    <div
                      className="progress-fill red"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="sensor-card-content">
                <HvTypography variant="title1">
                  {sensorValue === 0 ? "00" : sensorValue.toString().padStart(2, "0")}
                </HvTypography>
                {/* <FaEye color="#2064B4" /> */}
              </div>
            </HvCardContent>
          </HvCard>
        );
      })}
    </div>
  );
};

export default SensorStatusCards;