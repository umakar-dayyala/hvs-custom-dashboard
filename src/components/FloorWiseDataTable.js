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
import CheckCircleIcon from "../assets/rightMark.svg";
import CancelIcon from "../assets/crossMark.svg";
import "../css/FloorWiseDataTable.css";

const FloorWiseDataTable = ({ data }) => (
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
        {data.map((row, index) => (
          <TableRow key={index} className="body-row">
            {/* Sl No */}
            <TableCell className="table-cell">
              <HvTypography>{String(index + 1).padStart(2, "0")}</HvTypography>
            </TableCell>

            {/* Zone */}
            <TableCell className="table-cell">
              <HvTypography>{row.zone}</HvTypography>
            </TableCell>

            {/* Location */}
            <TableCell className="table-cell">
              <HvTypography>{row.location}</HvTypography>
            </TableCell>

            {/* Detector */}
            <TableCell className="table-cell">
              <HvTypography color={row.alarm === "Yes" ? "negative" : "positive"}>
                {row.detector}
              </HvTypography>
            </TableCell>

            {/* Offline/Online */}
            <TableCell className="table-cell">
              <img
                src={row.isOnline ? CheckCircleIcon : CancelIcon}
                alt={row.isOnline ? "Online" : "Offline"}
                className="status-icon"
              />
            </TableCell>

            {/* Alarm & Alerts */}
            <TableCell className="table-cell">
              <HvTypography>{row.alarmCount}</HvTypography>
            </TableCell>

            {/* Description */}
            <TableCell className="table-cell">
              <HvTypography color={row.description ? "negative" : "neutral"}>
                {row.description || "-"}
              </HvTypography>
            </TableCell>

            {/* Stop Button */}
            <TableCell className="table-cell">
              <HvButton category="primary" disabled={!row.alarm}>
                Stop LED / Buzzer
              </HvButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default FloorWiseDataTable;
