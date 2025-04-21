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

const IndividualParameters = memo(({ paramsData, notifications = [], toggleState }) => {
  const memoizedCapitalize = useCallback((str) => {
    if (!str) return '';
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const [recentNotifications, setRecentNotifications] = useState([]);

  // Memoized derived values
  const noData = useMemo(() => !paramsData || !paramsData.length, [paramsData]);
  const displayData = useMemo(() => noData ? defaultCards : paramsData[0], [noData, paramsData]);
  const isVRM = useMemo(() => window.location.href.includes("vrm") || window.location.href.includes("VRM"), []);
  const isPRM = useMemo(() => window.location.href.includes("prm") || window.location.href.includes("PRM"), []);
  const isAGM = useMemo(() => window.location.href.includes("agm") || window.location.href.includes("AGM"), []);

  // Memoized functions
  const normalizeTimestamp = useCallback((timestamp) => {
    if (timestamp && typeof timestamp === "string" && timestamp.includes(" ")) {
      return new Date(timestamp.replace(" ", "T"));
    }
    return new Date(timestamp);
  }, []);

  const getFilteredParameters = useCallback((parameters,sectionTitle) => {
    if (toggleState === "Operator" && parameters && sectionTitle === "System Settings") {
      if (isVRM) return Object.fromEntries(Object.entries(parameters).slice(0, 3));
      if (isPRM) return Object.fromEntries(Object.entries(parameters).slice(0, 2));
      if (isAGM) return Object.fromEntries(Object.entries(parameters).slice(0, 4));
    }

    return parameters;
  }, [toggleState, isVRM, isPRM,isAGM]);

  // Effects
  useEffect(() => {
    if (notifications.length === 0) return;

    const existing = JSON.parse(localStorage.getItem("notifications")) || [];
    const now = new Date();

    const updated = [...existing, ...notifications].filter((notif) => {
      const notifTime = normalizeTimestamp(notif.value);
      const hoursDiff = (now - notifTime) / (1000 * 60 * 60);
      return hoursDiff <= 12; // Keep notifications from the last 12 hours
    });

    // Sort notifications by timestamp in descending order (newest first)
    updated.sort((a, b) => {
      const timeA = normalizeTimestamp(a.value).getTime();
      const timeB = normalizeTimestamp(b.value).getTime();
      return timeB - timeA; // Descending order
    });

    const unique = Array.from(
      new Map(updated.map((n) => [`${n.label}-${n.value}`, n])).values()
    );

    localStorage.setItem("notifications", JSON.stringify(unique));
    setRecentNotifications(unique);
  }, [notifications, normalizeTimestamp]);


  // Render functions
  const renderNotificationRow = useCallback(({ index, style }) => {
   
    
    const notification = recentNotifications[index];
    return (
      <StyledTableRow style={style}>
        <StyledTableCell component="th" scope="row">
          {notification.label}
        </StyledTableCell>
        <StyledTableCell align="right">
          {notification.value}
        </StyledTableCell>
      </StyledTableRow>
    );
  }, [recentNotifications]);

  const renderParameterGroup = useCallback((groupTitle, subParams) => (
    <div key={groupTitle} style={parameterGroupStyle}>
      <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
        {groupTitle}
      </div>
      {groupTitle === "Chemical Alarms" || groupTitle === "Radiation Alarms" || groupTitle === "Radiation Alarm"|| groupTitle === "Biological Alarm"  ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "10px" }}>
          {Object.keys(subParams).map((paramKey) => {
            const isAlarm = subParams[paramKey] > 0;
            const color = isAlarm ? "red" : "green";
            return (
              <div key={paramKey} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "24px", height: "24px", backgroundColor: color, borderRadius: "50%" }} />
                <span style={{ fontSize: "16px" }}>{paramKey}</span>
                <span style={{ fontSize: "16px" }}>|</span>
              </div>
            );
          })}
        </div>
      ) : groupTitle === "Chemical Parameters" || groupTitle === "Radiation Parameter"|| groupTitle === "Radiation Parameters" || groupTitle === "Biological Parameters"? (
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

  // Update the section title rendering
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
            parameters = getFilteredParameters(parameters,sectionTitle,toggleState);

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
                  ) : (
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
    {recentNotifications.length > 0 ? (
      <TableRow>
        <TableCell colSpan={4}>
          <List
            height={550}
            itemCount={recentNotifications.length}
            itemSize={100}
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
        </>
      )}
    </div>
  );
});

export default IndividualParameters;