import React from "react";
import { HvLoading } from "@hitachivantara/uikit-react-core";
import "../css/Loader.css"; // Import external CSS

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="loader-container">
      <HvLoading className="large-thick-loader" />

      {/* Loading text with reduced gap */}
      <span className="loader-text">{label}</span>
    </div>
  );
};

export default Loader;
