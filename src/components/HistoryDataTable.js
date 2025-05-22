import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvPagination,
  HvCheckBox,
  HvTypography,
  HvInput,
  HvFilterGroup,
  useHvData,
  useHvPagination,
  useHvGlobalFilter,
  useHvFilters,
} from "@hitachivantara/uikit-react-core";
import { Filters } from "@hitachivantara/uikit-react-icons";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, TextField } from "@mui/material";
import { CSVLink } from "react-csv";

const HistoryDataTable = ({ data }) => {
  console.log("Data received in HistoryDataTable:", data);
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isViewAll, setIsViewAll] = useState(false);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState({});
  const [columnSearch, setColumnSearch] = useState("");

  // Default columns to show in toggles and table by default
  const defaultColumns = [
    "device_id",
    "health",
    "connection",
    "description",
    "timestamp",
    "datetime",
    "sensor_name",
    "sensor_type",
    "sensor_status",
  ];

  // Derive all columns dynamically from the first data item
  const allColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key !== "id"); // Exclude 'id' if not needed
  }, [data]);

  // Initialize visible columns to default columns only
  const initialVisibleColumns = useMemo(() => {
    const initial = {};
    allColumns.forEach((col) => {
      initial[col] = defaultColumns.includes(col); // Only default columns are true
    });
    return initial;
  }, [allColumns]);

  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);

  // Reset to default columns when data changes (new filter applied)
  useEffect(() => {
    console.log("Resetting visibleColumns to default due to data change");
    setVisibleColumns(initialVisibleColumns);
    setIsViewAll(false); // Reset View All state
  }, [data, initialVisibleColumns]);

  useEffect(() => {
    console.log("Current visibleColumns:", visibleColumns);
  }, [visibleColumns]);

  // Handle "View" button toggle
  const handleViewToggle = useCallback(() => {
    setIsViewAll((prev) => {
      const newIsViewAll = !prev;
      setVisibleColumns((prevColumns) => {
        const newState = { ...prevColumns };
        if (newIsViewAll) {
          allColumns.forEach((col) => {
            newState[col] = true; // Show all columns in table
          });
          console.log("View All columns:", newState);
        } else {
          allColumns.forEach((col) => {
            newState[col] = defaultColumns.includes(col); // Reset to default columns
          });
          console.log("Reset visibleColumns to:", newState);
        }
        return newState;
      });
      return newIsViewAll;
    });
  }, [allColumns, defaultColumns]);

  // Handle opening the column selection dialog
  const handleOpenColumnDialog = () => {
    setTempVisibleColumns({ ...visibleColumns }); // Copy current visible columns to temp state
    setColumnSearch(""); // Reset search when opening dialog
    setOpenColumnDialog(true);
  };

  // Handle closing the column selection dialog
  const handleCloseColumnDialog = () => {
    setOpenColumnDialog(false);
    setColumnSearch(""); // Reset search when closing dialog
  };

  // Handle applying column selections from dialog
  const handleApplyColumns = () => {
    setVisibleColumns({ ...tempVisibleColumns });
    setOpenColumnDialog(false);
    setColumnSearch(""); // Reset search after applying
  };

  // Handle column toggle in dialog
  const handleTempColumnToggle = (column) => {
    setTempVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Filter columns based on search input
  const filteredColumns = useMemo(() => {
    if (!columnSearch) return allColumns;
    return allColumns.filter((col) =>
      col.toLowerCase().includes(columnSearch.toLowerCase())
    );
  }, [allColumns, columnSearch]);

  const displayedData = useMemo(
    () =>
      data.slice(0, 50).map((item) => ({
        ...item,
        connection: item.connection ? "True" : "False",
        health: item.health ? "True" : "False",
      })),
    [data]
  );

  const filters = useMemo(() => {
    const opts = {};
    allColumns.forEach((col) => {
      opts[col] = new Set();
    });
    displayedData.forEach((row) => {
      allColumns.forEach((col) => {
        if (row[col] !== undefined && row[col] !== null) {
          opts[col].add(row[col]);
        }
      });
    });
    return allColumns.map((col) => ({
      id: col,
      name: col.replace(/_/g, " ").toUpperCase(),
      data: [...opts[col]].map((value) => ({ id: value, name: value.toString() })),
    }));
  }, [displayedData, allColumns]);

  const handleColumnToggle = useCallback((column) => {
    setVisibleColumns((prev) => {
      const newState = {
        ...prev,
        [column]: !prev[column],
      };
      console.log(`Toggling column ${column}: ${prev[column]} -> ${!prev[column]}`);
      return newState;
    });
  }, []);

  const visibleCols = useMemo(() => {
    const cols = allColumns.filter((col) => visibleColumns[col]);
    console.log("Visible columns:", cols);
    return cols;
  }, [visibleColumns, allColumns]);

  const columns = useMemo(
    () =>
      visibleCols.map((col) => ({
        Header: col.replace(/_/g, " ").toUpperCase(),
        accessor: col,
        Cell: ({ value }) => (value ?? "N/A"),
        filter: (rows, columnIds, filterValues) => {
          if (!filterValues?.length) return rows;
          return rows.filter((r) => filterValues.includes(r.values[columnIds[0]]));
        },
      })),
    [visibleCols]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    getHvPaginationProps,
    setGlobalFilter,
    setAllFilters,
  } = useHvData(
    {
      columns,
      data: displayedData,
      initialState: { pageSize: 10, filters: [] },
    },
    useHvGlobalFilter,
    useHvFilters,
    useHvPagination
  );

  const handleFilters = useCallback(
    (_, value) => {
      setSelectedFilters(value || []);
      const hvFilters = (value || []).flatMap((vals, idx) => {
        if (!vals?.length) return [];
        return [
          {
            id: filters[idx].id,
            value: vals,
          },
        ];
      });
      setAllFilters(hvFilters);
    },
    [filters, setAllFilters]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
          marginTop: "6px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {defaultColumns.map((col) => (
            <label key={col} style={{ display: "flex", alignItems: "center" }}>
              <HvCheckBox
                checked={visibleColumns[col] ?? false}
                onChange={() => handleColumnToggle(col)}
                disabled={false}
              />
              <span>{col.replace(/_/g, " ").toUpperCase()}</span>
            </label>
          ))}
          <Button onClick={handleOpenColumnDialog}>All Columns</Button>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <CSVLink data={data} filename={"sensor-event-history.csv"}>
            <Button variant="outlined">Export to CSV</Button>
          </CSVLink>
        </div>
      </div>

      <Dialog open={openColumnDialog} onClose={handleCloseColumnDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          <TextField
            label="Search Columns"
            value={columnSearch}
            onChange={(e) => setColumnSearch(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Type to filter columns..."
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
            {filteredColumns.length > 0 ? (
              filteredColumns.map((col) => (
                <FormControlLabel
                  key={col}
                  control={
                    <Checkbox
                      checked={tempVisibleColumns[col] ?? false}
                      onChange={() => handleTempColumnToggle(col)}
                    />
                  }
                  label={col.replace(/_/g, " ").toUpperCase()}
                />
              ))
            ) : (
              <HvTypography>No columns match your search.</HvTypography>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColumnDialog}>Cancel</Button>
          <Button onClick={handleApplyColumns} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      <HvTableSection
        title={<HvTypography variant="title4">History Data</HvTypography>}
        actions={
          <>
            <Button onClick={handleViewToggle}>
              {isViewAll ? "Reset View" : "View All"}
            </Button>
            <HvInput
              type="search"
              placeholder="Search all columns"
              onChange={(e, value) => setGlobalFilter?.(value)}
            />
            <HvFilterGroup
              ref={filterRef}
              filters={filters}
              value={selectedFilters}
              onChange={handleFilters}
              filterContentProps={{
                adornment: <Filters />,
                placeholder: null,
              }}
            />
          </>
        }
      >
        <HvTableContainer>
          <HvTable {...getTableProps()}>
            <HvTableHead>
              {headerGroups.map((hg) => (
                <HvTableRow
                  {...hg.getHeaderGroupProps()}
                  key={hg.getHeaderGroupProps().key}
                >
                  {hg.headers.map((col) => (
                    <HvTableHeader
                      {...col.getHeaderProps()}
                      key={col.getHeaderProps().key}
                    >
                      {col.render("Header")}
                    </HvTableHeader>
                  ))}
                </HvTableRow>
              ))}
            </HvTableHead>
            <HvTableBody {...getTableBodyProps()}>
              {page.length === 0 ? (
                <HvTableRow>
                  <HvTableCell colSpan={columns.length} style={{ textAlign: "center" }}>
                    No data available
                  </HvTableCell>
                </HvTableRow>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <HvTableRow
                      {...row.getRowProps()}
                      key={row.getRowProps().key}
                    >
                      {row.cells.map((cell) => (
                        <HvTableCell
                          {...cell.getCellProps()}
                          key={cell.getCellProps().key}
                        >
                          {cell.render("Cell")}
                        </HvTableCell>
                      ))}
                    </HvTableRow>
                  );
                })
              )}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
        {page.length > 0 && <HvPagination {...getHvPaginationProps()} />}
      </HvTableSection>
    </>
  );
};

export default HistoryDataTable;