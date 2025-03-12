import { useState } from "react";
import "../css/ToggleButton.css"; // Import the CSS file
import { HvTypography } from "@hitachivantara/uikit-react-core";

const ToggleButtons = () => {
  const [active, setActive] = useState("Operator");

  return (
    <div className="toggle-container">
      <button
        className={`toggle-button ${active === "Operator" ? "active" : ""}`}
        onClick={() => setActive("Operator")}
      ><HvTypography>
        Operator
        </HvTypography>
      </button>
      <button
        className={`toggle-button ${active === "Supervisor" ? "active" : ""}`}
        onClick={() => setActive("Supervisor")}
      ><HvTypography>Supervisor</HvTypography>
        
      </button>
    </div>
  );
};

export default ToggleButtons;
