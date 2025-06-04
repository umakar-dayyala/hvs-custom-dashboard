import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Sunburst from "sunburst-chart";
import * as d3 from "d3"; // Required to override transition globally
import "../css/sunburst.css";
 
const SunburstChart = ({ floorBasedData }) => {
    const chartRef = useRef(null);
    const centerTextRef = useRef(null);
 
    const floor = floorBasedData || {};
 
    const totalValue =
        (floor.activeSensors || 0) +
        (floor.inactiveSensors || 0) +
        (floor.disconnected_sensors || 0) +
        (floor.unhealthySensors || 0);
 
    const allValuesZero =
        (floor.activeSensors || 0) === 0 &&
        ((floor.inactiveSensors || 0) + (floor.disconnected_sensors || 0)) === 0 &&
        (floor.unhealthySensors || 0) === 0 &&
        (floor.active_alarms || 0) === 0 &&
        (floor.unhealthy_alarms || 0) === 0;
 
    const buildSunburstData = () => ({
        name: floor.floor || "Unknown Floor",
        children: [
            {
                name: "Healthy",
                value: floor.activeSensors || 0,
                children:
                    floor.active_alarms > 0
                        ? [{ name: "Active Alarms", value: floor.active_alarms }]
                        : [],
            },
            {
                name: "Inactive",
                value: (floor.inactiveSensors || 0) + (floor.disconnected_sensors || 0),
            },
            {
                name: "Unhealthy",
                value: floor.unhealthySensors || 0,
                children:
                    floor.unhealthy_alarms > 0
                        ? [{ name: "Unhealthy Alarms", value: floor.unhealthy_alarms }]
                        : [],
            },
        ],
    });
 
    useEffect(() => {
        if (!chartRef.current || allValuesZero) return;
 
        chartRef.current.innerHTML = "";
 
        // Safe local override to make transitions instant
        if (d3.selection.prototype.transition) {
            const originalTransition = d3.selection.prototype.transition;
            d3.selection.prototype.transition = function () {
                return originalTransition.call(this).duration(0);
            };
        }
 
        const data = buildSunburstData();
 
        const frame = requestAnimationFrame(() => {
            const chart = Sunburst()
                .data(data)
                .width(120)
                .height(120)
            
                .label((d) => {
    if (d.name === "Healthy") return ` ${d.value}`;
    if (d.name === "Inactive") return `${d.value}`;
    if (d.name === "Unhealthy") return ` ${d.value}`;
    if (d.name === "Active Alarms") return ` ${d.value}`;
    if (d.name === "Unhealthy Alarms") return ` ${d.value}`;
    return "";
})
                
                .tooltipContent(() => "")
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
            if (chartRef.current) {
                chartRef.current.innerHTML = "";
            }
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