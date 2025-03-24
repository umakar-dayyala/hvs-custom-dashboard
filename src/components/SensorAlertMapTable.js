import React from "react";
import { HvTypography } from "@hitachivantara/uikit-react-core";
import { Box } from "@mui/material";
import RadiationIcon from "../assets/rRadiological.svg";
import BioIcon from "../assets/rBiological.svg";
import ChemicalIcon from "../assets/rChemical.svg";

const SensorAlertTable = ({ sensorsData,title }) => {
    const sensorTypeIcons = {
        Radiation: RadiationIcon,
        Biological: BioIcon,
        Chemical: ChemicalIcon,
    };

    const validSensorsData = Array.isArray(sensorsData) ? sensorsData : [];
    // Group sensors by zone -> location -> sensors
    const groupedData = validSensorsData.reduce((acc, item) => {
        const { zone, location, detector, alarms_and_alerts, detector_type } = item.s_no;

        if (!acc[zone]) acc[zone] = {};
        if (!acc[zone][location]) acc[zone][location] = [];

        acc[zone][location].push({
            sensor: detector,
            alarmCount: alarms_and_alerts,
            sensorType: detector_type,
        });

        return acc;
    }, {});

    return (
        <div style={{ overflowX: "auto", padding: "1rem" }}>
            {/* Table Title */}
            <HvTypography variant="title3" style={{ textAlign: "center", marginBottom: "1rem" }}>
                {title}
            </HvTypography>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={headerStyle}>Zone</th>
                        <th style={headerStyle}>Location</th>
                        <th style={headerStyle}>Sensor</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedData).map(([zone, locations]) =>
                        Object.entries(locations).map(([location, sensors], locIndex) =>
                            sensors.length > 0 ? (
                                sensors.map((sensor, sensorIndex) => (
                                    <tr key={`${zone}-${location}-${sensor.sensor}-${sensorIndex}`}>
                                        {/* Zone Cell - spans all locations and sensors */}
                                        {locIndex === 0 && sensorIndex === 0 && (
                                            <td rowSpan={Object.values(locations).flat().length} style={cellStyle}>
                                                <HvTypography variant="title4">{zone}</HvTypography>
                                            </td>
                                        )}
                                        {/* Location Cell - spans all sensors in the same location */}
                                        {sensorIndex === 0 && (
                                            <td rowSpan={sensors.length} style={cellStyle}>
                                                <HvTypography variant="title4">{location}</HvTypography>
                                            </td>
                                        )}
                                        {/* Sensor Cell - colored based on alarm status */}
                                        <td
                                            style={{
                                                ...cellStyle,
                                                backgroundColor: sensor.alarmCount > 0 ? "red" : "#29991d",
                                                color: "#fff",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "0.5rem",
                                                    padding: "0.5rem",
                                                }}
                                            >
                                                {/* Sensor Icon */}
                                                {sensorTypeIcons[sensor.sensorType] && (
                                                    <img
                                                        src={sensorTypeIcons[sensor.sensorType]}
                                                        alt={sensor.sensorType}
                                                        style={{
                                                            width: "24px",
                                                            height: "24px",
                                                            filter: "brightness(0) invert(1)", // Makes the icon white
                                                        }}
                                                    />
                                                )}
                                                {/* Sensor Name (Bigger Size) */}
                                                <HvTypography variant="title4">{sensor.sensor}</HvTypography>
                                            </Box>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr key={`${zone}-${location}`}>
                                    {/* Zone Cell */}
                                    {locIndex === 0 && (
                                        <td rowSpan={Object.keys(locations).length} style={cellStyle}>
                                            <HvTypography variant="title4">{zone}</HvTypography>
                                        </td>
                                    )}
                                    {/* Location Cell */}
                                    <td style={cellStyle}>
                                        <HvTypography variant="body">{location}</HvTypography>
                                    </td>
                                    {/* Empty Sensor Cell */}
                                    <td style={emptyCellStyle}></td>
                                </tr>
                            )
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Styles
const headerStyle = {
    background: "#333",
    color: "white",
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
};

const cellStyle = {
    padding: "10px",
    border: "1px solid #ccc",
};

const emptyCellStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
};

export default SensorAlertTable;
