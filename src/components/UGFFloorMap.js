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
  1159: [378, 103], //1 Done
  49: [382, 113], //2  Done
  15: [514, 154], //3 Done
  3: [569, 476], //4 Done
  146: [567, 472], //5 Done
  65: [563, 467], //6 Done
  2187: [561, 463], //7 Done
  2186: [586, 356], //8 Done
  33: [561, 489], //a Done
  34: [337, 734], //b Done
  53: [343, 724], //c Done
  113: [335, 724], //d Done
  145: [549, 486], //e Done
  35: [324, 734], //f Done
  66: [328, 724], //g Done
  2188: [320, 724], //h Done
  2189: [240, 544],  //i Done
  36: [142, 447], //j Done
  2190: [143, 453], //k Done
  90: [149, 457], //l Done
  67: [157, 451], //m Done
  37: [141, 441], //n Done
  50: [144, 435],//o Done
  2191: [130, 329], //p Done
  38: [367, 108], //q Done
  2192: [239, 134], //r Done
  69: [182, 196], //s Done
  3183: [188, 202], //t Done
  68: [573, 253], //u Done
  3186: [600, 250],
  3185: [110, 257],
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
        <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}UGF_map.png`} bounds={imageBounds} />

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