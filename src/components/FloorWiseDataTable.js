import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { HvButton, HvTypography } from "@hitachivantara/uikit-react-core";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "../assets/rightMark.svg";
import CancelIcon from "../assets/crossMark.svg";
import "../css/FloorWiseDataTable.css";

const FloorWiseDataTable = ({ data }) => {
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
              "Alarm & Alerts",
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

                {/* Detector with Link */}
                <TableCell className="table-cell">
                  <HvTypography
                    color="atmo2" // Blue text color from HVS Kit
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#0073E6", // Ensures blue color, adjust if needed
                    }}
                    onClick={() => handleDetectorClick(row?.s_no?.device_id, row?.s_no?.detector)}
                  >
                    {row?.s_no?.detector || "-"}
                  </HvTypography>
                </TableCell>

                {/* Offline/Online */}
                <TableCell className="table-cell">
                  <img
                    src={row?.s_no?.status === "Online" ? CheckCircleIcon : CancelIcon}
                    alt={row?.s_no?.status ? "Online" : "Offline"}
                    className="status-icon"
                  />
                </TableCell>

                {/* Alarm & Alerts */}
                <TableCell className="table-cell">
                  <HvTypography>0{row?.s_no?.alarms_and_alerts || "0"}</HvTypography>
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
                <HvTypography>No data available</HvTypography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FloorWiseDataTable;
