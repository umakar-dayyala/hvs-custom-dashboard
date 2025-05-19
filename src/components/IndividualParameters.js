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



const IndividualParameters = memo(
  ({ paramsData, notifications = [], toggleState, AsmData }) => {
    /* ───── helpers ───── */

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
  const green  = "#008000";
  const yellow = "#ffbf00";
  const red    = "#ff0000";

  const statusStr = String(status).toLowerCase();
  const faultStr  = String(faultValue).toLowerCase();

  /* ---- fault first ---- */
  if (faultStr === "fault" || faultStr === "true") return yellow;

  /* ---- clear / no-fault / ok ---- */
  if (
    faultStr === "no fault" ||        // ← ADD THIS
    statusStr === "false"  ||
    statusStr === "no fault" ||
    statusStr === "ok"      ||
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
          <StyledTableRow
            style={{
              ...style,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              fontSize: "18px",
            }}
          >
            <StyledTableCell style={{ flex: 7, wordBreak: "break-word" }}>
              {n.label}
            </StyledTableCell>
            <StyledTableCell style={{ flex: 3, textAlign: "right" }}>
              {n.value}
            </StyledTableCell>
          </StyledTableRow>
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
                  gap: "1rem 1.5rem",
                }}
              >
                {Object.keys(subParams).map((k) => {
                  const isAlarm = subParams[k] > 0;
                  const color = isAlarm ? "red" : "green";
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
          ) : /* live-plot groups */ [
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
                            overflowX: "auto",
                            marginBottom: "16px",
                          }}
                        >
                          <Table
                            sx={{ minWidth: "100%" }}
                            aria-label="system-settings-table"
                          >
                            <TableBody>
                              {Object.entries(parameters)
                                .filter(([_, v]) => isNaN(Number(v)))
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
                              .filter(([_, v]) => !isNaN(Number(v)))
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

            {/* ------- Notifications card ------- */}
            <HvCard
              className="parameter-card"
              elevation={0}
              statusColor="red"
              style={cardStyle}
            >
              <HvCardContent>
                <HvTypography variant="title2" className="section-title">
                  Notifications
                </HvTypography>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  style={notificationContainerStyle}
                >
                  <Table
                    sx={{ minWidth: "100%" }}
                    aria-label="notifications-table"
                  >
                    <TableBody>
                      {notifications.length ? (
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
                            ✅ All good. No active alarms.
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </HvCardContent>
            </HvCard>

            {/* ------- optional ASM section ------- */}
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
          </>
        )}
      </div>
    );
  }
);

export default IndividualParameters;