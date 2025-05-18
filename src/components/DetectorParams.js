import React, { useState, forwardRef, useImperativeHandle } from "react";
import { paramCatalog } from "../utils/paramCatalog";
import "../css/DetectorParams.css";   // keep your existing CSS

/* Expose getPayload() to parent via ref */
const DetectorParams = forwardRef((_, ref) => {
  const [draft, setDraft] = useState({});          // { id: newValue }

  /* public method for parent */
  useImperativeHandle(ref, () => ({
    getPayload: () => draft
  }));

  const handleChange = (id, value) =>
    setDraft((prev) => ({ ...prev, [id]: value }));

  return (
    <div className="param-container">
      <div className="header-row-config">
        <div></div><div>Current</div><div>New</div>
        <div></div><div>Current</div><div>New</div>
      </div>

      {paramCatalog.map(({ id, label }) => (
        <React.Fragment key={id}>
          <div className="label">{label}</div>

          {/* TODO: plug real current value here */}
          <input type="text"  disabled
          style={{ border: "2px solid black" }}/>

          <input
            type="text"
            style={{ border: "2px solid black" }}
            onChange={(e) => handleChange(id, e.target.value)}
          />
        </React.Fragment>
      ))}
    </div>
  );
});

export default DetectorParams;
