import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider } from "@mui/material";
import { HvButton, HvTypography } from "@hitachivantara/uikit-react-core";
import CheckCircleIcon from "../assets/rightMark.svg";
import CancelIcon from "../assets/crossMark.svg";
import RadiationIcon from "../assets/rRadiological.svg"; // Example icons, replace as needed
import BioIcon from "../assets/rBiological.svg";
import ChemicalIcon from "../assets/rChemical.svg";

// Sensor Type Icons Mapping
const sensorTypeIcons = {
  Radiation: RadiationIcon,
  Bio: BioIcon,
  Chemical: ChemicalIcon,
};

// DataTable Component
const AllAlertsFloorWiseTable = ({ floorWiseAlertsData }) => {
  if (!floorWiseAlertsData || floorWiseAlertsData.length === 0) {
    return <HvTypography>No data available</HvTypography>;
  }

  return (
    <Box>
      {floorWiseAlertsData.map((floor, floorIndex) => (
        <Box key={floorIndex} mb={4}>
          {/* Floor Title */}
          <Divider style={{ border: "1px solid #E8E8E8", margin: "8px 0" }} />
          <HvTypography variant="title3" style={{ margin: "16px 0" }}>
            {floor.floorName}
          </HvTypography>

          {/* Table */}
          <TableContainer component={Paper} className="table-container">
            <Table className="table">
              {/* Table Header */}
              <TableHead>
                <TableRow className="header-row">
                  {[
                    "Sl No",
                    "Zone",
                    "Location",
                    "No of Alarm",
                    "Time Stamp of Alarm",
                    "Alarm Type",
                    "Correlated Alarm if Any",
                    "Incident Status",
                    "Action",
                  ].map((header) => (
                    <TableCell key={header} className="table-cell1">
                      <HvTypography variant="label">{header}</HvTypography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {floor.alerts.map((alert, alertIndex) => (
                  <TableRow key={alertIndex} className="body-row">
                    {/* Sl No */}
                    <TableCell className="table-cell">
                      <HvTypography>{alertIndex + 1}</HvTypography>
                    </TableCell>

                    {/* Zone */}
                    <TableCell className="table-cell">
                      <HvTypography>{alert.zone}</HvTypography>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="table-cell">
                      <HvTypography>{alert.location}</HvTypography>
                    </TableCell>

                    {/* No of Alarm */}
                    <TableCell className="table-cell">
                      <HvTypography>{alert.no_of_alarms}</HvTypography>
                    </TableCell>

                    {/* Time Stamp of Alarm */}
                    <TableCell className="table-cell">
                      <HvTypography>{alert.timestamp}</HvTypography>
                    </TableCell>

                    {/* Alarm Type with Icon */}
                    <TableCell className="table-cell">
                      <Box display="flex" >
                        {sensorTypeIcons[alert.sensor_type] && (
                          <img
                            src={sensorTypeIcons[alert.sensor_type]}
                            alt={alert.sensor_type}
                            className="status-icon"
                          />
                        )}
                        <HvTypography color="negative">{alert.alarm_type}</HvTypography>
                      </Box>
                    </TableCell>

                    {/* Correlated Alarm */}
                    <TableCell className="table-cell">
                      <img
                        src={alert.correlated_alarms === "No" ? CancelIcon : CheckCircleIcon}
                        alt={alert.correlated_alarms === "No" ? "No" : "Yes"}
                        className="status-icon"
                      />
                    </TableCell>

                    {/* Incident Status */}
                    <TableCell className="table-cell">
                      <HvTypography>{alert.incident_status}</HvTypography>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="table-cell">
                      <HvButton category="primary">
                        Stop LED / Buzzer
                      </HvButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default AllAlertsFloorWiseTable;
