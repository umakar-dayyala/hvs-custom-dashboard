import { useMemo, useRef, useState } from "react";
import { css, keyframes } from "@emotion/css";
import {
  HvButton,
  HvFilterGroup,
  HvInput,
  HvPagination,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  HvTypography,
  useHvData,
  useHvFilters,
  useHvGlobalFilter,
  useHvPagination,
} from "@hitachivantara/uikit-react-core";
import { Add, Close, Filters } from "@hitachivantara/uikit-react-icons";
import WriteConfigurationModal from "./ConfigModal";
import { set } from "lodash";

const slide = keyframes({
  "0%": { maxHeight: 0 },
  "100%": { maxHeight: 300 },
});

const classes = {
  filtersContainer: css({
    display: "flex",
    width: "100%",
    backgroundColor: "#f5f5f5",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
    animation: `${slide} 1.5s ease-in-out`,
  }),
  filters: css({
    display: "flex",
    width: "100%",
    padding: "8px",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  gemsContainer: css({
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    padding: "0 8px",
    flexWrap: "wrap",
    gap: "8px",
  }),
  actionButton: css({
    padding: "8px 16px",
  }),
};

const sampleData = [
  { device_id: "dev-001", floor: "1F", zone: "Zone 1", location: "Garud Dwar", type: "Biological", sensor: "MAB" },
  { device_id: "dev-002", floor: "2F", zone: "Zone 2", location: "Hans Dwar", type: "Radiological", sensor: "AGM" },
  { device_id: "dev-003", floor: "1F", zone: "Zone 2 (PMO)", location: "Terrace", type: "Biological", sensor: "IBAC" },
  { device_id: "dev-004", floor: "3F", zone: "Zone 3", location: "PMO", type: "Radiological", sensor: "PRM" },
  { device_id: "dev-005", floor: "2F", zone: "Zone 4", location: "shardul dwar", type: "Radiological", sensor: "VRM" },
  { device_id: "dev-006", floor: "1F", zone: "Zone 5", location: "reception", type: "Radiological", sensor: "WRM" },
  { device_id: "dev-006", floor: "1F", zone: "Zone 6", location: "south utility", type: "Chemical", sensor: "AP4C" },
];

// Function to generate unique filter options from data
const generateFilterOptions = (data, field) => {
  const uniqueValues = [...new Set(data.map(item => item[field]))];
  return uniqueValues.map(value => ({
    id: value,
    name: value
  }));
};

// Generate filters dynamically based on sampleData
const filters = [
  {
    id: "floor",
    name: "Floor",
    data: generateFilterOptions(sampleData, "floor")
  },
  {
    id: "zone",
    name: "Zone",
    data: generateFilterOptions(sampleData, "zone")
  },
  {
    id: "type",
    name: "Type",
    data: generateFilterOptions(sampleData, "type")
  }
];

export const SearchableTable = () => {
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const[selectedSensor, setSelectedSensor] = useState(null);

  const openModal = (deviceId,location,sensor) => {
    setSelectedDeviceId(deviceId);
    setSelectedLocation(location);
    setSelectedSensor(sensor);
    setModalOpen(true);
  };

  const columns = useMemo(() => [
    {
      Header: "S.NO",
      accessor: "sno",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Floor",
      accessor: "floor",
      filter: "includesSome", // This enables multi-select filtering
    },
    {
      Header: "Zone",
      accessor: "zone",
      filter: "includesSome", // This enables multi-select filtering
    },
    {
      Header: "Location",
      accessor: "location",
      filter: "includesSome", // This enables multi-select filtering
    },
    {
      Header: "Type",
      accessor: "type",
      filter: "includesSome", // This enables multi-select filtering
    },
    {
      Header: "Sensor",
      accessor: "sensor",
      filter: "includesSome", // This enables multi-select filtering
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <HvButton
          variant="primaryGhost"
          className={classes.actionButton}
          onClick={() => openModal(row.original.device_id, row.original.location,row.original.sensor)}
        >
          Write Configuration
        </HvButton>
      ),
      disableFilters: true,
    },
  ], []);

  const processedFilters = useMemo(() => {
    if (!selectedFilters) return undefined;
    
    return selectedFilters.flatMap((categoryArray, idx) => {
      if (!categoryArray) return [];
      
      return categoryArray.map((value) => ({
        category: {
          label: filters[idx].name,
          id: filters[idx].id,
        },
        value: {
          label: filters[idx].data.find((x) => x.id === value)?.name,
          id: value,
        },
      }));
    });
  }, [selectedFilters]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setGlobalFilter,
    getHvPaginationProps,
    setAllFilters,
    state: { pageSize },
  } = useHvData(
    {
      columns,
      data: sampleData,
      initialState: {
        filters: [], // Initialize with no filters
      },
    },
    useHvGlobalFilter,
    useHvFilters,
    useHvPagination
  );

  const renderTableRow = (i) => {
    const row = page[i];
  
    if (!row)
      return (
        <HvTableRow key={i}>
          <HvTableCell colSpan={100} />
        </HvTableRow>
      );
  
    prepareRow(row);
  
    const { key, ...rowProps } = row.getRowProps();
  
    return (
      <HvTableRow key={key} {...rowProps}>
        {row.cells.map((cell) => {
          const { key: cellKey, ...cellProps } = cell.getCellProps();
          return (
            <HvTableCell key={cellKey} {...cellProps}>
              {cell.render("Cell")}
            </HvTableCell>
          );
        })}
      </HvTableRow>
    );
  };

  const handleFilters = (arrays) => {
    setSelectedFilters(arrays);
    const newFilters = arrays?.flatMap((array, idx) => {
      if (!array || array.length === 0) return [];
      return {
        id: filters[idx].id,
        value: array
      };
    }).filter(Boolean) || [];
    setAllFilters?.(newFilters);
  };

  return (
    <>
      <HvTableSection
        title={<HvTypography variant="title4">Sensor Data</HvTypography>}
        actions={
          <>
            <HvInput
              type="search"
              placeholder="Search all columns"
              onChange={(e, v) => setGlobalFilter?.(v)}
            />
            <HvFilterGroup
              ref={filterRef}
              filters={filters}
              disablePortal={false}
              value={selectedFilters}
              onChange={(event, value) => handleFilters(value)}
              aria-label="Filters"
              filterContentProps={{
                adornment: <Filters aria-hidden />,
                placeholder: null,
              }}
            />
          </>
        }
      >
        {processedFilters && processedFilters.length > 0 && (
          <div className={classes.filtersContainer}>
            <div className={classes.filters}>
              <HvButton
                variant="primaryGhost"
                startIcon={<Add />}
                onClick={() => filterRef.current?.click()}
              >
                Add Filter
              </HvButton>
              <div className={classes.gemsContainer}>
                {processedFilters.map(({ category, value }) => (
                  <HvButton
                    key={`gem-${category.id}-${value.id}`}
                    startIcon={<Close />}
                    variant="secondarySubtle"
                    onClick={() => {
                      const newFilters = selectedFilters?.map((array, idx) =>
                        idx === filters.findIndex((x) => x.id === category.id)
                          ? array.filter((x) => x !== value.id)
                          : array,
                      );
                      handleFilters(newFilters);
                    }}
                    aria-label={`Clear filter ${category.label}: ${value.label}`}
                  >
                    {category.label}: {value.label}
                  </HvButton>
                ))}
              </div>
              <HvButton
                variant="secondaryGhost"
                onClick={() => handleFilters(undefined)}
              >
                Clear
              </HvButton>
            </div>
          </div>
        )}
        <HvTableContainer>
          <HvTable {...getTableProps()}>
            <HvTableHead>
              {headerGroups.map((headerGroup) => (
                <HvTableRow
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.getHeaderGroupProps().key}
                >
                  {headerGroup.headers.map((col) => (
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
              {[...Array(pageSize ?? 0).keys()].map(renderTableRow)}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
        {page.length > 0 && (
          <HvPagination
            {...getHvPaginationProps?.()}
            labels={{
              pageSizePrev: "",
              pageSizeEntryName: `of ${sampleData.length}`,
            }}
          />
        )}
      </HvTableSection>

      <WriteConfigurationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        deviceId={selectedDeviceId}
        location ={selectedLocation}
        sensor={selectedSensor}
      />
    </>
  );
};