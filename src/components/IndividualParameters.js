import React from "react";
import { HvCard, HvCardContent, HvTypography } from "@hitachivantara/uikit-react-core";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../css/IndividualParameters.css";

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

// Component
const IndividualParameters = ({ paramsData, notifications = [] }) => {
  if (!paramsData || !paramsData.length) return <p>No data available</p>;

  const dataObject = paramsData[0];

  return (
    <div className="parameter-container">
      {Object.keys(dataObject).map((sectionTitle) => {
        const parameters = dataObject[sectionTitle];

        return (
          <HvCard key={sectionTitle} className="parameter-card" elevation={0} statusColor="red"
            style={{ borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
            <HvCardContent className="parameter-content">
              <HvTypography variant="title2" className="section-title">
                {capitalize(sectionTitle)}
              </HvTypography>
              {`${sectionTitle}` === "Radiation Readings" &&
                <HvTypography variant="title2" > Radiation Alarm</HvTypography>
              }
              <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }}>
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
      
            </HvCardContent>
          </HvCard>
        );
      })}

      {/* Notifications - Show Only Latest 3 */}
      <HvCard className="parameter-card" elevation={0} statusColor="red"
        style={{ borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
        <HvCardContent className="parameter-content">
          <HvTypography variant="title2" className="section-title">
            Notifications
          </HvTypography>
          <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }}>
            <Table sx={{ minWidth: "100%" }} aria-label="customized table">
              <TableBody>
                {notifications.length > 0 ? (
                  notifications.slice(-3).reverse().map((notification, index) => ( // Get the latest 3
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {notification.label}
                      </StyledTableCell>
                      <StyledTableCell align="right">{notification.value}</StyledTableCell>
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
