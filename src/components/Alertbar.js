import React from "react";
import {
    HvTypography,
    HvContainer,
    HvTooltip,
} from "@hitachivantara/uikit-react-core";
import { RiAlertLine, RiMapPinLine, RiTimeLine } from "react-icons/ri"; // Using React Icons (Remix Icons)

const Alertbar = ({ alerts }) => {
    return (
        <>
            {alerts.map((status, index) => (
                <HvContainer
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        marginBottom: "5px", // Adds spacing between multiple alerts
                    }}
                >
                    {status.alarmCount > 0 && (
                        <HvTooltip title="Alarm Active">
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <HvTypography variant="title3">Detected :</HvTypography>
                                    <RiAlertLine size={18} />
                                    <HvTypography variant="title3">{`${status.alarmCount} ${status.alarmType}`}</HvTypography>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <RiMapPinLine size={18} />
                                    <HvTypography variant="title3">{status.location}</HvTypography>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <RiTimeLine size={18} />
                                    <HvTypography variant="title3">{status.timeRange}</HvTypography>
                                </div>
                            </div>
                        </HvTooltip>
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <HvTypography variant="title3" style={{ color: "green" }}>● Normal</HvTypography>
                            <HvTypography variant="title3" style={{ color: "orange" }}>● Medium</HvTypography>
                            <HvTypography variant="title3" style={{ color: "red" }}>● High</HvTypography>
                        </div>
                        <HvTypography
                            variant="title3"
                            style={{ cursor: "pointer", color: "#0073e6", textDecoration: "underline" }}
                        >
                            Last Week
                        </HvTypography>
                        <HvTypography
                            variant="title3"
                            style={{ cursor: "pointer", color: "#0073e6", textDecoration: "underline" }}
                        >
                            Yesterday
                        </HvTypography>
                    </div>
                </HvContainer>
            ))}
        </>
    );
};

export default Alertbar;
