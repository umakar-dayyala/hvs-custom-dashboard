import { useState } from "react";
import "../css/ToggleButton.css"; // Keeping CSS
import { HvTypography } from "@hitachivantara/uikit-react-core";

const ToggleButtons = ({ onToggleChange, currentRole }) => {
  return (
    <div className="toggle-container">
      <button
        className={`toggle-button ${currentRole === "Operator" ? "active" : ""}`}
        onClick={() => onToggleChange("Operator")}
      >
        <HvTypography>Enable Analytics</HvTypography>
      </button>
      <button
        className={`toggle-button ${currentRole === "Supervisor" ? "active" : ""}`}
        onClick={() => onToggleChange("Supervisor")}
      >
        <HvTypography>Disable Analytics</HvTypography>
      </button>
    </div>
  );
};

export default ToggleButtons;
