import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import Plotly from "plotly.js-dist-min";
import centralvista from "../assets/new_centravista.png";

// Image dimensions and bounds
const imageWidth = 1000;
const imageHeight = 780;
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Position mapping based on device_id
const positionMap = {
  138: [650, 390],
  129: [120, 190],
};

const CenterMap = () => {
  const map = useMap();
  const didInitialCenter = useRef(false);

  useEffect(() => {
    if (!didInitialCenter.current) {
      map.setView([imageHeight / 2, imageWidth / 2], 0);
      didInitialCenter.current = true;
    }
  }, [map]);

  return null;
};


// Custom Leaflet Layer for Plotly Wind Rose
const WindRoseLayer = ({ data = [], position = [150, 190] }) => {
  const map = useMap();
  const layerRef = useRef(null);
  const containerRef = useRef(null);

  const baseSize = 300;

  useEffect(() => {
    layerRef.current = L.Layer.extend({
      onAdd: function (map) {
        containerRef.current = L.DomUtil.create("div", "wind-rose-container");
        containerRef.current.style.position = "absolute";
        containerRef.current.style.zIndex = 1000;

        map.getPanes().overlayPane.appendChild(containerRef.current);
        renderPlotlyChart();

        map.on("moveend zoomend", updatePositionAndSize);
        updatePositionAndSize();
      },

      onRemove: function (map) {
        map.off("moveend zoomend", updatePositionAndSize);
        if (containerRef.current) {
          L.DomUtil.remove(containerRef.current);
          containerRef.current = null;
        }
      },
    });

    const layer = new layerRef.current();
    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, position, data]);

  const renderPlotlyChart = () => {
    if (!containerRef.current) return;

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

    Plotly.newPlot(
      containerRef.current,
      [
        {
          type: "barpolar",
          r: speeds,
          theta: directions,
          marker: { color: "rgb(26,193,230)", opacity: 0.7 },
          opacity: 0.8,
        },
      ],
      {
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
      },
      { responsive: true, displayModeBar: false }
    );
  };

  const updatePositionAndSize = () => {
    if (!containerRef.current) return;

    const zoom = map.getZoom();
    const scale = Math.pow(2, zoom);
    const scaledSize = baseSize * scale;

    containerRef.current.style.width = `${scaledSize}px`;
    containerRef.current.style.height = `${scaledSize}px`;

    Plotly.relayout(containerRef.current, {
      width: scaledSize,
      height: scaledSize,
    });

    const point = map.latLngToLayerPoint(L.latLng(position));
    const adjustedPoint = {
      x: point.x - scaledSize / 2,
      y: point.y - scaledSize / 2,
    };
    L.DomUtil.setPosition(containerRef.current, adjustedPoint);
  };

  return null;
};

// 🔧 Utility: max speed
const getMaxSpeed = (windData) => {
  if (!windData?.length) return "—";
  return Math.max(...windData.map((d) => parseFloat(d.speed) || 0)).toFixed(2);
};

// 🔧 Utility: dominant direction
const getDominantDirection = (windData) => {
  if (!windData?.length) return "—";
  const sorted = [...windData].sort(
    (a, b) => (parseFloat(b.speed) || 0) - (parseFloat(a.speed) || 0)
  );
  return sorted[0]?.direction || "—";
};

const WindRoseLeaflet = ({ data = [] }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const deviceId = parseInt(queryParams.get("device_id")) || 129;

  const position = useMemo(() => {
    return positionMap[deviceId] || [150, 190];
  }, [deviceId]);

  return (
    <div
      style={{
        position: "relative",
        height: "95vh",
        width: "100%",
        padding: "20px",
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
        <ImageOverlay url={centralvista} bounds={bounds} opacity={0.9} />
        <WindRoseLayer data={data} position={position} />
      </MapContainer>

      {/* Top-right Wind Info Box */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 40,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
          fontSize: "14px",
          color: "#000",
        }}
      >
        <div><strong>Wind Speed:</strong> {getMaxSpeed(data)} m/s</div>
        <div><strong>Direction:</strong> {getDominantDirection(data)}</div>
      </div>
    </div>
  );
};

export default WindRoseLeaflet;
