
import { HvTypography } from "@hitachivantara/uikit-react-core";
import "../css/SensorLegend.css"; // Import the CSS file

const SensorLegend = () => {
  const legends = [
    { color: "#29991D", label: "Healthy Sensor" },
    { color: "#FF9933", label: "Unhealthy Sensors" },
    { color: "#FF1F1F", label: "CBRN Alarms" },
  ];

  return (
    <div className="sensor-legend">
      {legends.map(({ color, label }, index) => (
        <div key={index} className="legend-item" >
          <span className="legend-circle" style={{ backgroundColor: color }}></span>
          <span className="legend-label"><HvTypography variant="title4">{label}</HvTypography></span>
        </div>
      ))}
    </div>
  );
};

export default SensorLegend;
