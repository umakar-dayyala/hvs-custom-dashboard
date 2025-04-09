import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Collapse, Paper, Checkbox
} from "@mui/material";
import { Add, Remove, Edit } from "@mui/icons-material";

const InventoryTable = ({
  rows,
  openRow,
  onExpand,
  onDialogOpen,
  selectedIds,
  onSelectRow
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
          <TableRow>
            <TableCell />
            <TableCell sx={{ fontWeight: "bold" }}>Unique Asset Code</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Asset Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Asset Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Logged By</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Log Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Asset Location</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow hover onClick={() => onExpand(row.id)}>
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => onSelectRow(row.id)}
                  />
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.probability}</TableCell>
                <TableCell>{row.severity}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => { e.stopPropagation(); onDialogOpen("add"); }}>
                    <Add color="success" />
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); onDialogOpen("remove", row); }}>
                    <Remove color="error" />
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); onDialogOpen("edit", row); }}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={openRow === row.id} timeout="auto" unmountOnExit>
                    <div style={{ padding: 16 }}>
                      <strong>Details:</strong><br />
                      Title: {row.title} | Type: {row.type}<br />
                      Status: {row.status} | Location: {row.priority}<br />
                      Logged By: {row.probability} | Log Date: {row.severity}
                    </div>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
