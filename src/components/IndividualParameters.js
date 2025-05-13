import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
  HvCard,
  HvCardContent,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../css/IndividualParameters.css";
import { FixedSizeList as List } from 'react-window';
import LivePlot from "./LivePlot";
import sIcon from "../assets/successIcon.png"

// Styled components defined outside the component to prevent recreation
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
    color: "#000",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f7f7f7",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#ffffff",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Memoized components
const MemoizedLivePlot = memo(LivePlot);
// const MemoizedPlot = memo(Plot);

// Default Cards when no data is available
const defaultCards = [
  { title: "Parameters", value: "No Data" },
  { title: "Diagnostic Fault Alarms", value: "No Data" },
  { title: "Sensor Health", value: "No Data" },
  { title: "Notifications", value: "No Data" },
];



const parameterGroupStyle = {
  backgroundColor: "#f5f5f5",
  padding: "14px",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const notificationContainerStyle = {
  width: "100%",
  maxHeight: "600px",
  overflowY: "auto",
};

const IndividualParameters = memo(({ paramsData, notifications = [], toggleState, AsmData }) => {
  console.log("ASM Data", AsmData);
  const memoizedCapitalize = useCallback((str) => {
    if (!str) return '';
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  // Memoized derived values
  const noData = useMemo(() => !paramsData || !paramsData.length, [paramsData]);
  const displayData = useMemo(() => noData ? defaultCards : paramsData[0], [noData, paramsData]);
  const isVRM = useMemo(() => window.location.href.includes("vrm") || window.location.href.includes("VRM"), []);
  const isPRM = useMemo(() => window.location.href.includes("prm") || window.location.href.includes("PRM"), []);
  const isAGM = useMemo(() => window.location.href.includes("agm") || window.location.href.includes("AGM"), []);

  const getFilteredParameters = useCallback((parameters, sectionTitle) => {
    if (toggleState === "Operator" && parameters && sectionTitle === "System Settings") {
      if (isVRM) return Object.fromEntries(Object.entries(parameters).slice(0, 3));
      if (isPRM) return Object.fromEntries(Object.entries(parameters).slice(0, 2));
      if (isAGM) return Object.fromEntries(Object.entries(parameters).slice(0, 4));
    }
    return parameters;
  }, [toggleState, isVRM, isPRM, isAGM]);

  const getBackgroundColor = (key, value) => {
  const green = "#008000";
  const yellow = "#ffbf00";
  const red = "#ff0000";

  const statusMap = {
    "Detector Ready": (v) => {
      const val = String(v).toLowerCase();
      return val === "true" || val === "ready" ? green : yellow;
    },
    "Device Fault": (v) => {
      const val = String(v).toLowerCase();
      return val === "no fault" || val === "okay" ? green : red;
    },
    "Power Supply Too Low": (v) => String(v).toLowerCase() === "false" ? green : yellow,
    "Algorithm Alarm Status": (v) => String(v).toLowerCase() === "no alarm" ? green : yellow,
    "Pressure": (v) => String(v).toLowerCase() === "no fault" ? green : yellow,
    "Laser Power": (v) => String(v).toLowerCase() === "no fault" ? green : yellow,
    "Laser Current": (v) => parseFloat(v) > 0 ? green : yellow,
    "Background Light Monitor": (v) => String(v).toLowerCase() === "no fault" ? green : yellow,
    "Low Battery": (v) => String(v).toLowerCase() === "no fault" ? green : yellow,
    "DET 01 Status": (v) => String(v).toLowerCase() === "no alarm" ? green : yellow,
    "System Error": (v) => String(v).toLowerCase() === "no fault" ? green : yellow,
    "DET 02 Status": (v) => String(v).toLowerCase() === "no alarm" ? green : yellow,
    "Purge": (v) => String(v).toLowerCase() === "not required" ? green : yellow,
    "Lack Of Hydrogen": (v) => String(v).toLowerCase() === "no need" ? green : yellow,
    "Maintenance Required": (v) => String(v).toLowerCase() === "not required" ? green : yellow,
    "Test Mode in Progress": (v) => String(v).toLowerCase() === "on" ? green : yellow,
    "Low Voltage Status": (v) => String(v).toLowerCase() === "ok" ? green : yellow,
    "RTC Status": (v) => String(v).toLowerCase() === "ok" ? green : yellow,
    "Detector Status": (v) => String(v).toLowerCase() === "ok" ? green : yellow,
    "High Voltage Status": (v) => String(v).toLowerCase() === "ok" ? green : yellow,
    "SD card Status": (v) => String(v).toLowerCase() === "ok" ? green : yellow,
    "Mother Board Controller Status ": (v) => String(v).toLowerCase() === "ok" ? green : yellow,
  };

  const normalizedValue = String(value).toLowerCase();
  return statusMap[key] ? statusMap[key](value) : (normalizedValue === "true" ? green : yellow);
};



  const renderNotificationRow = useCallback(({ index, style }) => {
    const notification = notifications[index];
    return (
      <StyledTableRow style={{ ...style, display: 'flex', justifyContent: 'space-between' }}>
        <StyledTableCell style={{ flex: 1 }}>
          {notification.label}
        </StyledTableCell>
        <StyledTableCell style={{ textAlign: 'right' }}>
          {notification.value}
        </StyledTableCell>
      </StyledTableRow>
    );
  }, [notifications]);

  const renderParameterGroup = useCallback((groupTitle, subParams) => (
    <div key={groupTitle} style={parameterGroupStyle}>
      <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
        {groupTitle}
      </div>
      {groupTitle === "Chemical Alarms" || groupTitle === "Chemical Alarm" || groupTitle === "Radiation Alarms" || groupTitle === "Radiation Alarm" || groupTitle === "Biological Alarm" || groupTitle === "Biological Alarms" ? (
        <div style={{ padding: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
              gap: "1rem 1.5rem",

            }}
          >
            {Object.keys(subParams).map((paramKey) => {
              const isAlarm = subParams[paramKey] > 0;
              const color = isAlarm ? "red" : "green";
              return (
                <div
                  key={paramKey}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      width: "1rem",
                      height: "1rem",
                      backgroundColor: color,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "1.5rem" }}>{paramKey}</span>
                </div>
              );
            })}
          </div>
        </div>



      ) : groupTitle === "Chemical Parameters" || groupTitle === "Radiation Parameter" || groupTitle === "Radiation Parameters" || groupTitle === "Biological Parameters" ? (
        <MemoizedLivePlot data={subParams} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "10px" }}>
          {Object.entries(subParams).map(([label, value]) => (
            <div key={label} style={{ fontSize: "18px" }}>
              {label}: {value}
            </div>
          ))}
        </div>
      )}
    </div>
  ), []);

  const renderTableRow = useCallback((key, value) => (
    <StyledTableRow key={key}>
      <StyledTableCell component="th" scope="row">
        {memoizedCapitalize(key)}
      </StyledTableCell>
      <StyledTableCell align="right">
        {typeof value === "object" ? (
          Object.keys(value).map((subKey) => (
            <div key={subKey}>
              <strong>{memoizedCapitalize(subKey)}:</strong> {value[subKey]}
            </div>
          ))
        ) : (
          value
        )}
      </StyledTableCell>
    </StyledTableRow>
  ), [memoizedCapitalize]);

  const renderSectionTitle = useCallback((title) => memoizedCapitalize(title), [memoizedCapitalize]);

  const cardStyle = {
    borderRadius: "0px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  };

  return (
    <div className="parameter-container">
      {noData ? (
        defaultCards.map((card, index) => (
          <HvCard
            key={index}
            className="parameter-card"
            elevation={0}
            statusColor="grey"
            style={cardStyle}
          >
            <HvCardContent className="parameter-content">
              <HvTypography variant="title2" className="section-title">
                {card.title}
              </HvTypography>
              <HvTypography variant="body1" align="center">
                {card.value}
              </HvTypography>
            </HvCardContent>
          </HvCard>
        ))
      ) : (
        <>
          {Object.keys(displayData).map((sectionTitle) => {
            let parameters = displayData[sectionTitle];
            parameters = getFilteredParameters(parameters, sectionTitle, toggleState);

            return (
              <HvCard
                key={sectionTitle}
                className="parameter-card"
                elevation={0}
                statusColor="red"
                style={cardStyle}
              >
                <HvCardContent className="parameter-content">
                  <HvTypography variant="title2" className="section-title">
                    {renderSectionTitle(sectionTitle)}
                  </HvTypography>
                  {["Radiation_Parameters", "Radiation_Readings", "Biological_Parameters", "Chemical Alarms", "Radiation Alarm"].includes(sectionTitle) ? (
                    <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {Object.entries(parameters).map(([groupTitle, subParams]) =>
                        renderParameterGroup(groupTitle, subParams)
                      )}
                    </div>
                  ) : sectionTitle === "System Settings" ? (


                    <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#F5F5F5", padding: "14px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                        {Object.entries(parameters).filter(([_, value]) => isNaN(Number(value))).map(([key, value]) => (
                          <div key={key} style={{ fontSize: "18px", display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                            <div key={key}>
                              {key}
                            </div>
                            <div>
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live Plot for numeric values (converted if possible) */}
                      <MemoizedLivePlot
                        data={Object.fromEntries(
                          Object.entries(parameters).filter(([_, value]) => !isNaN(Number(value)))
                            .map(([key, value]) => [key, Number(value)])
                        )}
                      />

                      {/* Show non-numeric values */}

                    </div>
                  ) : sectionTitle === "Health Parameters" || sectionTitle === "Health_Parameters" ? (
                    <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px" }}>

                      {Object.entries(parameters).map(([key, value]) => {




                        return (
                          <div
                            key={key}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "12px",
                              fontSize: "18px",
                              padding: "10px 0",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 auto", minWidth: "200px" }}>

                              <span
                                style={{
                                  backgroundColor: "#ddd",
                                  borderRadius: "6px",
                                  padding: "4px 10px",
                                  fontSize: "16px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {key}
                              </span>
                            </div>
                            <div
                              style={{
                                backgroundColor: getBackgroundColor(key, value),
                                color: "white",
                                borderRadius: "6px",
                                padding: "4px 12px",
                                fontWeight: "bold",
                                textAlign: "center",
                                minWidth: "90px",
                                flexShrink: 0,
                              }}
                            >
                              {value}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  ) :
                    (
                      <TableContainer
                        component={Paper}
                        elevation={0}
                        style={{ width: "100%", overflowX: "auto" }}
                      >
                        <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                          <TableBody>
                            {Object.entries(parameters).map(([key, value]) => (
                              renderTableRow(key, value)
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                </HvCardContent>
              </HvCard>
            );
          })}

          <HvCard
            className="parameter-card"
            elevation={0}
            statusColor="red"
            style={cardStyle}
          >
            <HvCardContent className="parameter-content">
              <HvTypography variant="title2" className="section-title">
                Notifications
              </HvTypography>
              <TableContainer
                component={Paper}
                elevation={0}
                style={notificationContainerStyle}
              >
                <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                  <TableBody>
                    {notifications.length > 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <List
                            height={550}
                            itemCount={notifications.length}
                            itemSize={150}
                            width="100%"
                          >
                            {renderNotificationRow}
                          </List>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={2} align="center">
                          No notifications available
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </HvCardContent>
          </HvCard>
          {AsmData && (
            <HvCard
              className="parameter-card"
              elevation={0}
              statusColor="red"
              style={cardStyle}
            >
              <HvCardContent className="parameter-content">
                <HvTypography variant="title2" className="section-title">
                  ASM Data
                </HvTypography>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  style={{ width: "100%", overflowX: "auto" }}
                >
                  <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                    <TableBody>
                      {Object.entries(AsmData).map(([key, value]) => (
                        <StyledTableRow key={key}>
                          <StyledTableCell component="th" scope="row">
                            {key}
                          </StyledTableCell>
                          <StyledTableCell align="right">{value}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </HvCardContent>
            </HvCard>
          )}
        </>
      )}

    </div>
  );
});

export default IndividualParameters;