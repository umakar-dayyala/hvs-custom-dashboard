import { HvCard } from "@hitachivantara/uikit-react-core";
import React from "react";
import Plot from "react-plotly.js";
import centralvista from "../assets/new_centravista.png";

/**
 * @param {Object[]}  data  array like [{ direction:"N", speed: 12 }, …]
 *                         – pass dirData from Weatherv2
 */
const WindRoseChart = ({ data = [] }) => {
  /* fall back to zeros if nothing yet */
  const safe = data.length ? data : [
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
  const speeds     = safe.map((d) => d.speed);

  return (
    <HvCard
      bgcolor="white"
      style={{
        borderRadius: 0,
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        height: "60vh",
        width: "100%",
      }}
    >
      <Plot
        config={{ responsive: true, displayModeBar: false }}
        data={[
          {
            type: "barpolar",
            r: speeds,
            theta: directions,
            marker: { color: "rgb(26,193,230)", opacity: 0.6 },
            opacity: 0.7,
          },
        ]}
        layout={{
          title: "Wind Direction (Windrose Chart)",
          font: { size: 26, color: "black" },
          images: [
            {
              source: centralvista,
              xref: "x domain",
              yref: "y domain",
              x: 0.5,
              y: 0.5,
              sizex: 1,
              sizey: 1,
              xanchor: "center",
              yanchor: "middle",
              layer: "below",
              opacity: 0.6,
            },
          ],
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
              tickfont: { color: "black" },
            },
            angularaxis: {
              direction: "clockwise",
              gridcolor: "rgba(0,0,0,0.7)",
              gridwidth: 1.5,
              linecolor: "rgba(0,0,0,0.7)",
              tickfont: { color: "black" },
            },
          },
          margin: { t: 50, l: 40, r: 40, b: 40 },
          showlegend: false,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </HvCard>
  );
};

export default WindRoseChart;
