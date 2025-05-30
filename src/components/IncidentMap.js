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

const imageBounds = [[0, 0], [1600, 1298]];

// Sensor positions
const sensorPositions = {
  1168: [740, 300],   // 3
  49: [170, 420],     // 4
  1159: [150, 460],   // 5
  15: [662, 865],     // 6 //Done
  16: [270, 220],     // 7
  81: [310, 230],     // 8
  2186: [350, 240],   // 9
  3: [520, 260],      // 10
  65: [490, 240],     // 11
  146: [460, 220],    // 12
  2187: [500, 300],   // 13
  33: [560, 260],     // 14
  145: [590, 300],    // 15
  34: [850, 260],     // 16
  53: [810, 240],     // 17
  113: [780, 220],    // 18
  1171: [800, 280],   // 19
  35: [880, 300],     // 20
  2188: [860, 340],   // 21
  66: [800, 330],     // 22
  2189: [680, 440],   // 23
  36: [660, 500],     // 24
  2190: [640, 460],   // 25
  90: [620, 480],     // 26
  67: [600, 420],     // 27
  37: [620, 540],     // 28
  50: [600, 560],     // 29
  2191: [580, 600],   // 30
  2192: [360, 680],   // 31
  38: [300, 700],     // 32
  3184: [350, 430],   // 33
  3185: [400, 450],   // 34
  68: [440, 470],     // 35
  3183: [320, 550],   // 36
  3186: [370, 570],   // 37
  69: [420, 600],     // 38
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


const IncidentMap = ({ sensorData = [] }) => {
  console.log("IncidentMap Opened: ");
  console.log("Sensor Data:", sensorData);
  const navigate = useNavigate();

  const handleClick = (sensor) => {
    const route = routeName(sensor.detector);
    if (route) {
      navigate(`/${route}?device_id=${sensor.device_id}`);
    }
  };

  return (
    // <MapContainer
    //   crs={L.CRS.Simple}
    //   bounds={imageBounds}
    //   className="white-map-background"
    //   style={{ height: "90vh", width: "100%" }}
    //   zoom={0}
    //   minZoom={-2}
    //   maxZoom={2}
    // >
    <MapContainer
      crs={L.CRS.Simple}
      bounds={imageBounds}
      maxBounds={imageBounds} // Prevent panning outside image
      maxBoundsViscosity={1.0} // Strictly restrict bounds
      className="white-map-background"
      style={{ height: "90vh", width: "100%" }}
      zoom={0}
      minZoom={0} // Set to 0 to prevent zooming out beyond original size
      maxZoom={4} // Allow zooming in
    >

      <ImageOverlay url="/newParliment.jpg" bounds={imageBounds} />


      {/* Sensor markers */}
      {Array.isArray(sensorData) && sensorData.map((entry) => {
        const sensor = entry.s_no;
        const position = sensorPositions[sensor.device_id];
        if (!position) return null;

        const iconUrl = getIconByStatus(sensor.detector_type, sensor.status);
        const icon = createPinIcon(iconUrl, sensor.status, sensor.alarm_status);
        console.log("Sensor Data:", sensor.device_id, sensor.detector, position);

        return (
          
            <Marker key={sensor.device_id} position={[position[1], position[0]]} icon={icon}>
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

export default IncidentMap;
