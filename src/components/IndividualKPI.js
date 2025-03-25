import React from "react";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const IndividualKPI = ({ kpiData, rbell, amberBell, greenBell }) => {
  if (!kpiData) return null;

  // Determine bell icon based on value and title
  const bellIcon =
    kpiData.value === "No Data"
      ? null
      : parseInt(kpiData.value) === 0
      ? greenBell
      : ["Detector Health Faults", "Analytics Alert"].includes(kpiData.title)
      ? amberBell
      : rbell;

  // Determine status color based on value and title
  const statusColor =
    kpiData.value === "No Data"
      ? "grey"
      : parseInt(kpiData.value) === 0
      ? "green"
      : ["Detector Health Faults", "Analytics Alert"].includes(kpiData.title)
      ? "#FF9933"
      : "red";

  return (
    <HvCard
      style={{
        flex: 1,
        minWidth: "200px",
        marginTop: "2rem",
        backgroundColor: "white",
        position: "relative",
        borderRadius: "0px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
      statusColor={statusColor}
    >
      {bellIcon && (
        <img
          src={bellIcon}
          alt="bell"
          style={{
            position: "absolute",
            bottom: "0.5rem",
            right: "0.5rem",
            height: "70%",
          }}
        />
      )}
      <HvCardHeader
        title={
          <HvTypography
            variant="title2"
            style={{
              color: statusColor,
              fontWeight: "bold",
            }}
          >
            {kpiData.title}
          </HvTypography>
        }
      />
      <HvCardContent>
        <HvTypography
          variant="title1"
          style={{
            color: statusColor,
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          {kpiData.value}
        </HvTypography>
      </HvCardContent>
    </HvCard>
  );
};

const KPIContainer = ({ ricon, gicon, alertIcon, kpiData, rbell, amberBell, greenBell, aicon, greyIcon, dummyKpiData }) => {
  const noData = !kpiData || kpiData.length === 0;

  if (noData) {
    kpiData = dummyKpiData || [];
  }

  // Condition checks for icon selection
  const allGreaterThanZero = kpiData.length > 0 && kpiData.every(kpi => parseInt(kpi.value) > 0);
  const hasRiconCategory = kpiData.some(kpi => 
    ["Chemical Alarms", "Biological Alarms", "Radiological Alarms"].includes(kpi.title) && parseInt(kpi.value) > 0
  );
  const hasAiconCategory = kpiData.some(kpi => 
    ["Detector Health Faults", "Analytics Alert"].includes(kpi.title) && parseInt(kpi.value) > 0
  );

  // Determine the appropriate icon to display
  const iconToShow = noData
    ? greyIcon
    : allGreaterThanZero
    ? ricon
    : hasRiconCategory
    ? ricon
    : hasAiconCategory
    ? aicon
    : gicon;

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
        src={iconToShow}
        alt="Icon"
        style={{
          height: "8rem",
          objectFit: "contain",
        }}
      />
      {kpiData.map((kpi, index) => (
        <IndividualKPI key={index} kpiData={kpi} rbell={rbell} amberBell={amberBell} greenBell={greenBell} />
      ))}
    </div>
  );
};

export default KPIContainer;
