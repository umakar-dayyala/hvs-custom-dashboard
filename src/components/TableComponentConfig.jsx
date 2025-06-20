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
  HvSnackbar,
  HvLoading,
  HvDialog,
  HvDialogTitle,
  HvDialogContent,
  HvDialogActions,
  useHvData,
  useHvFilters,
  useHvGlobalFilter,
  useHvPagination,
} from "@hitachivantara/uikit-react-core";
import { Add, Close, Filters } from "@hitachivantara/uikit-react-icons";
import WriteConfigurationModal from "./ConfigModal";
import { toggleSensorStatus, getStopLedParams } from "../service/ConfigurationPageService";
import { sendStopLedCommand } from "../components/StopLedCommand";
import "../css/configurationPage.css";

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
  tableWrapper: css({
    position: "relative",
  }),
  loadingOverlay: css({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 10,
  }),
};

export const SearchableTable = ({ tableData = [], loading = false, title, refreshData }) => {
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);
  const [port, setPort] = useState(null);
  const [type, setType] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingDeviceId, setPendingDeviceId] = useState(null);

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

  const openModal = (deviceId, location, sensor, ipAddress, port, static_type_flag) => {
    setIpAddress(ipAddress);
    setPort(port);
    setType(static_type_flag);
    setSelectedDeviceId(deviceId);
    setSelectedLocation(location);
    setSelectedSensor(sensor);
    setModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    try {
      const response = await toggleSensorStatus(pendingDeviceId, pendingAction);
      refreshData?.();
      setSnackbarMessage(response.message || "Status updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to update sensor status");
      setSnackbarOpen(true);
    } finally {
      setConfirmDialogOpen(false);
      setPendingAction(null);
      setPendingDeviceId(null);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
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
        Header: "Device ID",
        accessor: "device_id",
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
    ];

    const alarmColumn =
      title === "Stop LED/Buzzer"
        ? [
          {
            Header: "Alarm",
            accessor: "alarm_status",
            filter: "includesSome",
          },
        ]
        : [];

    const statusColumn =
      title === "Activate/Deactivate Sensor"
        ? [
          {
            Header: "Sensor Status",
            accessor: "sensor_status",
            filter: "includesSome",
          },
        ]
        : [];

    const actionColumn = {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => {
        const sensorStatus = row.original.sensor_status;
        const statusActionButton = sensorStatus === "Active" ? "Deactivate" : "Activate";

        if (title === "Stop LED/Buzzer") {
          return (
            <HvButton
              variant="primaryGhost"
              className={classes.actionButton}
              // disabled={row.original.ack_at !== null}
              onClick={async () => {
                const sensorName = row.original.sensor;
                const deviceId = row.original.device_id;
                const ip = row.original.staticIp;
                const port = row.original.staticPort;

                try {
                  // Optional: fetch parameter names for user feedback
                  const res = await getStopLedParams(sensorName, deviceId);
                  const paramNames = res?.data?.map(p => p.parameter_name).join(", ");

                  // Call centralized command logic (this builds + sends the payload)
                  await sendStopLedCommand({ device_id: deviceId, ip, port, sensor_name: sensorName });

                  setSnackbarMessage(
                    paramNames
                      ? `Stop LED/Buzzer command sent. Params: ${paramNames}`
                      : "Command sent. No param names received."
                  );
                } catch (error) {
                  console.error("Stop LED command failed:", error);
                  setSnackbarMessage("Failed to send Stop LED/Buzzer command");
                } finally {
                  setSnackbarOpen(true);
                }
              }}
            >
              Stop LED/Buzzer
            </HvButton>
          );
        }

        if (title === "Activate/Deactivate Sensor") {
          return (
            <HvButton
              variant="primaryGhost"
              className={classes.actionButton}
              onClick={() => {
                setPendingDeviceId(row.original.device_id);
                setPendingAction(sensorStatus === "Active" ? "Inactive" : "Active");
                setConfirmDialogOpen(true);
              }}
            >
              {statusActionButton}
            </HvButton>
          );
        }

        return (
          <HvButton
            variant="primaryGhost"
            className={classes.actionButton}
            onClick={() =>
              openModal(
                row.original.device_id,
                row.original.location,
                row.original.sensor,
                row.original.staticIp,
                row.original.staticPort,
                row.original.static_type_flag
              )
            }
          >
            Write Configuration
          </HvButton>
        );
      },
      disableFilters: true,
    };

    return [...baseColumns, ...alarmColumn, ...statusColumn, actionColumn];
  }, [title]);

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
      initialState: { filters: [] },
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

  return (
    <>
      <HvTableSection
        title={<HvTypography variant="title4" className={classes.title}>{title}</HvTypography>}
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
        {processedFilters?.length > 0 && (
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
                          : array
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
                onClick={() => handleFilters([])}
                className={classes.actionButton}
              >
                Clear
              </HvButton>
            </div>
          </div>
        )}
        <HvTableContainer>
          <div className={classes.tableWrapper}>
            <HvTable {...getTableProps()}>
              <HvTableHead>
                {headerGroups.map((headerGroup) => (
                  <HvTableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
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
                {page.length === 0 ? (
                  <HvTableRow>
                    <HvTableCell colSpan={columns.length} align="center">
                      <HvTypography
                        variant="label"
                        style={{
                          fontWeight: "bold",
                          marginTop: "20px",
                          marginBottom: "20px",
                          display: "inline-block",
                        }}
                      >
                        No data to display
                      </HvTypography>
                    </HvTableCell>
                  </HvTableRow>
                ) : (
                  [...Array(pageSize ?? 0).keys()].map(renderTableRow)
                )}
              </HvTableBody>
            </HvTable>
            {loading && (
              <div className={classes.loadingOverlay}>
                <HvLoading />
              </div>
            )}
          </div>
        </HvTableContainer>
        {tableData.length > 0 && (
          <HvPagination
            {...getHvPaginationProps?.()}
            className={classes.pagination}
            labels={{
              page: "Page",
              of: "of",
              rowsPerPage: "Rows per page",
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

      <HvSnackbar
        label={snackbarMessage}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        offset={90}
      />

      <HvDialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setPendingAction(null);
          setPendingDeviceId(null);
        }}
        classes={{ paper: css({ fontSize: "18px" }) }}
      >
        <HvDialogTitle>Confirm Action</HvDialogTitle>
        <HvDialogContent>
          <HvTypography>
            Are you sure you want to {pendingAction?.toLowerCase()} this sensor?
          </HvTypography>
        </HvDialogContent>
        <HvDialogActions>
          <HvButton
            variant="primary"
            onClick={handleConfirmToggle}
            className={classes.actionButton}
          >
            Confirm
          </HvButton>
          <HvButton
            variant="secondaryGhost"
            onClick={() => {
              setConfirmDialogOpen(false);
              setPendingAction(null);
              setPendingDeviceId(null);
            }}
            className={classes.actionButton}
          >
            Cancel
          </HvButton>
        </HvDialogActions>
      </HvDialog>
    </>
  );
};