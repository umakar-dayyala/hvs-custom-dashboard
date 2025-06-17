import React, { useMemo, useRef, useState } from "react";
import { css, keyframes } from "@emotion/css";
import {
  HvButton,
  HvInput,
  HvFilterGroup,
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
  useHvGlobalFilter,
  useHvPagination,
  useHvFilters,
} from "@hitachivantara/uikit-react-core";
import { Add, Close, Filters } from "@hitachivantara/uikit-react-icons";
import { useNavigate } from "react-router-dom"; // Added import
import RadiationIcon from "../assets/rRadiological.svg";
import BioIcon from "../assets/rBiological.svg";
import ChemicalIcon from "../assets/rChemical.svg";
import ARadiationIcon from "../assets/aRadiological.svg";
import ABioIcon from "../assets/aBiological.svg";
import AChemicalIcon from "../assets/aChemical.svg";

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
    animation: `${slide} 0.5s ease-in-out`,
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
    flexWrap: "wrap",
    gap: "8px",
  }),
  actionButton: css({ padding: "8px 16px" }),
  sortButton: css({ border: "1px solid #e0e0e0" }),
};

const sensorTypeIcons = (isAlarm, isFault) => ({
  Radiation: isAlarm ? RadiationIcon : isFault ? ARadiationIcon : ARadiationIcon,
  Biological: isAlarm ? BioIcon : isFault ? ABioIcon : ABioIcon,
  Chemical: isAlarm ? ChemicalIcon : isFault ? AChemicalIcon : AChemicalIcon,
});

