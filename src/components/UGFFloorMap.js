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
import compassImg from "../assets/CompassIcon.png";
import { routeName } from "../utils/RouteUtils";

const imageBounds = [[0, 0], [775, 825]];

// Sensor positions
const sensorPositions = {
  1159: [388, 155], //5 Done
  49: [384, 169], //4  Done
  15: [489, 198], //6 Done
  3: [567, 474], //4 Done
  146: [573, 470], //12 Done
  65: [563, 467], //11 Done
  2187: [557, 464], //13 Done
  33: [561, 483], //14 Done
  34: [337, 692], //16 Done
  53: [343, 692], //17 Done
  113: [343, 688], //18 Done
  145: [549, 482], //15 Done
  35: [329, 690], //20 Done
  66: [320, 690], //22 Done
  2188: [325, 690], //21 Done
  2189: [240, 530],  //23 Done
  36: [134, 461], //24 Done
  2190: [143, 453], //25 Done
  90: [149, 457], //26 Done
  67: [150, 449], //27 Done
  37: [137, 448], //28 Done
  50: [144, 446],//29 Done
  2191: [130, 359], //30 Done
  38: [372, 154], //32 Done
  2192: [239, 179], //31 Done
  69: [160, 227], //38 Done
  3183: [172, 222], //36 Done
  68: [577, 253], //35 Done
  3186: [170, 229], //37 Done
  3185: [570, 250], // 34 Done
  // // new devices
  81: [606, 365], // 8 Done
  16: [617, 352], // 7 Done
  1171: [338, 688], // 19 Done
  2186: [585, 385], //9 Done
  3184: [570, 237], //33 Done
};

// Gate label positions
// const gatePositions = {
//   northGate: [30, 412],
//   southGate: [780, 412],
//   eastGate: [388, 810],
//   westGate: [388, 10],
// };

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

const UGFFloorMap = ({ sensorData = [] }) => {
  const navigate = useNavigate();

  const handleClick = (sensor) => {
    const route = routeName(sensor.detector);
    if (route) {
      navigate(`/${route}?device_id=${sensor.device_id}`);
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
        <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}new_UGFMap.jpg`} bounds={imageBounds} />

        {/* Gate markers */}
        {/* {Object.entries(gatePositions).map(([key, position]) => (
        <Marker
          key={key}
          position={position}
          icon={createGateIcon(key.replace(/([A-Z])/g, " $1").toUpperCase())}
          interactive={false}
        />
      ))} */}

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

export default UGFFloorMap;