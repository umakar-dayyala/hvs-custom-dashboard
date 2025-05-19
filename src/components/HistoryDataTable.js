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
import { Button } from "@mui/material";
import { CSVLink } from "react-csv";

const HistoryDataTable = ({ data }) => {
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const allColumns = [
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

  const initialVisibleColumns = {
    device_id: true,
    health: true,
    connection: true,
    description: true,
    timestamp: true,
    datetime: true,
    sensor_name: true,
    sensor_type: true,
    sensor_status: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Ensure initial state is correct
    const savedColumns = { ...initialVisibleColumns };
    console.log("Initial visibleColumns:", savedColumns);
    return savedColumns;
  });

  // Log visibleColumns on every render
  useEffect(() => {
    console.log("Current visibleColumns:", visibleColumns);
  }, [visibleColumns]);

  const displayedData = useMemo(() => data.slice(0, 50).map(item => ({
    ...item,
    connection: item.connection ? "True" : "False",
    health: item.health ? "True" : "False",
  })), [data]);

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
      name: col,
      data: [...opts[col]].map((value) => ({ id: value, name: value.toString() })),
    }));
  }, [displayedData]);

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

  const resetColumns = useCallback(() => {
    setVisibleColumns({ ...initialVisibleColumns });
    console.log("Reset visibleColumns to:", initialVisibleColumns);
  }, []);

  const visibleCols = useMemo(() => {
    const cols = allColumns.filter((col) => visibleColumns[col]);
    console.log("Visible columns:", cols);
    return cols;
  }, [visibleColumns]);

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
          {allColumns.map((col) => (
            <label key={col} style={{ display: "flex", alignItems: "center" }}>
              <HvCheckBox
                checked={visibleColumns[col] ?? true}
                onChange={() => handleColumnToggle(col)}
                disabled={false}
              />
              <span>{col.replace(/_/g, " ").toUpperCase()}</span>
            </label>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {/* <Button onClick={resetColumns}>Reset Columns</Button> */}
          <CSVLink data={data} filename={"sensor-event-history.csv"}>
            <Button variant="outlined">Export to CSV</Button>
          </CSVLink>
        </div>
      </div>

      <HvTableSection
        title={<HvTypography variant="title4">History Data</HvTypography>}
        actions={
          <>
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
              {page.map((row) => {
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
              })}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
        {page.length > 0 && <HvPagination {...getHvPaginationProps()} />}
      </HvTableSection>
    </>
  );
};

export default HistoryDataTable;