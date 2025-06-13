import React, { useEffect, useRef } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import Plot from "react-plotly.js";
import centralvista from "../assets/new_centravista.png";

// Image dimensions and bounds
const imageWidth = 1000;
const imageHeight = 1000;
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Center the map
const CenterMap = () => {
  const map = useMap();
  map.setView([imageHeight / 2, imageWidth / 2], 0);
  return null;
};

// Plotly chart component
const WindRoseOverlay = ({ data = [], position = [250, 750] }) => {
  const map = useMap();
  const plotRef = useRef();

  // Convert Leaflet coordinates to pixel position
  useEffect(() => {
    if (plotRef.current) {
      const point = map.latLngToContainerPoint([position[0], position[1]]);
      plotRef.current.style.left = `${point.x - 250}px`; // Center chart (500/2)
      plotRef.current.style.top = `${point.y - 250}px`; // Center chart
    }
  }, [map, position]);

  // Wind rose data processing
  const safe = data.length
    ? data
    : [
        { direction: "N", speed: 0 },
        { direction: "NE", speed: 0 },
        { direction: "E", speed: 0 },
        { direction: "SE", speed: 0 },
        { direction: "S", speed: 0 },
        { direction: "SW", speed: 0 },
        { direction: "W", speed: 0 },
        { direction: "NW", speed: 0 },
      ];

  const directions = safe.map((d) => d.direction);
  const speeds = safe.map((d) => d.speed);

  return (
    <div
      ref={plotRef}
      style={{
        position: "absolute",
        width: "500px", // Half image size
        height: "500px",
        zIndex: 1000, // Above map
      }}
    >
      <Plot
        data={[
          {
            type: "barpolar",
            r: speeds,
            theta: directions,
            marker: { color: "rgb(26,193,230)", opacity: 0.7 },
            opacity: 0.8,
          },
        ]}
        layout={{
          font: { size: 12, color: "black" },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          polar: {
            bgcolor: "rgba(0,0,0,0)",
            radialaxis: {
              visible: true,
              range: [0, Math.max(...speeds, 1)],
              gridcolor: "rgba(0,0,0,0.7)",
              gridwidth: 1.5,
              linecolor: "rgba(0,0,0,0.7)",
              tickfont: { color: "black", size: 10 },
            },
            angularaxis: {
              direction: "clockwise",
              gridcolor: "rgba(0,0,0,0.7)",
              gridwidth: 1.5,
              linecolor: "rgba(0,0,0,0.7)",
              tickfont: { color: "black", size: 10 },
            },
          },
          margin: { t: 20, l: 20, r: 20, b: 20 },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

const WindRoseLeaflet = ({ data = [] }) => {
  return (
    <div
      style={{
        height: "95vh", // Match previous HvCard height
        width: "100%",
        padding: "20px", // Margins around map
        background: "white",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxZoom={1}
        minZoom={-4}
        style={{ height: "100%", width: "100%" }}
      >
        <CenterMap />
        <ImageOverlay url={centralvista} bounds={bounds} opacity={0.3} />
        <WindRoseOverlay
          data={data}
          position={[250, 750]} // Bottom-right
          // Other positions:
          // Top-Left: [750, 250]
          // Top-Right: [750, 750]
          // Bottom-Left: [250, 250]
          // Center: [500, 500]
        />
      </MapContainer>
    </div>
  );
};

export default WindRoseLeaflet;