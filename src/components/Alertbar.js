import React from "react";
import {
    HvTypography,
} from "@hitachivantara/uikit-react-core";


const Alertbar = () => {
    return (
        <>
                    <div style={{ display: "flex", justifyContent:"flex-end", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <HvTypography variant="label" style={{ color: "green" }}>● Normal</HvTypography>
                            <HvTypography variant="label" style={{ color: "orange" }}>● Health & Analytics Alert</HvTypography>
                            <HvTypography variant="label" style={{ color: "red" }}>● CBRN Alarm</HvTypography>
                        </div>
                        </div>
                       
                
        </>
    );
};


export default Alertbar;
