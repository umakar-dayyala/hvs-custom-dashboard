import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import {
  HvCard,
  HvCardContent,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

// ── styled table cells/rows ──────────────────────────────────────────
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#000",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": { backgroundColor: "#f7f7f7" },
  "&:nth-of-type(even)": { backgroundColor: "#fff" },
  "&:last-child td, &:last-child th": { border: 0 },
}));

// ── main component ──────────────────────────────────────────────────
const Imagedata = ({ connectivityData }) => {
  const isEmpty =
    !connectivityData || Object.keys(connectivityData).length === 0;

  const [expanded, setExpanded] = useState(!isEmpty);

  const rows = useMemo(
    () =>
      Object.entries(connectivityData || {}).map(([key, value]) => (
        <StyledTableRow key={key}>
          <StyledTableCell component="th" scope="row">
            {key}
          </StyledTableCell>
          <StyledTableCell align="right">{value}</StyledTableCell>
        </StyledTableRow>
      )),
    [connectivityData]
  );

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <HvTypography variant="title3" sx={{ fontSize: "1.25rem" }}>
          Images Data
        </HvTypography>
      </AccordionSummary>

      <AccordionDetails>
        <Box>
          <HvCard
            bgcolor="white"
            style={{
              height: "500px",
              borderRadius: 0,
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
            }}
            statusColor="red"
          >
            <HvCardContent style={{ height: "100%" }}>
              

              {isEmpty ? (
                <Box
                  flex={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <HvTypography variant="title3">No data Available</HvTypography>
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ width: "100%", overflowX: "auto" }}
                >
                  <Table sx={{ minWidth: "100%" }}>
                    <TableBody>{rows}</TableBody>
                  </Table>
                </TableContainer>
              )}
            </HvCardContent>
          </HvCard>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Imagedata;
