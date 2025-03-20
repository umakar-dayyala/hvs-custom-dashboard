import React, { useState, useEffect } from "react";
import { HvCard, HvCardContent, HvTypography } from "@hitachivantara/uikit-react-core";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../css/IndividualParameters.css";

// Styled components for Material-UI table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000", // Black header
    color: "#fff", // White text
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#000", // Black text for values
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f7f7f7", // Light gray background for odd rows
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#ffffff", // White background for even rows
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

const IndividualParameters = ({ sampleData = [] }) => {
  const [notifications, setNotifications] = useState([
    { message: "Sensor threshold exceeded", timestamp: "2025-03-20 10:15:00" },
    { message: "System reboot required", timestamp: "2025-03-20 09:45:00" },
    { message: "New firmware update available", timestamp: "2025-03-20 08:30:00" }
  ]);

  if (!sampleData.length) return <p>No data available</p>;

  const dataObject = sampleData[0];

  return (
    <div className="parameter-container">
      {Object.keys(dataObject).map((sectionTitle) => {
        const parameters = dataObject[sectionTitle];

        return (
          <HvCard key={sectionTitle} className="parameter-card" elevation={0} statusColor="red" style={{ borderRadius: "0px",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <HvCardContent className="parameter-content" >
              <HvTypography variant="title3" className="section-title" >
                {sectionTitle.replace(/_/g, " ")}
              </HvTypography>
              <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }} >
                <Table sx={{ minWidth: "100%" }} aria-label="customized table">
                  <TableBody>
                    {Object.keys(parameters).map((key) => (
                      <StyledTableRow key={key}>
                        <StyledTableCell component="th" scope="row">
                          {capitalize(key)}
                        </StyledTableCell>
                        <StyledTableCell align="right">{parameters[key]}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </HvCardContent>
          </HvCard>
        );
      })}

      {/* Notification Card */}
      <HvCard className="parameter-card" elevation={0} statusColor="red"  style={{ borderRadius: "0px",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
        <HvCardContent className="parameter-content">
          <HvTypography variant="title3" className="section-title" >
            Notifications
          </HvTypography>
          <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }}>
            <Table sx={{ minWidth: "100%" }} aria-label="customized table">
              
              <TableBody>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {notification.message}
                      </StyledTableCell>
                      <StyledTableCell align="right">{notification.timestamp}</StyledTableCell>
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
    </div>
  );
};

export default IndividualParameters;
