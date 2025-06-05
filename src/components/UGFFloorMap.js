import React from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
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
  1159: [395, 113],
  49: [400, 123],
  15: [533, 163],
  3: [598, 492],
  146: [598, 486],
  65: [592, 481],
  2187: [588, 478],
  2186: [620, 373],
  33: [585, 502],
  34: [352, 755],
  53: [359, 745],
  113: [350, 745],
  145: [580, 499],
  35: [340, 755],
  66: [340, 745],
  2188: [330, 745],
  2189: [245, 565],
  36: [135, 457],
  2190: [139, 463],
  90: [146, 470],
  67: [156, 466],
  37: [140, 450],
  50: [146, 445],
  2191: [117, 322],
  38: [379, 113],
  2192: [233, 140],
  69: [185, 207],
  3183: [190, 211],
  68: [605, 263],
  3186: [600, 250],
  3185: [110, 257],
};

// Gate label positions
const gatePositions = {
  northGate: [30, 412],
  southGate: [780, 412],
  eastGate: [388, 810],
  westGate: [388, 10],
};

// Return icon by sensor type, status, alarm status, and detector
const getIconByStatus = (type, status, alarmStatus, detector) => {
  console.log(alarmStatus);
  if (alarmStatus === "Alarm") {
    console.log("Alarm   " + type);
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

const UGFFloorMap = ({ sensorData = [] }) => {
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
      <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}UGF_map.png`} bounds={imageBounds} />

      {/* Gate markers */}
      {Object.entries(gatePositions).map(([key, position]) => (
        <Marker
          key={key}
          position={position}
          icon={createGateIcon(key.replace(/([A-Z])/g, " $1").toUpperCase())}
          interactive={false}
        />
      ))}

      {/* Sensor markers */}
      {Array.isArray(sensorData) &&
        sensorData.map((entry) => {
          const sensor = entry.s_no;
          const position = sensorPositions[sensor.device_id];
          if (!position) return null;

          const iconUrl = getIconByStatus(
            sensor.detector_type,
            sensor.status,
            sensor.alarm_status,
            sensor.detector
          );
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
                  <p>
                    <strong>Status:</strong> {sensor.status}
                  </p>
                  <p>
                    <strong>Device id:</strong> {sensor.device_id}
                  </p>
                  <p>
                    <strong>Zone:</strong> {sensor.zone}
                  </p>
                  <p>
                    <strong>Location:</strong> {sensor.location}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default UGFFloorMap;