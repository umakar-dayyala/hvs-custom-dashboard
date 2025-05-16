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

import gChemical from "../assets/gChemical.svg"; // Active - Chemical
import gBiological from "../assets/gBiological.svg"; // Active - Bio
import gRadiation from "../assets/gRadiological.svg"; // Active - Rad

import greyBio from "../assets/greyBio.svg"; // Inactive - Bio
import greyChemical from "../assets/greyChem.svg"; // Inactive - Chem
import greyRadio from "../assets/greyRadio.svg"; // Inactive - Rad

import { routeName } from "../utils/RouteUtils"; // Route mapping


const imageBounds = [[0, 0], [775, 825]]; // [height, width]

// Final positions mapped from zoomed image:
const sensorPositions = {
  1159: [395, 113],  // PRM - 1 //DONE
  49:  [400, 123],   // AGM - 2 //DONE
  15: [533, 163],   // FCAD - 3 //DONE
  3: [598, 492],    // PRM - 4 //Done
  146: [598, 486],  // IBAC - 5 //Done
  65: [592, 481],    // AP4C - 6 //Done
  2187:[588, 478], // FCAD - 7 //Done
  2186: [620, 373], // FCAD - 8 //Done
  33: [585, 502],   // PRM - a //Done
  34: [352, 755],   // PRM - b //Done
  53: [359, 745],  // AGM - c //Done
  113: [350, 745],  // MAB - d //Done
  145: [580, 499],  // AGM - e //Done
  35: [340, 755],    // PRM - f //Done
  66: [340, 745],   // AP4C - g //Done
  2188: [330, 745], // FCAD - h //Done
  2189: [245, 565], // FCAD - i //Done
  36: [135, 457],   // PRM - j //Done
  2190: [139, 463], // FCAD - k //Done
  90: [146, 470],   // IBAC - l //Done
  67: [156, 466],    // AP4C - m
  37: [140, 450],   // PRM - n //Done
  50: [146, 445],  // AGM - o //Done
  2191: [117, 322],  // FCAD - p //Done
  38: [379, 113],   // PRM - q //Done
  2192: [233, 140], // FCAD - r //Done
  69: [185, 207],   // AP4C - s //Done
  3183: [190, 211], // FCAD - t //Done
  68: [605, 263],   // AP4C - u //Done
};


// Get icon by sensor type and status
const getIconByStatus = (detector_type, status) => {
  const isActive = status === "Active";
  switch (detector_type) {
    case "Radiation": return isActive ? gRadiation : greyRadio;
    case "Chemical": return isActive ? gChemical : greyChemical;
    case "Biological": return isActive ? gBiological : greyBio;
    default: return isActive ? gRadiation : greyRadio;
  }
};

// Generate styled pin icon
const createPinIcon = (imgUrl, status, alarm_status) => {
  // const backgroundColor = status === "Active" ? "#4CAF50" : "#9E9E9E";
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
        backgroundColor = "rgb(128, 128, 128)";
        break;
      case "Disconnected":
        backgroundColor = "rgb(128, 128, 128)";
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
    iconSize: [0, 0], // Prevent scaling
    iconAnchor: [0, 0]
  });
};

// Main Map Component
const FloorPlanMap = ({ sensorData = [] }) => {
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
      <ImageOverlay url="/upperGroundFloor.png" bounds={imageBounds} />
      {sensorData.map((entry) => {
        const sensor = entry.s_no;
        const position = sensorPositions[sensor.device_id];
        if (!position) return null;

        const iconUrl = getIconByStatus(sensor.detector_type, sensor.status);
        const icon = createPinIcon(iconUrl, sensor.status, sensor.alarm_status);

        return (
          <Marker
            key={sensor.device_id}
            position={position}
            icon={icon}
          >
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
                <p><strong>Status: </strong>{sensor.status}</p>
                <p><strong>Zone :</strong> {sensor.zone}</p>
                <p><strong>Location :</strong> {sensor.location}</p>
                {/* <p>ID : {sensor.device_id}</p> */}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default FloorPlanMap;
