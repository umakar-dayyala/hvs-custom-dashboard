import React, { useEffect, useState, useMemo, useCallback, memo, useRef } from "react";
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

const excludedFromPlot = [
  "Scaling Factor",
  "Alarm Level",
  "Min Level",
  "Max Level",
  "Callibration Factor",
  "Audio Off Time",
  "CPS",
  "Baudrate",
  "Instrument ID",
  "Instrument Address",
  "Gateway",
  "IP Address",
  "Laser PD",
  "Background Light Monitor",
  "V Power Supply",
  "Occupancy",
  "System Type",
  "Slave Sync",
  "Vehicle In",
  "DET 01 Status",
  "DET 02 Status",
  "Simulation Mode",
  "555 Mode",
  "DET 02 BG High",
  "DET 02 BG Low",
  "DET 02 Alarm",
  "DET 01 BG High",
  "DET 01 BG Low",
  "DET 01 Alarm",
  "Instrument Type",
  "Filter Change Count",
  "Configuration Change Count",
  "Reading Change Count"
];

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
  height: "100%", // Take up all available space
  overflowY: "auto",
};



const IndividualParameters = memo(
  // Default height
  ({ paramsData, notifications = [], toggleState, AsmData }) => {
    /* ───── helpers ───── */
    const listContainerRef = useRef(null);
    const [listHeight, setListHeight] = useState(500); // Default height
    // const [cardStatusColor, setCardStatusColor] = useState("green");

    useEffect(() => {
      if (!listContainerRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        const { height } = entries[0].contentRect;
        setListHeight(height - 40); // Subtract padding/header space
      });

      resizeObserver.observe(listContainerRef.current);
      return () => resizeObserver.disconnect();
    }, []);

    const memoizedCapitalize = useCallback(
      (str) =>
        !str
          ? ""
          : str
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
      []
    );

    const noData = useMemo(() => !paramsData || !paramsData.length, [paramsData]);
    const displayData = useMemo(
      () => (noData ? defaultCards : paramsData[0]),
      [noData, paramsData]
    );

    const getBackgroundColor = (status, faultValue) => {
      const green = "#008000";
      const yellow = "#ffbf00";
      const red = "#ff0000";

      const statusStr = String(status).toLowerCase();
      const faultStr = String(faultValue).toLowerCase();

      /* ---- fault first ---- */
      if (faultStr === "fault" || faultStr === "true") return yellow;

      /* ---- clear / no-fault / ok ---- */
      if (
        faultStr === "no fault" ||        // ← ADD THIS
        statusStr === "false" ||
        statusStr === "no fault" ||
        statusStr === "ok" ||
        statusStr === "clear"
      )
        return green;

      /* ---- anything else = warning ---- */
      return yellow;
    };


    /* ───── renderers ───── */

    const renderNotificationRow = useCallback(
      ({ index, style }) => {
        const n = notifications[index];
        return (
          <TableRow
            key={index}
            style={{
              ...style,
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderBottom: "1px solid #e0e0e0",
              fontSize: "14px",
            }}
          >
            <TableCell style={{ flex: 1, padding: 0, border: "none" }}>
              {n.label}
            </TableCell>
            <TableCell
              style={{
                flex: 0.3,
                padding: 0,
                border: "none",
                textAlign: "right",
                color: "#666",
                fontSize: "12px"
              }}
            >
              {n.value}
            </TableCell>
          </TableRow>
        );
      },
      [notifications]
    );

    const renderParameterGroup = useCallback(
      (groupTitle, subParams) => (
        <div key={groupTitle} style={parameterGroupStyle}>
          <div
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            {groupTitle}
          </div>

          {/* Alarm bubble grid */}
          {[
            "Chemical Alarms",
            "Chemical Alarm",
            "Radiation Alarms",
            "Radiation Alarm",
            "Biological Alarm",
            "Biological Alarms",
          ].includes(groupTitle) ? (
            <div style={{ padding: "1rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
                  gap: "1rem 4rem",
                }}
              >
                {Object.keys(subParams).map((k) => {
                  const isAlarm = subParams[k] > 0;
                  const color = isAlarm ? "red" : "green";
                  // setCardStatusColor(color);
                  return (
                    <div
                      key={k}
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
                      <span style={{ fontSize: "18px" }}>{k}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : /* live-plot groups */[
            "Chemical Parameters",
            "Radiation Parameter",
            "Radiation Parameters",
            "Concentrations",
            "Biological Parameters",
          ].includes(groupTitle) ? (
            <MemoizedLivePlot data={subParams} />
          ) : (
            /* simple key/value list */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                paddingLeft: "10px",
              }}
            >
              {Object.entries(subParams).map(([label, value]) => (
                <div key={label} style={{ fontSize: "18px" }}>
                  {label}: {value}
                </div>
              ))}
            </div>
          )}
        </div>
      ),
      []
    );

    const renderTableRow = useCallback(
      (k, v) => (
        <StyledTableRow key={k}>
          <StyledTableCell component="th" scope="row">
            {memoizedCapitalize(k)}
          </StyledTableCell>
          <StyledTableCell align="right">
            {typeof v === "object" ? (
              Object.entries(v).map(([subK, subV]) => (
                <div key={subK}>
                  <strong>{memoizedCapitalize(subK)}:</strong> {subV}
                </div>
              ))
            ) : (
              v
            )}
          </StyledTableCell>
        </StyledTableRow>
      ),
      [memoizedCapitalize]
    );

    const renderSectionTitle = useCallback(
      (t) => memoizedCapitalize(t),
      [memoizedCapitalize]
    );

    /* ───── card style ───── */

    const cardStyle = {
      borderRadius: "0px",
      boxShadow:
        "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    };

    /* ===================== JSX ===================== */

    return (
      <div className="parameter-container">
        {noData ? (
          /* Placeholder cards */
          defaultCards.map((c, i) => (
            <HvCard
              key={i}
              className="parameter-card"
              elevation={0}
              statusColor="grey"
              style={cardStyle}
            >
              <HvCardContent className="parameter-content">
                <HvTypography variant="title2" className="section-title">
                  {c.title}
                </HvTypography>
                <HvTypography variant="body1" align="center">
                  {c.value}
                </HvTypography>
              </HvCardContent>
            </HvCard>
          ))
        ) : (
          <>
            {/* ------- dynamic sections ------- */}
            {Object.keys(displayData).map((sectionTitle) => {
              const parameters = displayData[sectionTitle];

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

                    {/* --- switch per section --- */}
                    {[
                      "Radiation_Parameters",
                      "Radiation_Readings",
                      "Biological_Parameters",
                      "Chemical Alarms",
                      "Radiation Alarm",
                      "Concentrations",
                    ].includes(sectionTitle) ? (
                      <div
                        style={{
                          padding: "10px 0",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {sectionTitle === "Concentrations" ? (
                          <MemoizedLivePlot data={parameters} />
                        ) : (
                          Object.entries(parameters).map(
                            ([groupTitle, sub]) =>
                              renderParameterGroup(groupTitle, sub)
                          )
                        )}
                      </div>
                    ) : sectionTitle === "System Settings" ? (
                      /* ---------- system settings ---------- */
                      <div style={{ padding: "10px 0" }}>
                        <TableContainer
                          component={Paper}
                          elevation={0}
                          style={{
                            width: "100%",
                            maxHeight: "600px", // Limit vertical height
                            overflow: "auto",   // Add both vertical and horizontal scroll if needed
                            marginBottom: "16px",
                          }}
                        >
                          <Table
                            sx={{ minWidth: "100%" }}
                            aria-label="system-settings-table"
                          >
                            <TableBody>
                              {Object.entries(parameters)
                                .filter(([k]) => !["HV (High Voltage)", "Exhaust Pressure", "O2 AL1 Set Point",
                                  "CO2 AL1 Set Point", "CO AL1 Set Point", "O2 AL2 Set Point",
                                  "CO2 AL2 Set Point", "Input Voltage", "Internal Temperature",
                                  "Laser Current"].includes(k)) // exclude plotted values
                                .map(([k, v]) => (
                                  <StyledTableRow key={k}>
                                    <StyledTableCell
                                      component="th"
                                      scope="row"
                                      style={{ width: "60%" }}
                                    >
                                      <div style={{ padding: "8px 0" }}>{k}</div>
                                    </StyledTableCell>
                                    <StyledTableCell
                                      align="right"
                                      style={{ width: "40%" }}
                                    >
                                      <div style={{ padding: "8px 0" }}>{v}</div>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ))}
                            </TableBody>



                          </Table>
                        </TableContainer>

                        <MemoizedLivePlot
                          data={Object.fromEntries(
                            Object.entries(parameters)
                              .filter(([k, v]) => {
                                return !excludedFromPlot.includes(k) && !isNaN(Number(v));
                              })
                              .map(([k, v]) => [k, Number(v)])
                          )}
                        />
                      </div>
                    ) : ["Health Parameters", "Health_Parameters"].includes(
                      sectionTitle
                    ) ? (
                      /* -------- Health Parameters ---------- */
                      <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }}>
                        <Table sx={{ minWidth: "100%" }} aria-label="health-parameters-table">
                          <TableBody>
                            {Object.entries(parameters).map(([paramName, meta]) => {
                              // meta = { "<paramName> Status": "...", "Fault Value": "...", ... }
                              const status =
                                meta[`${paramName} Status`] ??
                                meta[Object.keys(meta).find((k) => k.toLowerCase().includes("status"))];

                              const fault = meta["Fault Value"];

                              return (
                                <StyledTableRow key={paramName}>
                                  {/* label column */}
                                  <StyledTableCell component="th" scope="row" style={{ width: "60%" }}>
                                    {paramName.replace(/_/g, " ")}
                                  </StyledTableCell>

                                  {/* value chip */}
                                  <StyledTableCell align="right" style={{ width: "40%" }}>
                                    <div
                                      style={{
                                        backgroundColor: getBackgroundColor(status, fault),
                                        color: "white",
                                        borderRadius: "6px",
                                        padding: "4px 12px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        minWidth: "70px",
                                        display: "inline-block",
                                      }}
                                    >
                                      {status}
                                    </div>
                                  </StyledTableCell>
                                </StyledTableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>

                    ) : (
                      /* ---------- generic table ---------- */
                      <TableContainer
                        component={Paper}
                        elevation={0}
                        style={{ width: "100%", overflowX: "auto" }}
                      >
                        <Table
                          sx={{ minWidth: "100%" }}
                          aria-label="generic-table"
                        >
                          <TableBody>
                            {Object.entries(parameters).map(([k, v]) =>
                              renderTableRow(k, v)
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </HvCardContent>
                </HvCard>
              );
            })}

            {/* ------- Optional ASM section ------- added before notification card */}
            {AsmData && (
              <HvCard
                className="parameter-card"
                elevation={0}
                statusColor="red"
                style={cardStyle}
              >
                <HvCardContent className="parameter-content">
                  <HvTypography variant="title2" className="section-title">
                    Air Sampler (ASM) Data
                  </HvTypography>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    style={{ width: "100%", overflowX: "auto" }}
                  >
                    <Table sx={{ minWidth: "100%" }} aria-label="asm-table">
                      <TableBody>
                        {Object.entries(AsmData).map(([k, v]) => (
                          <StyledTableRow key={k}>
                            <StyledTableCell component="th" scope="row">
                              {k}
                            </StyledTableCell>
                            <StyledTableCell align="right">{v}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </HvCardContent>
              </HvCard>
            )}

            {/* ------- Notifications card ------- */}
            <HvCard
              className="parameter-card"
              elevation={0}
              statusColor="red"
              style={{ ...cardStyle, flex: 1 }}
            >
              <HvCardContent className="parameter-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <HvTypography variant="title2" className="section-title">
                  Notifications
                </HvTypography>

                <div style={{ flex: 1, minHeight: 0 }}>
                  {notifications.length > 0 ? (
                    <div ref={listContainerRef} style={{ height: '100%' }}>
                      <TableContainer
                        component={Paper}
                        elevation={0}
                        style={{
                          width: '100%',
                          height: '100%',

                        }}
                      >
                        <Table sx={{ minWidth: '100%' }} >
                          <TableBody>
                            <List
                              height={800}
                              itemCount={notifications.length}
                              itemSize={150}
                              width="100%"
                            >
                              {({ index, style }) => {
                                const n = notifications[index];
                                return (
                                  <StyledTableRow
                                    key={index}
                                    style={{
                                      ...style,
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                    }}
                                  >
                                    <StyledTableCell
                                      component="div"
                                      style={{
                                        flex: 1,
                                        padding: '8px 16px',
                                        fontSize: '18px'
                                      }}
                                    >
                                      {n.label}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      component="div"
                                      align="right"
                                      style={{
                                        flex: 0.3,
                                        padding: '8px 16px',
                                        color: '#666',
                                        fontSize: '18px'
                                      }}
                                    >
                                      {n.value}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                );
                              }}
                            </List>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  ) : (
                    <StyledTableRow style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StyledTableCell colSpan={2} align="center" style={{ border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                          <img src={sIcon} alt="Success" style={{ height: "16px", marginRight: "8px" }} />
                          All good. No active alarms.
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </div>
              </HvCardContent>
            </HvCard>
            {/* ------- optional ASM section ------- */}

          </>
        )}
      </div>
    );
  }
);

export default IndividualParameters;