const AllAlertsAlarmTable = ({ floorWiseAlertsData, onDetectorClick }) => {
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate(); // Added useNavigate

  // Added navigation logic
  const routeName = (detector) => {
    const routes = {
      AGM: "agmindividual",
      "AP4C-F": "AP4CIndividual",
      FCAD: "FCADIndividual",
      PRM: "PRMIndividual",
      VRM: "vrmIndividual",
      IBAC: "ibacIndividual",
      MAB: "MABIndividual",
    };
    return routes[detector] || null;
  };

  const handleDetectorClick = (device_id, detector) => {
    const route = routeName(detector);
    if (device_id && route) {
      navigate(`/${route}?device_id=${device_id}`);
    }
  };

  const filters = useMemo(() => {
    const opts = { floor: new Set(), zone: new Set(), sensor_type: new Set() };
    (floorWiseAlertsData || []).forEach(group =>
      (group.alerts || []).forEach(alert => {
        opts.floor.add(alert.floor_and_zone);
        opts.zone.add(alert.zone);
        opts.sensor_type.add(alert.sensor_type);
      })
    );
    return [
      { id: "floor", name: "Floor", data: [...opts.floor].map(v => ({ id: v, name: v })) },
      { id: "zone", name: "Zone", data: [...opts.zone].map(v => ({ id: v, name: v })) },
      { id: "sensor_type", name: "Sensor Type", data: [...opts.sensor_type].map(v => ({ id: v, name: v })) },
    ];
  }, [floorWiseAlertsData]);

  const tableData = useMemo(() => {
    let counter = 1;
    return (floorWiseAlertsData || [])
      .flatMap(group =>
        (group.alerts || []).map(alert => ({
          srl: counter++,
          alarm_timestamp: alert.alarm_timestamp || "NA",
          alarm_desc: alert.alarm_columns || "NA",
          fault_timestamp: alert.fault_timestamp || "NA",
          fault_description: alert.fault_columns || "NA",
          sensor_name: alert.detector,
          sensor_type: alert.sensor_type,
          floor: alert.floor_and_zone,
          zone: alert.zone,
          location: alert.location,
          correlated_alarm: alert.correlated_alarms,
          isAlarm: !!alert.alarm_columns && alert.alarm_columns !== "No",
          isFault: !!alert.fault_columns && alert.fault_columns !== "No",
          device_id: alert.device_id,
          alarm_status: alert.alarm_status || "",
        }))
      )
      .sort((a, b) => {
        const isA = a.alarm_status === "Alarm" ? 1 : 0;
        const isB = b.alarm_status === "Alarm" ? 1 : 0;
        return isB - isA;
      });
  }, [floorWiseAlertsData]);

    const columns = useMemo(() => [
      { Header: "Sr No", accessor: "srl", disableFilters: true },
      { Header: "Alarm Timestamp", accessor: "alarm_timestamp", disableFilters: true },
      { Header: "Alarm Description", accessor: "alarm_desc" },
      { Header: "Fault Timestamp", accessor: "fault_timestamp", disableFilters: true },
      { Header: "Fault Description", accessor: "fault_description" },
      {
        Header: "Sensor Name",
        accessor: "sensor_name",
        filter: (rows, columnIds, filterValues) => {
          if (!filterValues?.length) return rows;
          return rows.filter(r => filterValues.includes(r.values[columnIds[0]]));
        },
        Cell: ({ row }) => {
          const { sensor_name, sensor_type, isAlarm, isFault, device_id } = row.original;
          const Icon = sensorTypeIcons(isAlarm, isFault)[sensor_type];
          return (
            <div
              onClick={() => {
                handleDetectorClick(device_id, sensor_name); // Added navigation
                onDetectorClick?.(device_id, sensor_name); // Preserved original prop
              }}
              style={{ display: "flex", alignItems: "center", cursor: onDetectorClick ? "pointer" : "default", gap: "0.5rem" }}
            >
              {Icon && <img src={Icon} alt={sensor_type} style={{ width: 24, height: 24 }} />}
              <HvTypography>{sensor_name}</HvTypography>
            </div>
          );
        },
      },
      {
        Header: "Floor",
        accessor: "floor",
        filter: (rows, columnIds, filterValues) => {
          if (!filterValues?.length) return rows;
          return rows.filter(r => filterValues.includes(r.values[columnIds[0]]));
        },
      },
      {
        Header: "Zone",
        accessor: "zone",
        filter: (rows, columnIds, filterValues) => {
          if (!filterValues?.length) return rows;
          return rows.filter(r => filterValues.includes(r.values[columnIds[0]]));
        },
      },
      {
        Header: "Sensor Type",
        accessor: "sensor_type",
        filter: (rows, columnIds, filterValues) => {
          if (!filterValues?.length) return rows;
          return rows.filter(r => filterValues.includes(r.values[columnIds[0]]));
        },
      },
      { Header: "Location", accessor: "location" },
      { Header: "Correlated Alarm", accessor: "correlated_alarm" },
      // {
      //   Header: "Action",
      //   accessor: "action",
      //   disableFilters: true,
      //   Cell: () => <HvButton className={classes.actionButton} category="primary">Stop LED / Buzzer</HvButton>,
      // },
    ], [onDetectorClick]);

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      setGlobalFilter,
      setAllFilters,
      getHvPaginationProps,
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

    const handleFilters = (_, value) => {
      setSelectedFilters(value || []);
      const hvf = (value || []).flatMap((vals, idx) => {
        if (!vals?.length) return [];
        return [{
          id: filters[idx].id,
          value: vals,
        }];
      });
      setAllFilters(hvf);
    };

    const sorted = useMemo(() => [...page].sort((a, b) => (sortOrder === "asc" ? a.index - b.index : b.index - a.index)), [page, sortOrder]);

    return (
      <HvTableSection
        title={<HvTypography variant="title4">Sensor Data</HvTypography>}
        actions={
          <>
            <HvInput type="search" placeholder="Search all columns" onChange={(e, v) => setGlobalFilter?.(v)} />
            <HvFilterGroup
              ref={filterRef}
              filters={filters}
              value={selectedFilters}
              onChange={handleFilters}
              filterContentProps={{ adornment: <Filters />, placeholder: null }}
            />
            <HvButton onClick={() => setSortOrder(o => (o === "asc" ? "desc" : "asc"))} variant="secondaryGhost" className={classes.sortButton}>
              {/* Sort ({sortOrder}) */}
              Sort ({sortOrder === "asc" ? "desc" : "asc"})

            </HvButton>
          </>
        }
      >
        {selectedFilters?.flat().length > 0 && (
          <div className={classes.filtersContainer}>
            <div className={classes.filters}>
              <HvButton variant="primaryGhost" startIcon={<Add />} onClick={() => filterRef.current?.click()}>
                Add Filter
              </HvButton>
              <div className={classes.gemsContainer}>
                {selectedFilters.flatMap((vals, i) => vals?.map(val => ({ id: filters[i].id, value: val }))).map((f, idx) => (
                  <HvButton
                    key={`${f.id}-${f.value}`}
                    startIcon={<Close />}
                    variant="secondarySubtle"
                    onClick={() => {
                      const newSel = selectedFilters.map((arr, j) =>
                        j === filters.findIndex(flt => flt.id === f.id) ? arr.filter(x => x !== f.value) : arr
                      );
                      handleFilters(null, newSel);
                    }}
                  >
                    {`${f.id}: ${f.value}`}
                  </HvButton>
                ))}
              </div>
              <HvButton variant="secondaryGhost" onClick={() => handleFilters(null, [])}>
                Clear All
              </HvButton>
            </div>
          </div>
        )}
        <HvTableContainer>
          <HvTable {...getTableProps()}>
            <HvTableHead>
              {headerGroups.map(hg => (
                <HvTableRow {...hg.getHeaderGroupProps()} key={hg.getHeaderGroupProps().key}>
                  {hg.headers.map(col => (
                    <HvTableHeader {...col.getHeaderProps()} key={col.getHeaderProps().key}>
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
                      No Active alram and alerts found ✅.
                    </HvTypography>
                  </HvTableCell>
                </HvTableRow>
              ) : (
                [...Array(pageSize ?? 0).keys()].map(i => {
                  const row = sorted[i];
                  if (!row)
                    return <HvTableRow key={i}><HvTableCell colSpan={columns.length} /></HvTableRow>;
                  prepareRow(row);
                  return (
                    <HvTableRow {...row.getRowProps()} key={row.getRowProps().key}>
                      {row.cells.map(cell => (
                        <HvTableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
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
        {page.length > 0 && (
          <HvPagination {...getHvPaginationProps()} labels={{ pageSizePrev: "", pageSizeEntryName: `of ${tableData.length}` }} />
        )}
      </HvTableSection>
    );
  };

  export default AllAlertsAlarmTable;