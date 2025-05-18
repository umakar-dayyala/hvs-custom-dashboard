import { useEffect, useMemo, useRef, useState } from "react";
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
import "../css/configurationPage.css";
import { fetchConfigurationData } from '../service/ConfigurationPageService';

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
    fontSize: "18px",
  }),
  filters: css({
    display: "flex",
    width: "100%",
    padding: "8px",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "18px",
  }),
  gemsContainer: css({
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    padding: "0 8px",
    flexWrap: "wrap",
    gap: "8px",
    fontSize: "18px",
  }),
  actionButton: css({
    padding: "8px 16px",
    fontSize: "18px",
  }),
  tableHeader: css({
    fontSize: "18px",
    fontWeight: "bold",
  }),
  tableCell: css({
    fontSize: "18px",
  }),
  input: css({
    fontSize: "18px",
  }),
  pagination: css({
    fontSize: "18px",
  }),
  title: css({
    fontSize: "20px",
    fontWeight: "bold",
  }),
  filterGroup: css({
    fontSize: "18px",
  }),
};

export const SearchableTable = () => {
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState(null);
  const[port,setPort]=useState(null);
  const[type,setType]=useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchConfigurationData();
        const processedData = response.data.map(item => ({
          staticPort: item.staticPort,
          static_type_flag: item.static_type_flag,
          staticIp: item.staticIp,
          device_id: item.device_id,
          floor: item.floor,
          zone: item.zone,
          location: item.location,
          type: item.sensor_type,
          sensor: item.sensor,
          action: item.action
        }));
        setTableData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate filter options based on the actual API data
  const filters = useMemo(() => {
    if (tableData.length === 0) return [];
    
    return [
      {
        id: "floor",
        name: "Floor",
        data: [...new Set(tableData.map(item => item.floor))].map(value => ({
          id: value,
          name: value
        }))
      },
      {
        id: "zone",
        name: "Zone",
        data: [...new Set(tableData.map(item => item.zone))].map(value => ({
          id: value,
          name: value
        }))
      },
      {
        id: "type",
        name: "Type",
        data: [...new Set(tableData.map(item => item.type))].map(value => ({
          id: value,
          name: value
        }))
      }
    ];
  }, [tableData]);

  const columns = useMemo(() => [
    {
      Header: "S.NO",
      accessor: "sno",
      Cell: ({ row }) => row.index + 1,
    },
    {
      Header: "Floor",
      accessor: "floor",
      filter: "includesSome",
    },
    {
      Header: "Zone",
      accessor: "zone",
      filter: "includesSome",
    },
    {
      Header: "Location",
      accessor: "location",
      filter: "includesSome",
    },
    {
      Header: "Type",
      accessor: "type",
      filter: "includesSome",
    },
    {
      Header: "Sensor",
      accessor: "sensor",
      filter: "includesSome",
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <HvButton
          variant="primaryGhost"
          className={classes.actionButton}
          onClick={() => openModal(row.original.device_id, row.original.location, row.original.sensor,row.original.staticIp,row.original.staticPort,row.original.static_type_flag)}
        >
          Write Configuration
        </HvButton>
      ),
      disableFilters: true,
    },
  ], []);

  const openModal = (deviceId, location, sensor,ipAddress,port,static_type_flag) => {
    setIpAddress(ipAddress);
    setPort(port);
    setType(static_type_flag);
    setSelectedDeviceId(deviceId);
    setSelectedLocation(location);
    setSelectedSensor(sensor);
    setModalOpen(true);
  };

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
  }, [selectedFilters, filters]);

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
      data: tableData,
      initialState: {
        filters: [],
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
            <HvTableCell key={cellKey} {...cellProps} className={classes.tableCell}>
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

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <>
      <HvTableSection
        title={<HvTypography variant="title4" className={classes.title}>Sensor Data</HvTypography>}
        actions={
          <>
            <HvInput
              type="search"
              placeholder="Search all columns"
              onChange={(e, v) => setGlobalFilter?.(v)}
              className={classes.input}
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
              className={classes.filterGroup}
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
                className={classes.actionButton}
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
                    className={classes.actionButton}
                  >
                    {category.label}: {value.label}
                  </HvButton>
                ))}
              </div>
              <HvButton
                variant="secondaryGhost"
                onClick={() => handleFilters(undefined)}
                className={classes.actionButton}
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
                      className={classes.tableHeader}
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
        {tableData.length > 0 && (
          <HvPagination
            {...getHvPaginationProps?.()}
            className={classes.pagination}
            labels={{
              pageSizePrev: "",
              pageSizeEntryName: `of ${tableData.length}`,
            }}
          />
        )}
      </HvTableSection>

      <WriteConfigurationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        deviceId={selectedDeviceId}
        location={selectedLocation}
        sensor={selectedSensor}
        ip={ipAddress}
        sensor_port={port}
        static_type_flag={type}
      />
    </>
  );
};