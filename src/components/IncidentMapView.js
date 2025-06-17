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
import gOxygen from "../assets/gOxygen.svg";
import gWeather from "../assets/gWeather.svg";
import greyOxygen from "../assets/gyOxygen.svg";
import greyWeather from "../assets/gyWeather.svg";
import compassImg from "../assets/CompassIcon.png";
import { getMABDeviceId } from "../service/summaryServices";
import { routeName } from "../utils/RouteUtils";

const imageBounds = [[0, 0], [1600, 1298]];

// Sensor positions
const sensorPositions = {
  1168: [760, 730],   // 3  Done
  49: [694, 514],     // 4  Done
  1159: [683, 507],   // 5  Done
  15: [724, 609],     // 6  Done
  16: [822, 706],     // 7  Done
  81: [833, 698],     // 8  Done
  2186: [841, 694],   // 9  Done
  3: [919, 658],      // 10 Done
  65: [907, 654],     // 11 Done
  146: [912, 658],    // 12 Done 
  2187: [905, 654],   // 13 Done
  33: [922, 653],     // 14 Done
  145: [921, 650],    // 15 Done
  34: [1081, 489],     // 16 Done
  53: [1075, 495],     // 17 Done 
  113: [1073, 493],    // 18 Done
  1171: [1074, 490],   // 19 Done
  35: [1085, 480],     // 20 Done
  2188: [1079, 474],   // 21 Done
  66: [1077, 473],     // 22 Done 
  2189: [978, 400],   // 23 Done
  36: [932, 339],     // 24 Done
  2190: [928, 341],   // 25 Done 
  90: [918, 349],     // 26 Done  
  67: [913, 357],     // 27 Done
  37: [915, 332],     // 28 Done 
  50: [903, 344],     // 29 Done
  2191: [820, 298],   // 30 Done
  2192: [716, 390],   // 31 Done  
  38: [675, 499],     // 32 Done
  3184: [755, 640],   // 33 Done
  3185: [773, 658],   // 34 Done
  68: [792, 657],     // 35 Done
  3183: [754, 352],   // 36 Done
  3186: [770, 345],   // 37 Done
  69: [777, 333],     // 38 Done
  1: [613, 150],      // 111 Done
  2183: [592, 932],  // 112 Done
  2184: [25, 1526],   // 114 Done 
  18: [515, 1130],    // 115 Done  
  17: [80, 1525],     // 113 Done
  2185: [545, 1098],  // 116 Done 
  129: [247, 225],   // 117 Done  
  138: [495, 1308],    // 118 Done
  2193: [733, 585],   // 39 Done
  2194: [733, 525],     // 40 Done-1
  2195: [845, 690],   // 41  Done-1
  51: [850, 686],    // 42 Done-1
  2196: [983, 582],   // 43 Done-1
  2197: [993, 415],   // 44 Done-1
  2198: [709, 408],    // 45 Done-1
  2199: [900, 643],   // 46 Done-1
  70: [742, 680],   // 47 Done-1
  39: [896, 630],    // 48 Done-1
  2200: [888, 355],   // 49 Done-1
  2201: [729, 487],   // 50 Done-1
  71: [731, 334],    // 51 Done-1
  40: [881, 362],   // 52 Done-1
  72: [706, 599],   // 53 Done-1
  2202: [855, 695],    // 54 Done-1
  73: [855, 690],   // 55 Done-1
  74: [988, 584],   // 56 Done-1
  1148: [988, 580],    // 57 Done-1
  2203: [979, 396],   // 58 Done-1
  75: [982, 395],   // 59 Done-1
  122: [975, 395],    // 60 Done-1
  1172: [979, 394],   // 61 Done-1
  // 62 not live
  76: [836, 305],   // 63 Done-1
  2204: [706, 407],    // 64 Done-1
  77: [709, 404],   // 65 Done-1
  //66 not live
  2205: [816, 538],   // 67 Done-1
  78: [814, 538],    // 68 Done-1
  79: [779, 525],   // 69 Done-1
  1147: [810, 535],   // 70 Done-1
  7: [775, 525],    // 71 Done-1
  123: [809, 535],   // 72 Done-1
  1175: [809, 534],   // 73 Done-1
  1169: [795, 529],   // 74 Done-1
  2206: [786, 439],    // 75 not live Done
  80: [783, 433],   // 76 Done-1
  1160: [778, 479],   // 77  Done-1
  1145: [786, 440],    // 78 Done-1
  1146: [776, 479],   // 79 Done-1
  124: [782, 433],   // 80 Done
  1176: [785, 439],   // 81 Done
  1170: [736, 479],   // 82 Done 736, 774
  2207: [899, 188],    // 83 Done
  1161: [890, 221],   // 84 Done
  125: [893, 221],   // 85 Done
  1177: [895, 225],   // 86 Done
  57: [911, 199],   // 87 Done
  41: [890, 215],    // 88 Done
  42: [906, 204],   // 89 Done
  2208: [1097, 320],   // 90 Done
  1164: [1122, 328],   // 91 Done
  126: [1092, 348],   // 92 Done
  1178: [1094, 348],    // 93 Done
  5: [1122, 328],   // 94 Done
  43: [1105, 346],   // 95 Done
  44: [1090, 338],   // 96 Done
  2209: [850, 786],    // 97 Done
  1165: [850, 792],   // 98 Done
  127: [855, 786],   // 99 Done
  1179: [855, 784],   // 100 Done
  1149: [853, 784],   // 101 Done
  45: [858, 799],    // 102 Done
  46: [853, 799],   // 103 Done
  2210: [1085, 609],   // 104 Done
  1166: [1102, 633],   // 105 Done
  128: [1113, 633],   // 106 Done
  1189: [1116, 630],    // 107 Done
  52: [1098, 603],   // 108 Done
  47: [1095, 633],   // 109 Done
  48: [1101, 603],   // 110 Done

};



// Return icon by sensor type and status
const getIconByStatus = (detector_type, status, detector) => {
  const isActive = status === "Active";

  switch (detector_type) {
    case "Radiation": return isActive ? gRadiation : greyRadio;
    case "Chemical": return isActive ? gChemical : greyChemical;
    case "Biological": return isActive ? gBiological : greyBio;
    case "Generic":
      switch (detector) {
        case "Oxygen": return isActive ? gOxygen : greyOxygen;
        case "Weather": return isActive ? gWeather : greyWeather;
        default: return null;
      }
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


const IncidentMapView = ({ sensorData = [] }) => {
  console.log("IncidentMap Opened: ");
  console.log("Sensor Data:", sensorData);
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
    // <MapContainer
    //   crs={L.CRS.Simple}
    //   bounds={imageBounds}
    //   className="white-map-background"
    //   style={{ height: "90vh", width: "100%" }}
    //   zoom={0}
    //   minZoom={-2}
    //   maxZoom={2}
    // >
    <div style={{ position: "relative", width: "100%", height: "90vh" }}>
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

        <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}img_incidentmapview.png`} bounds={imageBounds} />


        {/* Sensor markers */}
        {Array.isArray(sensorData) && sensorData.map((entry) => {
          const sensor = entry.s_no;
          const position = sensorPositions[sensor.device_id];
          if (!position) return null;

          const iconUrl = getIconByStatus(sensor.detector_type, sensor.status, sensor.detector);
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

export default IncidentMapView;
