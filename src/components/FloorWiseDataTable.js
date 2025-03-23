import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from "@mui/material";
import { HvButton, HvTypography } from "@hitachivantara/uikit-react-core";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "../assets/rightMark.svg";
import CancelIcon from "../assets/crossMark.svg";
import RadiationIcon from "../assets/rRadiological.svg"; // Example icons, replace as needed
import BioIcon from "../assets/rBiological.svg";
import ChemicalIcon from "../assets/rChemical.svg";
import GRadiationIcon from "../assets/gRadiological.svg";
import GBioIcon from "../assets/gBiological.svg";
import GChemicalIcon from "../assets/gChemical.svg";
import "../css/FloorWiseDataTable.css";

const FloorWiseDataTable = ({ data }) => {

  // Sensor Type Icons Mapping
  const sensorTypeIcons = (alarmCount) => ({
    Radiation: alarmCount > 0 ? RadiationIcon : GRadiationIcon,
    Biological: alarmCount > 0 ? BioIcon : GBioIcon,
    Chemical: alarmCount > 0 ? ChemicalIcon : GChemicalIcon,
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

    return routes[detector] || null; // Return null if detector not found
  };

  // Handle detector click and navigate accordingly
  const handleDetectorClick = (device_id, detector) => {
    const route = routeName(detector);
    if (device_id && route) {
      navigate(`/${route}?device_id=${device_id}`);
    }
  };

  return (
    <TableContainer component={Paper} className="table-container">
      <Table className="table">
        {/* Table Header */}
        <TableHead>
          <TableRow className="header-row">
            {[
              "Sl No",
              "Zone",
              "Location",
              "Detector",
              "Offline/Online",
              // "Alarm & Alerts",
              "Description",
              "",
            ].map((header) => (
              <TableCell key={header} className="table-cell1">
                <HvTypography variant="label">{header}</HvTypography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {data?.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index} className="body-row">
                {/* Sl No */}
                <TableCell className="table-cell">
                  <HvTypography>{String(index + 1).padStart(2, "0")}</HvTypography>
                </TableCell>

                {/* Zone */}
                <TableCell className="table-cell">
                  <HvTypography>{row?.s_no?.zone || "-"}</HvTypography>
                </TableCell>

                {/* Location */}
                <TableCell className="table-cell">
                  <HvTypography>{row?.s_no?.location || "-"}</HvTypography>
                </TableCell>

                <TableCell className="table-cell">
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleDetectorClick(row?.s_no?.device_id, row?.s_no?.detector)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.25rem",
                      padding: "0.5rem",
                    }}
                  >

                    {/* Sensor Icon */}

                    {sensorTypeIcons(row?.s_no?.alarms_and_alerts)[row?.s_no?.senor_type] && (
                      <img
                        src={sensorTypeIcons(row?.s_no?.alarms_and_alerts)[row?.s_no?.senor_type]}
                        alt={row?.s_no?.senor_type}
                        style={{ width: "30px", height: "30px" }}
                      />
                    )}

                    {/* Sensor Name */}
                    <HvTypography
                      color="atmo2"
                      style={{
                        textDecoration: "underline",
                        color: "#0073E6", // Keeps the clickable blue color
                      }}
                    >
                      {row?.s_no?.detector || "-"}
                    </HvTypography>
                  </Box>
                </TableCell>

                {/* Offline/Online */}
                <TableCell className="table-cell">
                  <img
                    src={row?.s_no?.offline_online === "Online" ? CheckCircleIcon : CancelIcon}
                    alt={row?.s_no?.offline_online ? "Online" : "Offline"}
                    className="status-icon"
                  />
                </TableCell>

                {/* Alarm & Alerts
                <TableCell className="table-cell">
                  <HvTypography>0{row?.s_no?.alarms_and_alerts || "-"}</HvTypography>
                </TableCell> */}

                <TableCell className="table-cell">
                  <HvTypography>{row?.s_no?.alarm_fault_columns || "-"}</HvTypography>
                </TableCell>

                {/* Stop Button */}
                <TableCell className="table-cell">
                  <HvButton category="primary" disabled={!row?.s_no?.alarms_and_alerts}>
                    Stop LED / Buzzer
                  </HvButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="table-cell">
                <HvTypography>No data to display</HvTypography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FloorWiseDataTable;
