import React from "react";
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
import { useEffect, useState } from "react";

// Styled table components
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

const capitalize = (str) =>
  str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Default Cards when no data is available
const defaultCards = [
  { title: "Parameters", value: "No Data" },
  { title: "Diagnostic Fault Alarms", value: "No Data" },
  { title: "Sensor Health", value: "No Data" },
  { title: "Notifications", value: "No Data" },
];

const IndividualParameters = ({ paramsData, notifications = [], toggleState }) => {
  const [recentNotifications, setRecentNotifications] = useState([]);

  const noData = !paramsData || !paramsData.length;
  const displayData = noData ? defaultCards : paramsData[0];
  const isVRM = window.location.href.includes("vrm") || window.location.href.includes("VRM");
  const isPRM = window.location.href.includes("prm") || window.location.href.includes("PRM");

  useEffect(() => {
    if (notifications.length === 0) return;

    const existing = JSON.parse(localStorage.getItem("notifications")) || [];
    const now = new Date();

    const normalizeTimestamp = (timestamp) => {
      // Replace space with 'T' for ISO compliance
      if (timestamp && typeof timestamp === "string" && timestamp.includes(" ")) {
        return new Date(timestamp.replace(" ", "T"));
      }
      return new Date(timestamp);
    };

    const updated = [...existing, ...notifications].filter((notif) => {
      const notifTime = normalizeTimestamp(notif.value);
      const hoursDiff = (now - notifTime) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    });

    const unique = Array.from(
      new Map(updated.map((n) => [`${n.label}-${n.value}`, n])).values()
    );

    localStorage.setItem("notifications", JSON.stringify(unique));
    setRecentNotifications(unique);
  }, [notifications]);

  return (
    <div className="parameter-container">
      {noData
        ? defaultCards.map((card, index) => (
          <HvCard
            key={index}
            className="parameter-card"
            elevation={0}
            statusColor="grey"
            style={{
              borderRadius: "0px",
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
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
        : Object.keys(displayData).map((sectionTitle) => {
          let parameters = displayData[sectionTitle];
          // console.log("Parameters:", sectionTitle);

          // If toggleState is "Operator" and sectionTitle is "System Settings", limit to top 3 values
          if (toggleState === "Operator" && sectionTitle === "System Settings" && isVRM) {
            parameters = Object.fromEntries(Object.entries(parameters).slice(0, 3));
          }

          if (toggleState === "Operator" && sectionTitle === "System Settings" && isPRM) {
            parameters = Object.fromEntries(Object.entries(parameters).slice(0, 2));
          }

          return (
            <HvCard
              key={sectionTitle}
              className="parameter-card"
              elevation={0}
              statusColor="red"
              style={{
                borderRadius: "0px",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              <div>

                {/* Other KPI content */}
              </div>
              <HvCardContent className="parameter-content">
                <HvTypography variant="title2" className="section-title">
                  {capitalize(sectionTitle)}
                </HvTypography>
                {sectionTitle === "Radiation_Parameters" || sectionTitle === "Radiation_Readings" || sectionTitle === "Biological_Parameters" || sectionTitle === "Chemical Alarms" || sectionTitle === "Radiation Alarm" ? (
                  <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {Object.entries(parameters).map(([groupTitle, subParams]) => (

                      <div
                        key={groupTitle}
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "14px",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                          {groupTitle}
                        </div>
                        {groupTitle === "Chemical Alarms" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "10px" }}>
                            {["CH", "As", "CN", "G", "Hd"].map((chem) => {
                              const alarmKey = `Alarm ${chem}`;
                              const isAlarm = subParams[alarmKey] > 0;
                              const color = isAlarm ? "red" : "green";

                              return (
                                <div key={chem} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  <div
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      backgroundColor: color,
                                      borderRadius: "50%",
                                    }}
                                  ></div>
                                  <span style={{ fontSize:"24px"}}>{chem}</span>
                                  <span style={{ fontSize:"24px"}}>|</span>
                                </div>
                              );
                            })}
                          </div>
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
                    ))}
                  </div>
                ) : (
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    style={{ width: "100%", overflowX: "auto" }}
                  >
                    <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                      <TableBody>
                        {Object.keys(parameters).map((key) => {
                          const value = parameters[key];

                          return (
                            <StyledTableRow key={key}>
                              <StyledTableCell component="th" scope="row">
                                {capitalize(key)}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {typeof value === "object" ? (
                                  Object.keys(value).map((subKey) => (
                                    <div key={subKey}>
                                      <strong>{capitalize(subKey)}:</strong> {value[subKey]}
                                    </div>
                                  ))
                                ) : (
                                  value
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </HvCardContent>
            </HvCard>
          );
        })}

      {/* Notifications - Show Only Latest 3 */}
      {!noData && (
        <HvCard
          className="parameter-card"
          elevation={0}
          statusColor="red"
          style={{
            borderRadius: "0px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <HvCardContent className="parameter-content">
            <HvTypography variant="title2" className="section-title">
              Notifications
            </HvTypography>
            <TableContainer
              component={Paper}
              elevation={0}
              style={{
                width: "100%",
                maxHeight: "400px", // adjust as needed
                overflowY: "auto",
              }}
            >
              <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                <TableBody>
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {notification.label}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {notification.value}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
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
      )}

    </div>
  );
};

export default IndividualParameters;
