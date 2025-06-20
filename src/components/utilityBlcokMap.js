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

  41: [69, 172],     // PRM - 88 Done 
  1161: [75, 171],    // AP4C - 84 Done 
  2207: [62, 180],   // FCAD - 83 Done
  42: [63, 184],     // PRM - 89 Done
  57: [64, 188],   // AGM - 87 Done
  125: [76, 175],      // MAB - 85 Done
  43: [228, 604],    // PRM - 95 Done
  1164: [222, 611],     // AP4C -  91 Done
  5: [220, 604],      // AGM 94 Done
  2208: [221, 597],  // FCAD -  90 Done
  126: [230, 595],   // MAB 92 Done
  44: [226, 593],   // PRM 96 Done
  // new device
  1177: [77, 178], // ASM 86 Done
  1178:[233, 598], // ASM 93 Done

  46: [663, 209],     // PRM -  103 Done
  45: [668, 211],     // PRM - 102 Done
  1165: [663, 214],   // AP4C - 98 Done
  1149: [659, 205],      // AGM - 101 Done
  127: [657, 213],   // MAB - > 99 Done
  2209: [660, 207],      // FCAD - 97 Done
  52: [480, 601],    // AGM - 108 Done
  2210: [484, 600],     // FCAD - 104 Done
  47: [489, 600],      // PRM - 109 Done
  1166: [495, 602],  // AP4C - 105 Done
  48: [487, 607],   // PRM - 110 Done
  // new device id's
  1179: [656, 211], // ASM 100 Done
  128: [496, 608], // MAB 106 Done
  1189: [496, 611], // ASM 107 not recieving data
  
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

const UtilityBlockMap = ({ sensorData = [] }) => {
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
        <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}new_UtilityMap.png`} bounds={imageBounds} />

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

export default UtilityBlockMap;
