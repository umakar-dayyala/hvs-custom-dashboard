import React from "react";
import "../css/DetectorParams.css"; // Import your CSS file here

const labels = [
  ["Det 1 Stat", "Det 2 BG High"],
  ["Det 2 Stat", "Det 2 BG Low"],
  ["Det 1 BG High", "Det 2 Alarm"],
  ["Det 1 BG Low", "DATE TIME"],
  ["Det 1 Alarm"],
];

const AGMlabels = [
    ["Det 1 Stat", "Det 2 BG High"],
    ["Det 2 Stat"],
    
  ];

  const PRMlabels = [
    ["Det 1 Stat", "Det 2 BG High"],
    ["Det 2 Stat", "Det 2 BG Low"]
  ];

const DetectorParams = (sensor) => {
  return (
    <div className="param-container">
      <div className="header-row-config">
        <div></div>
        <div>Current Value</div>
        <div>New Value</div>
        <div></div>
        <div>Current Value</div>
        <div>New Value</div>
      </div>

      {labels.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((label, colIndex) => (
            <React.Fragment key={colIndex}>
              <div className="label">{label}</div>
              <input type="text" style={{border:"2px solid black"}}/>
              <input type="text" style={{border:"2px solid black"}} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}

     
    </div>
  );
};

export default DetectorParams;
