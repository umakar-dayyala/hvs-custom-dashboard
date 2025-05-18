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

import greyBio from "../assets/greyBio.svg";
import greyChemical from "../assets/greyChem.svg";
import greyRadio from "../assets/greyRadio.svg";

import { routeName } from "../utils/RouteUtils";

const imageBounds = [[0, 0], [775, 825]];

// Sensor positions
const sensorPositions = {

    72: [395, 113],     // AP4C - a
    73: [110, 100],     // AP4C - b
    2202: [120, 100],   // FCAD - c
    74: [130, 100],     // AP4C - d
    1148: [140, 100],   // IBAC - e
    75: [150, 100],     // AP4C - f
    122: [160, 100],    // MAB - g
    76: [170, 100],     // AP4C - h
    77: [180, 100],     // AP4C - i
    2203: [190, 100],   // FCAD - j
    2204: [200, 100],   // FCAD - k
    9990: [210, 100],   // IBAC - l (IBAC-IBAC), pseudo device_id
    78: [220, 100],     // AP4C - m
    79: [230, 100],     // AP4C - n
    123: [240, 100],    // MAB - o
    1147: [250, 100],   // IBAC - p
    2205: [260, 100],   // FCAD - q
    2206: [270, 100],   // FCAD - r
    1160: [280, 100],   // AP4C - s & w (same device_id used for both)
    1145: [290, 100],   // IBAC - t
    124: [300, 100],    // MAB - u
    1146: [310, 100],   // IBAC - v

    1170: [320, 100],   // AAM (81) - 1
    1169: [330, 100],   // AAM (85) - 2
    1172: [340, 100],   // ASB - 3
    1175: [350, 100],   // ASB - 4
    1176: [360, 100],   // ASB - 5
  };
  

// Gate label positions
const gatePositions = {
  northGate: [30, 412],
  southGate: [780, 412],
  eastGate: [388, 810],
  westGate: [388, 10],
};

// Return icon by sensor type and status
const getIconByStatus = (detector_type, status) => {
  const isActive = status === "Active";
  switch (detector_type) {
    case "Radiation": return isActive ? gRadiation : greyRadio;
    case "Chemical": return isActive ? gChemical : greyChemical;
    case "Biological": return isActive ? gBiological : greyBio;
    default: return isActive ? gRadiation : greyRadio;
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
          <img src="${imgUrl}" class="pin-img" style="filter: brightness(0) invert(1);" />
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

const FirstFloorMap = ({ sensorData = [] }) => {
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
      <ImageOverlay url="/LGF_map.png" bounds={imageBounds} />

      {/* Gate markers */}
      {Object.entries(gatePositions).map(([key, position]) => (
        <Marker
          key={key}
          position={position}
          icon={createGateIcon(key.replace(/([A-Z])/g, ' $1').toUpperCase())}
          interactive={false}
        />
      ))}

      {/* Sensor markers */}
      {sensorData.map((entry) => {
        const sensor = entry.s_no;
        const position = sensorPositions[sensor.device_id];
        if (!position) return null;

        const iconUrl = getIconByStatus(sensor.detector_type, sensor.status);
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

export default FirstFloorMap;
