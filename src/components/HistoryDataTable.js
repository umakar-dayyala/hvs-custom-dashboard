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
import { debounce } from "lodash";
import { Export } from "./ExportOptionHistorical";

const HistoryDataTable = ({ data, tableFilters }) => {
  console.log("HistoryDataTable rendered with filter:", tableFilters);
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isViewAll, setIsViewAll] = useState(false);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState({});
  const [columnSearch, setColumnSearch] = useState("");

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

  const allColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key !== "id");
  }, [data]);

  const initialVisibleColumns = useMemo(() => {
    const initial = {};
    allColumns.forEach((col) => {
      initial[col] = defaultColumns.includes(col);
    });
    return initial;
  }, [allColumns]);

  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);

  useEffect(() => {
    const newColumns = data && data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "id") : [];
    if (JSON.stringify(newColumns) !== JSON.stringify(allColumns)) {
      setVisibleColumns(initialVisibleColumns);
      setIsViewAll(false);
    }
  }, [data, initialVisibleColumns, allColumns]);

  const handleColumnToggle = useCallback(
    debounce((column) => {
      setVisibleColumns((prev) => ({
        ...prev,
        [column]: !prev[column],
      }));
    }, 200),
    []
  );

  const handleViewToggle = useCallback(() => {
    setIsViewAll((prev) => {
      const newIsViewAll = !prev;
      setVisibleColumns((prevColumns) => {
        const newState = { ...prevColumns };
        if (newIsViewAll) {
          allColumns.forEach((col) => {
            newState[col] = true;
          });
        } else {
          allColumns.forEach((col) => {
            newState[col] = defaultColumns.includes(col);
          });
        }
        return newState;
      });
      return newIsViewAll;
    });
  }, [allColumns, defaultColumns]);

  const handleOpenColumnDialog = () => {
    setTempVisibleColumns({ ...visibleColumns });
    setColumnSearch("");
    setOpenColumnDialog(true);
  };

  const handleCloseColumnDialog = () => {
    setOpenColumnDialog(false);
    setColumnSearch("");
  };

  const handleApplyColumns = () => {
    setVisibleColumns({ ...tempVisibleColumns });
    setOpenColumnDialog(false);
    setColumnSearch("");
  };

  const handleTempColumnToggle = (column) => {
    setTempVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      setColumnSearch(value);
    }, 300),
    []
  );

  const filteredColumns = useMemo(() => {
    if (!columnSearch) return allColumns;
    return allColumns.filter((col) =>
      col.toLowerCase().includes(columnSearch.toLowerCase())
    );
  }, [allColumns, columnSearch]);

  const displayedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        connection: item.connection ? "True" : "False",
        health: item.health ? "True" : "False",
      })),
    [data]
  );

  const columnFilters = useMemo(() => {
    const visibleCols = allColumns.filter((col) => visibleColumns[col]);
    const opts = {};
    visibleCols.forEach((col) => {
      opts[col] = new Set();
    });
    displayedData.forEach((row) => {
      visibleCols.forEach((col) => {
        if (row[col] !== undefined && row[col] !== null) {
          opts[col].add(row[col]);
        }
      });
    });
    return visibleCols.map((col) => ({
      id: col,
      name: col.replace(/_/g, " ").toUpperCase(),
      data: [...opts[col]].map((value) => ({ id: value, name: value.toString() })),
    }));
  }, [displayedData, visibleColumns, allColumns]);

  const visibleCols = useMemo(() => {
    return allColumns.filter((col) => visibleColumns[col]);
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
            id: columnFilters[idx].id,
            value: vals,
          },
        ];
      });
      setAllFilters(hvFilters);
    },
    [columnFilters, setAllFilters]
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
          <Export data={data} allColumns={allColumns} filters={tableFilters} />
        </div>
      </div>

      <Dialog open={openColumnDialog} onClose={handleCloseColumnDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          <TextField
            label="Search Columns"
            value={columnSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
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
              filters={columnFilters}
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