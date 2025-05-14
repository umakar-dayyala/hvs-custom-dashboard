import React, { useState, useMemo } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TableContainer, TablePagination, Checkbox, FormControlLabel, Box, Typography
} from "@mui/material";

const HistoryDataTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState({});

  // Dynamically extract all unique columns from the data
  const allColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return keys;
  }, [data]);

  // Initialize column visibility once data is loaded
  useMemo(() => {
    const initialVisibility = {};
    allColumns.forEach(col => initialVisibility[col] = true);
    setVisibleColumns(initialVisibility);
  }, [allColumns]);

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const visibleCols = allColumns.filter(col => visibleColumns[col]);

  return (
    <>
      <Box mb={2}>
        <Typography variant="subtitle1">Toggle Columns</Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {allColumns.map((col) => (
            <FormControlLabel
              key={col}
              control={
                <Checkbox
                  checked={visibleColumns[col] ?? true}
                  onChange={() => handleColumnToggle(col)}
                />
              }
              label={col}
            />
          ))}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleCols.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx}>
                  {visibleCols.map((col) => (
                    <TableCell key={col}>{row[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
    </>
  );
};

export default HistoryDataTable;
