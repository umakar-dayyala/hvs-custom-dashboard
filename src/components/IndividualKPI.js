import React from "react";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvTypography,
} from "@hitachivantara/uikit-react-core";



const IndividualKPI = ({ kpiData, rbell, amberBell, greenBell }) => {
  const isAlarmActive = parseInt(kpiData.value) > 0;

  // Determine bell icon based on value and title
  const bellIcon =
    kpiData.value === "No Data"
      ? null
      : parseInt(kpiData.value) === 0
      ? greenBell
      : kpiData.title === "Detector Health Faults" || kpiData.title === "Analytics Alert"
      ? amberBell
      : rbell;

  // Determine status color based on value and title
  const statusColor =
    kpiData.value === "No Data"
      ? "grey"
      : parseInt(kpiData.value) === 0
      ? "green"
      : kpiData.title === "Detector Health Faults" || kpiData.title === "Analytics Alert"
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

  const isAlarmActive = kpiData.some(kpi => parseInt(kpi.value) > 0);
  const isCritical = kpiData.some(kpi => (kpi.title !== "CBRN Alarms" && parseInt(kpi.value) > 0));

  const iconToShow = noData ? greyIcon : isAlarmActive ? ricon : isCritical ? aicon : gicon;

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
