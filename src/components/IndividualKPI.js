import React from "react";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const IndividualKPI = ({ kpiData, rbell }) => {
  const isAlarmActive = parseInt(kpiData.value) > 0;

  return (
    <HvCard
      style={{
        flex: 1,
        minWidth: "200px",
        marginTop: "2rem",
        backgroundColor: "white",
        position: "relative", // Needed for absolute positioning of the bell
         borderRadius: "0px",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
      }}
      statusColor={isAlarmActive ? "red" : "green"}
    >
      {/* Bell Icon in Top-Right */}
      <img
        src={rbell}
        alt="bell"
        style={{
          position: "absolute",
          bottom: "0.5rem",
          right: "0.5rem",
          height: "70%", // Adjusts dynamically with the card
        }}
      />

      <HvCardHeader
        title={
          <HvTypography
            variant="title2"
            style={{
              color: isAlarmActive ? "red" : "black",
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
            color: isAlarmActive ? "red" : "black",
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

const KPIContainer = ({ ricon, gicon, kpiData, rbell }) => {
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
        src={isAlarmActive ? ricon : gicon}
        alt="Icon"
        style={{
          height: "8rem",
          objectFit: "contain",
        }}
      />
      {kpiData.map((kpi, index) => (
        <IndividualKPI key={index} kpiData={kpi} rbell={rbell} />
      ))}
    </div>
  );
};

export default KPIContainer;
