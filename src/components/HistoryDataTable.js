import React, { useState, useMemo, useRef } from "react";
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
  const [tableData, setTableData] = useState([]);

  // Compute all columns from data
  const allColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    setTableData(data);
    return Object.keys(data[0]);
  }, [data]);

  // Initialize visibleColumns with all columns set to true
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const initialVisibility = {};
    allColumns.forEach((col) => {
      initialVisibility[col] = true;
    });
    return initialVisibility;
  });

  // Ensure visibleColumns is updated when allColumns changes
  useMemo(() => {
    setVisibleColumns((prev) => {
      const newVisibility = { ...prev };
      allColumns.forEach((col) => {
        if (!(col in newVisibility)) {
          newVisibility[col] = true; // Set new columns to visible by default
        }
      });
      return newVisibility;
    });
  }, [allColumns]);

  const filters = useMemo(() => {
    const opts = {};
    allColumns.forEach((col) => {
      opts[col] = new Set();
    });
    (data || []).forEach((row) => {
      allColumns.forEach((col) => {
        if (row[col] !== undefined && row[col] !== null) {
          opts[col].add(row[col]);
        }
      });
    });
    return allColumns.map((col) => ({
      id: col,
      name: col,
      data: [...opts[col]].map((value) => ({ id: value, name: value })),
    }));
  }, [allColumns, data]);

  // Handle column visibility toggle
  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Compute visible columns
  const visibleCols = useMemo(
    () => allColumns.filter((col) => visibleColumns[col]),
    [allColumns, visibleColumns]
  );

  // Define table columns
  const columns = useMemo(
    () =>
      visibleCols.map((col) => ({
        Header: col,
        accessor: col,
        filter: (rows, columnIds, filterValues) => {
          if (!filterValues?.length) return rows;
          return rows.filter((r) =>
            filterValues.includes(r.values[columnIds[0]])
          );
        },
      })),
    [visibleCols]
  );

  // Initialize table hooks
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
      data,
      initialState: { pageSize: 10, filters: [] },
    },
    useHvGlobalFilter,
    useHvFilters,
    useHvPagination
  );

  // Handle filter changes
  const handleFilters = (_, value) => {
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
  };

  return (
    <>
      {/* Column Toggle Section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px",
        marginTop: "6px",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {allColumns.map((col) => (
            <label key={col} style={{ display: "flex", alignItems: "center" }}>
              <HvCheckBox
                checked={visibleColumns[col] ?? true}
                onChange={() => handleColumnToggle(col)}
                disabled={false} 
              />
              <span>{col}</span>
            </label>
          ))}
        </div>
          <CSVLink data={tableData} filename={"sensor-event-history.csv"}>
            <Button variant="outlined">Export to CSV</Button>
          </CSVLink>
        
      </div>

      {/* Table Section with Search and Filters */}
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