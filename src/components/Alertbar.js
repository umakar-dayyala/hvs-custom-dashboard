import React from "react";
import { HvTypography } from "@hitachivantara/uikit-react-core";

const Alertbar = () => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <HvTypography variant="label">
          <span style={{ color: "green",  fontSize:"20px"}}>●</span> Normal
        </HvTypography>
        <HvTypography variant="label">
          <span style={{ color: "orange",fontSize:"20px" }}>●</span> Health & Analytics Alert
        </HvTypography>
        <HvTypography variant="label">
          <span style={{ color: "red",fontSize:"20px" }}>●</span> CBRN Alarm
        </HvTypography>
      </div>
    </div>
  );
};

export default Alertbar;
