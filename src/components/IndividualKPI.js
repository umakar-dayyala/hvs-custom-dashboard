import React from "react";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const IndividualKPI = ({ kpiData }) => {
  const isAlarmActive = parseInt(kpiData.value) > 0;

  return (
    <HvCard
      style={{
        flex: 1,
        minWidth: "200px",
        marginTop: "2rem",
        backgroundColor: "white",
      }}
      statusColor={isAlarmActive ? "red" : "green"}
    >
      <HvCardHeader
        title={
          <HvTypography
            variant="title2"
            style={{ color: isAlarmActive ? "red" : "black" }}
          >
            {kpiData.title}
          </HvTypography>
        }
      />
      <HvCardContent>
        <HvTypography
          variant="title1"
          style={{ color: isAlarmActive ? "red" : "black" }}
        >
          {kpiData.value}
        </HvTypography>
      </HvCardContent>
    </HvCard>
  );
};

const KPIContainer = ({ bioicon, gbioicon, kpiData }) => {
  // Check if any KPI value is greater than 0
  const isAlarmActive = kpiData.some((kpi) => parseInt(kpi.value) > 0);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "end",
        justifyContent: "center",
      }}
    >
      <img
        src={isAlarmActive ? bioicon : gbioicon} // Conditionally render the image
        alt="Icon"
        style={{
          height: "8rem",
          objectFit: "contain",
        }}
      />
      {kpiData.map((kpi, index) => (
        <IndividualKPI key={index} kpiData={kpi} />
      ))}
    </div>
  );
};

export default KPIContainer;
