import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Sunburst from "sunburst-chart";
import * as d3 from "d3";
import "../css/sunburst.css";

// ✅ Disable all D3 transitions globally
let d3TransitionOverridden = false;

if (!d3TransitionOverridden) {
  d3TransitionOverridden = true;

  const originalTransition = d3.selection.prototype.transition;
  d3.selection.prototype.transition = function (...args) {
    try {
      const t = originalTransition.call(this, ...args);
      return t.duration(0);
    } catch (err) {
      console.warn("Transition override failed:", err);
      return this;
    }
  };
}

const SunburstChart = ({ floorBasedData }) => {
  const chartRef = useRef(null);
  const centerTextRef = useRef(null);

  const floor = floorBasedData || {};

  const safeValue = (val) => (typeof val === "number" ? val : 0);

  const totalValue =
    safeValue(floor.activeSensors) +
    safeValue(floor.inactiveSensors) +
    safeValue(floor.disconnected_sensors) +
    safeValue(floor.unhealthySensors);

  const allValuesZero =
    safeValue(floor.activeSensors) === 0 &&
    safeValue(floor.inactiveSensors) + safeValue(floor.disconnected_sensors) === 0 &&
    safeValue(floor.unhealthySensors) === 0 &&
    safeValue(floor.active_alarms) === 0 &&
    safeValue(floor.unhealthy_alarms) === 0;

  const buildSunburstData = () => ({
    name: floor.floor?.toString() || "Unknown Floor",
    children: [
      {
        name: "Healthy",
        value: safeValue(floor.activeSensors),
        children:
          safeValue(floor.active_alarms) > 0
            ? [{ name: "Active Alarms", value: safeValue(floor.active_alarms) }]
            : [],
      },
      {
        name: "Inactive",
        value: safeValue(floor.inactiveSensors) + safeValue(floor.disconnected_sensors),
      },
      {
        name: "Unhealthy",
        value: safeValue(floor.unhealthySensors),
        children:
          safeValue(floor.unhealthy_alarms) > 0
            ? [{ name: "Unhealthy Alarms", value: safeValue(floor.unhealthy_alarms) }]
            : [],
      },
    ],
  });

  useEffect(() => {
    if (!chartRef.current || allValuesZero) return;

    chartRef.current.innerHTML = "";

    const data = buildSunburstData();

    const frame = requestAnimationFrame(() => {
      const chart = Sunburst()
        .data(data)
        .width(120)
        .height(120)
        .label((d) => ( ""))

        .onClick(() => null)
        .onHover((node) => {
          if (centerTextRef.current) {
            if (node && node.name !== floor.floor) {
              centerTextRef.current.textContent = `${node.name}: ${node.value}`;
            } else {
              centerTextRef.current.textContent = `Total: ${totalValue}`;
            }
          }
        })
        .color((d) => {
          if (d.name === floor.floor) return "rgba(255, 255, 255, 0.1)";
          if (d.name === "Healthy") return "#29991d";
          if (d.name === "Inactive") return "RGB(128, 128,128)";
          if (d.name === "Unhealthy") return "#ff9933";
          if (d.name === "Active Alarms" || d.name === "Unhealthy Alarms") return "#E30613";
          return "rgba(0, 0, 0, 0.1)";
        });

      chart(chartRef.current);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (chartRef.current) chartRef.current.innerHTML = "";
    };
  }, [floor]);

  return (
    <Box mt={2} display="flex" justifyContent="center" position="relative">
      {allValuesZero ? (
        <Box textAlign="center">No data available to display</Box>
      ) : (
        <Box position="relative" width={120} height={120}>
          <div ref={chartRef} />
          <Box
            ref={centerTextRef}
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: "translate(-50%, -50%)",
              fontSize: "14px",
              fontWeight: "bold",
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            {`Total: ${totalValue}`}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SunburstChart;
