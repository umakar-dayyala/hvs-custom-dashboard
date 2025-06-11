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

import { routeName } from "../utils/RouteUtils";

const imageBounds = [[0, 0], [775, 825]];

// Sensor positions
const sensorPositions = {

    72: [530, 130],     // AP4C - a > DONE
    73: [620, 415],     // AP4C - b > DONE
    2202: [620, 400],   // FCAD - c >DONE
    74: [496, 579],     // AP4C - d > DONE
    1148: [490, 570],   // IBAC - e > DONE
    75: [210, 590],      // AP4C - f > 
    122: [220, 580],    // MAB - g > 
    76: [120, 410],     // AP4C - h > DONE
    77: [210, 90],      // AP4C - i >DONE
    2203: [215, 575],  // FCAD - j > 
    2204: [200, 100],   // FCAD - k > DONE
    9990: [210, 100],   // IBAC - l (IBAC-IBAC), pseudo device_id
    78: [410, 310],     // AP4C - m >DONE
    79: [410, 270],      // AP4C - n > DONE
    123: [400, 305],    // MAB - o > DONE
    1147: [420, 315],   // IBAC - p > DONE
    2205: [400, 320],  // FCAD - q > DONE
    2206: [315, 300],   // FCAD - r > DONE
    1160: [310, 298],   // AP4C - s & w > DONE
    1145: [320, 298],  // IBAC - t > DONE
    124: [310, 290],   // MAB - u > DONE
    1146: [320, 308],   // IBAC - v > DONE

    1170: [310, 190],   // AAM (81) - 1 >DONE
    1169: [410, 190],   // AAM (85) - 2 > DONE
    1172: [225, 585],   // ASB - 3 >
    1175: [420, 305],   // ASB - 4 > DONE
    1176: [330, 290],   // ASB - 5 > DONE
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

  return L.divIcon({
    className: "custom-icon",
    html: `
      <div class="pin-wrapper">
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
  console.log("Terrace Opened:");
  const navigate = useNavigate();

  const handleClick = (sensor) => {
    const route = routeName(sensor.detector);
    if (route) {
      navigate(`/${route}?device_id=${sensor.device_id}`);
    }
  };

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={imageBounds}
      style={{ height: "90vh", width: "100%" }}
      zoom={0}
      minZoom={-2}
      maxZoom={2}
    >
      <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}Terrace_PNG.png`} bounds={imageBounds} />

      {/* Sensor markers */}
      {Array.isArray(sensorData) && sensorData.map((entry) => {
        const sensor = entry.s_no;
        const position = sensorPositions[sensor.device_id];
        if (!position) return null;

        const iconUrl = getIconByStatus(sensor.detector_type, sensor.status, sensor.alarm_status,
          sensor.detector);
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
  );
};

export default FloorPlanMap;
