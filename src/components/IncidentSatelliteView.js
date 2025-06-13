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

import { routeName } from "../utils/RouteUtils";

const imageBounds = [[0, 0], [1600, 1298]];

// Sensor positions
const sensorPositions = {
  1168: [714, 987],   // 3 Done 
  49: [640, 804],     // 4 Done
  1159: [631, 802],   // 5 Done
  15: [662, 870],     // 6 Done
  16: [777, 944],     // 7 Done
  81: [793, 936],     // 8 Done
  2186: [801, 932],   // 9 Done
  3: [875, 927],      // 10 Done
  65: [866, 922],     // 11 Done
  146: [868, 923],    // 12 Done
  2187: [862, 917],   // 13 Done
  33: [882, 921],     // 14 Done
  145: [878, 911],    // 15 Done
  34: [1052, 794],     // 16 Done
  53: [1050, 800],     // 17 Done
  113: [1050, 799],    // 18 Done
  1171: [1050, 797],   // 19 Done
  35: [1052, 788],     // 20 Done
  2188: [1050, 782],   // 21 Done
  66: [1049, 783],     // 22 Done
  2189: [937, 717],   // 23  Done
  36: [877, 666],     // 24  Done
  2190: [879, 667],   // 25  Done 
  90: [876, 669],     // 26  Done
  67: [875, 672],     // 27  Done
  37: [873, 663],     // 28  Done
  50: [868, 667],     // 29  Done
  2191: [806, 649],   // 30  Done
  2192: [658, 723],   // 31  Done 
  38: [630, 787],     // 32  Done
  3184: [697, 912],    // 33 Done
  3185: [703, 917],   // 34 Done 
  68: [707, 921],     // 35 Done
  3183: [695, 678],   // 36 Done
  3186: [700, 675],   // 37 Done
  69: [702, 669],     // 38 Done
  1: [572, 523],      // 111 Done
  2183: [517, 1110],  // 112 Done
  2184: [12, 1427],   // 114 Done
  18: [427, 1276],    // 115 Done 
  17: [18, 1433],     // 113 Done
  2185: [457, 1262],  // 116 Done
  129: [208, 530],   // 117  Done
  138: [417, 1370],    // 118 Done
  2193: [661, 863],   // 39 Done
  2194: [680, 806],     // 40 Done
  2195: [785, 947],   // 41  Done
  51: [788, 945],    // 42 Done
  2196: [934, 863],   // 43 Done
  2197: [935, 722],   // 44 Done
  2198: [659, 726],    // 45 Done
  2199: [840, 894],   // 46 Done
  70: [681, 931],   // 47 Done
  39: [837, 888],    // 48 Done
  2200: [845, 688],   // 49 Done
  2201: [679, 783],   // 50 Done
  71: [682, 653],    // 51 Done
  40: [840, 696],   // 52 Done
  72: [653, 865],   // 53 Done
  2202: [787, 950],    // 54 Done
  73: [790, 947],   // 55 Done
  74: [946, 864],   // 56 Done
  1148: [949, 859],    // 57 Done
  2203: [947, 724],   // 58 Done
  75: [949, 723],   // 59 Done
  122: [946, 723],    // 60 Done
  1172: [948, 722],   // 61 Done
  // 62 not live
  76: [785, 638],   // 63 Done
  2204: [649, 728],    // 64 Done
  77: [652, 727],   // 65 Done
  //66 not live
  2205: [740, 815], // 67 Done
  78: [737, 813],   // 68 Done
  79: [715, 807],   // 69 Done
  1147: [738, 815], // 70 Done
  7: [715, 810],    // 71 Done
  123: [738, 814],   // 72 Done
  1175: [738, 813],   // 73 Done
  1169: [728, 813],   // 74 Done
  2206: [739, 761],    // 75 not live Done
  80: [737, 759],   // 76 Done
  1160: [738, 773],   // 77  Done
  1145: [741, 765],    // 78 Done
  1146: [736, 774],   // 79 Done
  124: [736, 758],   // 80 Done
  1176: [738, 760],   // 81 Done
  1170: [679, 776],   // 82 Done 
  2207: [781, 535],    // 83 Done
  1161: [778, 547],   // 84 Done
  125: [780, 548],   // 85 Done
  1177: [781, 548],   // 86 Done
  57: [788, 535],   // 87 Done
  41: [776, 543],    // 88 Done
  42: [784, 536],   // 89 Done
  2208: [1063, 683],   // 90 Done
  1164: [1070, 686],   // 91 Done
  126: [1060, 697],   // 92 Done
  1178: [1063, 697],    // 93 Done
  5: [1069, 684],   // 94 Done
  43: [1064, 693],   // 95 Done
  44: [1060, 691],   // 96 Done
  2209: [819, 1013],    // 97 Done
  1165: [824, 1018],   // 98 Done
  127: [823, 1010],   // 99 Done
  1179: [822, 1010],   // 100 Done
  1149: [819, 1012],   // 101 Done
  45: [824, 1024],    // 102 Done
  46: [823, 1018],   // 103 Done
  2210: [1062, 882],   // 104 Done
  1166: [1064, 892],   // 105 Done
  128: [1070, 894],   // 106 Done
  1189: [1071, 894],    // 107 Done
  52: [1066, 880],   // 108 Done
  47: [1062, 886],   // 109 Done
  48: [1068, 885],   // 110 Done
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


const IncidentSatelliteView = ({ sensorData = [] }) => {
  // console.log("IncidentMap Opened: ");
  // console.log("Sensor Data:", sensorData);
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

        <ImageOverlay url={`${process.env.REACT_APP_IMAGE_URL}img_incidentSatelliteView.jpg`} bounds={imageBounds} />


        {/* Sensor markers */}
        {Array.isArray(sensorData) && sensorData.map((entry) => {
          const sensor = entry.s_no;
          const position = sensorPositions[sensor.device_id];
          if (!position) return null;

          const iconUrl = getIconByStatus(sensor.detector_type, sensor.status, sensor.detector);
          const icon = createPinIcon(iconUrl, sensor.status, sensor.alarm_status);
          // console.log("Sensor Data:", sensor.device_id, sensor.detector, position);

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

export default IncidentSatelliteView;
