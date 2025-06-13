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

// Center the map
const CenterMap = () => {
  const map = useMap();
  map.setView([imageHeight / 2, imageWidth / 2], 0);
  return null;
};

// Custom Leaflet Layer for Plotly Wind Rose
const WindRoseLayer = ({ data = [], position = [150, 190] }) => {
  const map = useMap();
  const layerRef = useRef(null);
  const containerRef = useRef(null);

  // Base size of the chart at zoom level 0
  const baseSize = 300;

  useEffect(() => {
    // Create a custom Leaflet layer
    layerRef.current = L.Layer.extend({
      onAdd: function (map) {
        // Create container div for Plotly
        containerRef.current = L.DomUtil.create("div", "wind-rose-container");
        containerRef.current.style.position = "absolute";
        containerRef.current.style.zIndex = 1000;

        // Add to map's overlay pane
        map.getPanes().overlayPane.appendChild(containerRef.current);

        // Initialize Plotly chart
        renderPlotlyChart();

        // Update position and size on map move/zoom
        map.on("moveend zoomend", updatePositionAndSize);
        updatePositionAndSize();
      },

      onRemove: function (map) {
        // Clean up
        map.off("moveend zoomend", updatePositionAndSize);
        if (containerRef.current) {
          L.DomUtil.remove(containerRef.current);
          containerRef.current = null;
        }
      },
    });

    // Instantiate and add layer to map
    const layer = new layerRef.current();
    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, position, data]);

  // Function to render/update Plotly chart
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

  // Update chart position and size based on map's LatLng and zoom
  const updatePositionAndSize = () => {
    if (!containerRef.current) return;

    // Calculate scale based on zoom level
    const zoom = map.getZoom();
    const scale = Math.pow(2, zoom); // Leaflet's zoom is exponential (2^zoom)
    const scaledSize = baseSize * scale;

    // Update container size
    containerRef.current.style.width = `${scaledSize}px`;
    containerRef.current.style.height = `${scaledSize}px`;

    // Update Plotly chart size
    Plotly.relayout(containerRef.current, {
      width: scaledSize,
      height: scaledSize,
    });

    // Update position
    const point = map.latLngToLayerPoint(L.latLng(position));
    // Adjust for chart center
    const adjustedPoint = {
      x: point.x - scaledSize / 2,
      y: point.y - scaledSize / 2,
    };
    L.DomUtil.setPosition(containerRef.current, adjustedPoint);
  };

  return null;
};

const WindRoseLeaflet = ({ data = [] }) => {
  // Extract device_id from URL
  const queryParams = new URLSearchParams(window.location.search);
  const deviceId = parseInt(queryParams.get("device_id")) || 129; // Default to 117 if not found

  // Get position based on device_id
  const position = useMemo(() => {
    return positionMap[deviceId] || [150, 190]; // Default position if device_id not in map
  }, [deviceId]);

  return (
    <div
      style={{
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
    </div>
  );
};

export default WindRoseLeaflet;