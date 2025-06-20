import React from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/FloorPlanMap.css";
import { useNavigate } from "react-router-dom";

import gChemical from "../assets/gChemical.svg";
import gBiological from "../assets/gBiological.svg";
import gRadiation from "../assets/gRadiological.svg";
import alertChemical from "../assets/rChemical.svg";
import alertBiological from "../assets/rBiological.svg";
import alertRadiation from "../assets/rRadiological.svg";
import greyBio from "../assets/greyBio.svg";
import greyChemical from "../assets/greyChem.svg";
import greyRadio from "../assets/greyRadio.svg";
import aBio from "../assets/aBiological.svg";
import aChemical from "../assets/aChemical.svg";
import aRadiation from "../assets/aRadiological.svg";
import aOxygen from "../assets/aOxygen.svg";
import aWeather from "../assets/aWeather.svg";
import gOxygen from "../assets/gOxygen.svg";
import gWeather from "../assets/gWeather.svg";
import alertOxygen from "../assets/rOxygen.svg";
import alertWeather from "../assets/rWeather.svg";
import greyOxygen from "../assets/gyOxygen.svg";
import greyWeather from "../assets/gyWeather.svg";
import compassImg from "../assets/CompassIcon.png";
import { routeName } from "../utils/RouteUtils";
import { getMABDeviceId } from "../service/summaryServices";

const imageBounds = [[0, 0], [775, 825]];

// Sensor positions
const sensorPositions = {

  //SENSOR NAMES are not updated
  41: [185, 174],     // PRM - 88 Done
  1161: [195, 174],    // AP4C - 84 Done
  2207: [168, 182],   // FCAD - 83 Done
  42: [172, 186],     // PRM - 89 Done
  57: [174, 190],   // AGM - 87 Done
  125: [198, 178],      // MAB - 85 Done
  43: [510, 586],    // PRM - 95 Done
  1164: [492, 592],     // AP4C -  91 Done
  5: [490, 586],      // AGM 94 Done
  2208: [494, 580],  // FCAD -  90 Done
  126: [515, 576],   // MAB 92 Done
  44: [502, 576],   // PRM 96 Done
  // new device
  1177: [200, 181], // ASM 86 Done
  1178:[517, 580], // ASM 93 Done

};


// Gate label positions
const gatePositions = {
  northGate: [30, 412],
  southGate: [780, 412],
  eastGate: [388, 810],
  westGate: [388, 10],
};

// Return icon by sensor type and status
const getIconByStatus = (type, status, alarmStatus, detector) => {
  if (alarmStatus === "Alarm") {
    if (type === "Generic") {
      switch (detector) {
        case "Oxygen": return alertOxygen;
        case "Weather": return alertWeather;
        default: return null;
      }
    }
    switch (type) {
      case "Chemical": return alertChemical;
      case "Biological": return alertBiological;
      case "Radiation": return alertRadiation;
      default: return null;
    }
  }
  if (status === "Inactive" || status === "Disconnected") {
    if (type === "Generic") {
      switch (detector) {
        case "Oxygen": return greyOxygen;
        case "Weather": return greyWeather;
        default: return null;
      }
    }
    switch (type) {
      case "Chemical": return greyChemical;
      case "Biological": return greyBio;
      case "Radiation": return greyRadio;
      default: return null;
    }
  }
  if (status === "Fault") {
    if (type === "Generic") {
      switch (detector) {
        case "Oxygen": return aOxygen;
        case "Weather": return aWeather;
        default: return null;
      }
    }
    switch (type) {
      case "Chemical": return aChemical;
      case "Biological": return aBio;
      case "Radiation": return aRadiation;
      default: return null;
    }
  }
  if (type === "Generic") {
    switch (detector) {
      case "Oxygen": return gOxygen;
      case "Weather": return gWeather;
      default: return null;
    }
  }
  switch (type) {
    case "Chemical": return gChemical;
    case "Biological": return gBiological;
    case "Radiation": return gRadiation;
    default: return null;
  }
};

// Create colored pin icon with inner image
const createPinIcon = (imgUrl, status, alarm_status) => {
  let backgroundColor;

  if (alarm_status === "Alarm") {
    backgroundColor = "red";
  } else {
    switch (status) {
      case "Active":
        backgroundColor = "green";
        break;
      case "Fault":
        backgroundColor = "#ff9933";
        break;
      case "Inactive":
      case "Disconnected":
        backgroundColor = "rgb(128, 128, 128)";
        break;
      default:
        backgroundColor = "white";
    }
  }

  const pinClass = alarm_status === "Alarm" ? "pin-wrapper alarm-blink" : "pin-wrapper";

  return L.divIcon({
    className: "custom-icon",
    html: `
      <div class="${pinClass}">
        <div class="pin-body" style="background-color: ${backgroundColor};">
          ${imgUrl ? `<img src="${imgUrl}" class="pin-img" style="filter: brightness(0) invert(1);" />` : ""}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Create labeled gate icon
const createGateIcon = (label) =>
  L.divIcon({
    className: "gate-icon",
    html: `<div style="
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    ">${label}</div>`,
    iconSize: [60, 20],
    iconAnchor: [30, 10],
  });

const FloorPlanMap = ({ sensorData = [] }) => {
  console.log("SOUTH UTILITY Opened:");
  const navigate = useNavigate();

  const handleClick = async (sensor) => {
    if (sensor.detector === "ASM") {
      const mabDeviceId = await getMABDeviceId(sensor.device_id);
      if (mabDeviceId) {
        navigate(`/MABIndividual?device_id=${mabDeviceId}`);
      } else {
        console.warn("No MAB found for ASM device:", sensor.device_id);
        // Optional: Show a toast/snackbar to user
      }
    } else {
      const route = routeName(sensor.detector);
      if (route) {
        navigate(`/${route}?device_id=${sensor.device_id}`);
      }
    }
  };  

  return (
    <div style={{ position: "relative", width: "100%", height: "90vh" }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={imageBounds}
        style={{ height: "90vh", width: "100%" }}
        zoom={0}
        minZoom={-2}
        maxZoom={2}
      >
        <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}new_SUMap.png`} bounds={imageBounds} />

        {/* Sensor markers */}
        {Array.isArray(sensorData) && sensorData.map((entry) => {
          const sensor = entry.s_no;
          const position = sensorPositions[sensor.device_id];
          if (!position) return null;

          const iconUrl = getIconByStatus(sensor.detector_type, sensor.status, sensor.alarm_status, sensor.detector);
          const icon = createPinIcon(iconUrl, sensor.status, sensor.alarm_status);

          return (
            <Marker key={sensor.device_id} position={position} icon={icon}>
              <Popup>
                <div>
                  <strong
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleClick(sensor)}
                  >
                    {sensor.detector}
                  </strong>
                  <p><strong>Status:</strong> {sensor.status}</p>
                  <p><strong>Zone:</strong> {sensor.zone}</p>
                  <p><strong>Location:</strong> {sensor.location}</p>
                  <p><strong>Device ID:</strong> {sensor.device_id}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {/* Top-right corner image overlay */}
      <img
        src={compassImg}
        alt="Overlay"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          width: "150px",
          height: "150px",
          zIndex: 1000,
        }}
      />
    </div >
  );
};

export default FloorPlanMap;
