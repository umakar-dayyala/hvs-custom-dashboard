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
import { getMABDeviceId } from "../service/summaryServices";
import { routeName } from "../utils/RouteUtils";

const imageBounds = [[0, 0], [775, 825]];

// Sensor positions
const sensorPositions = {

  //SENSOR NAMES are not updated
  46: [556, 212],     // PRM -  103 Done
  45: [562, 213],     // PRM - 102 Done
  1165: [551, 216],   // AP4C - 98 Done
  1149: [545, 205],      // AGM - 101 Done
  127: [542, 215],   // MAB - > 99 Done
  2209: [548, 209],      // FCAD - 97 Done
  52: [217, 582],    // AGM - 108 Done
  2210: [221, 581],     // FCAD - 104 Done
  47: [232, 583],      // PRM - 109 Done
  1166: [241, 585],  // AP4C - 105 Done
  // 12: [220, 592],   // MAB - k Done but not get not ther
  48: [226, 589],   // PRM - 110 Done
  // new device id's
  1179: [538, 212], // ASM 100 Done
  128: [244, 589], // MAB 106 Done
  1189: [243, 592], // ASM 107 not recieving data
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
  console.log("NORTH UTILITY Opened:");
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
        <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}new_NUMap.png`} bounds={imageBounds} />
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
          top: "10px",
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
