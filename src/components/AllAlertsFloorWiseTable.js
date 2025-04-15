import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider } from "@mui/material";
import { HvButton, HvTypography } from "@hitachivantara/uikit-react-core";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "../assets/rightMark.svg";
import CancelIcon from "../assets/crossMark.svg";
import RadiationIcon from "../assets/rRadiological.svg"; // Example icons, replace as needed
import BioIcon from "../assets/rBiological.svg";
import ChemicalIcon from "../assets/rChemical.svg";
import ARadiationIcon from "../assets/aRadiological.svg";
import ABioIcon from "../assets/aBiological.svg";
import AChemicalIcon from "../assets/aChemical.svg";


// Sensor Type Icons Mapping
const sensorTypeIcons = {
  Radiation: RadiationIcon,
  Bio: BioIcon,
  Chemical: ChemicalIcon,
};

// DataTable Component
const AllAlertsFloorWiseTable = ({ floorWiseAlertsData }) => {
  const sensorTypeIcons = (alarm, fault) => ({
    Radiation: alarm ? RadiationIcon : fault ? ARadiationIcon : ARadiationIcon,
    Biological: alarm ? BioIcon : fault ? ABioIcon : ABioIcon,
    Chemical: alarm ? ChemicalIcon : fault ? AChemicalIcon : AChemicalIcon,
  });

  const navigate = useNavigate();
  const routeName = (detector) => {
    const routes = {
      AGM: "agmindividual",
      "AP4C-F": "AP4CIndividual",
      FCAD: "FCADIndividual",
      PRM: "PRMIndividual",
      VRM: "vrmIndividual",
      IBAC: "ibacIndividual",
      MAB: "MABIndividual",
    };
    return routes[detector] || null;
  };

  const handleDetectorClick = (device_id, detector) => {
    const route = routeName(detector);
    if (device_id && route) {
      navigate(`/${route}?device_id=${device_id}`);
    }
  };

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
            {/* {floor.floorName} */}
            {floor.floorName.replace("Detected Alarm | ", "")}
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
                    "Sensor Name",
                    "Alarm",
                    "Correlated Alarm if Any",
                    "Alarm Time Stamp",
                    "Alert",
                    "Alart Time Stamp",
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
                    <TableCell className="table-cell zone-cell">
                      <HvTypography>{alert.zone}</HvTypography>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="table-cell location-cell">
                      <HvTypography>{alert.location}</HvTypography>
                    </TableCell>

                    {/* Alarm Type with Icon */}
                    <TableCell className="table-cell">
                      <Box
                        onClick={() => handleDetectorClick(alert.device_id, alert.detector)}
                        sx={{ cursor: "pointer" }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.25rem",
                          padding: "0.5rem",
                        }}
                      >
                        {/* Dynamic Icon Selection */}
                        {sensorTypeIcons(alert.alarm_columns, alert.fault_columns)[alert.sensor_type] && (
                          <img
                            src={sensorTypeIcons(alert.alarm_columns, alert.fault_columns)[alert.sensor_type]}
                            alt={alert.sensor_type}
                            style={{ width: "32px", height: "32px" }}
                          />
                        )}

                        {/* Sensor Name */}
                        <HvTypography
                          color="atmo2"
                          style={{
                            textDecoration: "underline",
                            color: "#0073E6",
                          }}
                        >
                          {alert.detector}
                        </HvTypography>
                      </Box>

                    </TableCell>

                    {/* No of Alarm */}
                    {/* Time Stamp of Alarm */}
                    <TableCell className="table-cell">
                      {alert.alarm_columns && alert.alarm_columns !== "No" ? (
                        <HvTypography>{alert.alarm_columns}</HvTypography>
                      ) : (
                        <HvTypography>N/A</HvTypography>
                      )}
                    </TableCell>

                      
                    <TableCell className="table-cell">
                      <HvTypography>{alert.correlated_alarms}</HvTypography>
                    </TableCell>

                    {/* Time Stamp of Alarm */}
                    <TableCell className="table-cell">
                      {alert.alarm_timestamp && alert.alarm_timestamp !== "No" ? (
                        <HvTypography>{alert.alarm_timestamp}</HvTypography>
                      ) : (
                        <HvTypography>N/A</HvTypography>
                      )}
                    </TableCell>

                    {/* Incident Status */}
                    <TableCell className="table-cell">
                      {alert.fault_columns && alert.fault_columns !== "No" ? (
                        <HvTypography>{alert.fault_columns}</HvTypography>
                      ) : (
                        <HvTypography>N/A</HvTypography>
                      )}
                    </TableCell>

                    {/* Incident Status */}
                    <TableCell className="table-cell">
                      {alert.fault_timestamp && alert.fault_timestamp !== "No" ? (
                        <HvTypography>{alert.fault_timestamp}</HvTypography>
                      ) : (
                        <HvTypography>N/A</HvTypography>
                      )}
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
