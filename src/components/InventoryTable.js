import React, { useMemo, useRef, useState } from "react";
import {
  HvTable,
  HvTableHead,
  HvTableRow,
  HvTableHeader,
  HvTableBody,
  HvTableCell,
  HvCheckBox,
  HvTypography,
  HvInput,
  HvFilterGroup,
  HvButton,
} from "@hitachivantara/uikit-react-core";
import { IconButton, Tooltip, Box } from "@mui/material";
import { Add, Remove, Edit, ExpandMore, ExpandLess, Close } from "@mui/icons-material";
import { Filters } from "@hitachivantara/uikit-react-icons";
import "../css/InventoryTable.css";

const InventoryTable = ({
  data = [],
  selectedIds = [],
  onSelectRow = () => {},
  onDialogOpen,
  openRow,
  onExpand,
}) => {
  const filterRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // State for global search

  // Dynamic filter options (excluding Comments and Attachments)
  const filterOptions = useMemo(() => {
    const opts = {
      uniqueAssetTypeCode: new Set(),
      assetType: new Set(),
      loggedBy: new Set(),
      logDate: new Set(),
      location: new Set(),
      status: new Set(),
      manufacturer: new Set(),
      serialNumber: new Set(),
      name: new Set(),
    };

    data.forEach((parent) => {
      opts.uniqueAssetTypeCode.add(parent.uniqueAssetTypeCode);
      opts.assetType.add(parent.assetType);
      opts.loggedBy.add(parent.loggedBy);
      opts.logDate.add(parent.logDate);
      (parent.children || []).forEach((child) => {
        opts.location.add(child.location);
        opts.status.add(child.status);
        opts.manufacturer.add(child.assetManufacturer);
        opts.serialNumber.add(child.assetSerialNumber);
        opts.name.add(child.asset_name);
      });
    });

    return [
      { id: "uniqueAssetTypeCode", name: "Unique Asset Type Code", data: [...opts.uniqueAssetTypeCode].map((v) => ({ id: v, name: v })) },
      { id: "assetType", name: "Asset Type", data: [...opts.assetType].map((v) => ({ id: v, name: v })) },
      { id: "loggedBy", name: "Logged By", data: [...opts.loggedBy].map((v) => ({ id: v, name: v })) },
      { id: "logDate", name: "Log Date", data: [...opts.logDate].map((v) => ({ id: v, name: v })) },
      { id: "location", name: "Location", data: [...opts.location].map((v) => ({ id: v, name: v })) },
      { id: "status", name: "Status", data: [...opts.status].map((v) => ({ id: v, name: v })) },
      { id: "manufacturer", name: "Manufacturer", data: [...opts.manufacturer].map((v) => ({ id: v, name: v })) },
      { id: "serialNumber", name: "Serial Number", data: [...opts.serialNumber].map((v) => ({ id: v, name: v })) },
      { id: "name", name: "Name", data: [...opts.name].map((v) => ({ id: v, name: v })) },
    ];
  }, [data]);

  // Handle filter changes
  const handleFilters = (_, value) => {
    setSelectedFilters(value || []);
  };

  // Filter and search logic
  const parents = useMemo(() => {
    return data.filter((p) => {
      const matchesGlobalFilter = globalFilter
        ? Object.values(p).some(
            (val) =>
              val &&
              typeof val === "string" &&
              val.toLowerCase().includes(globalFilter.toLowerCase())
          ) ||
          (p.children || []).some((child) =>
            Object.values(child).some(
              (val) =>
                val &&
                typeof val === "string" &&
                val.toLowerCase().includes(globalFilter.toLowerCase())
            )
          )
        : true;

      const matchesFilters = selectedFilters.every((filterGroup, idx) => {
        if (!filterGroup?.length) return true;
        const filterId = filterOptions[idx].id;
        if (["uniqueAssetTypeCode", "assetType", "loggedBy", "logDate"].includes(filterId)) {
          return filterGroup.includes(p[filterId]);
        }
        return (p.children || []).some((child) => filterGroup.includes(child[filterId]));
      });

      // Apply filtered children for display
      const children = Array.isArray(p.children) ? p.children : [];
      p.filteredChildren = children.filter((c) =>
        selectedFilters.every((filterGroup, idx) => {
          if (!filterGroup?.length) return true;
          const filterId = filterOptions[idx].id;
          return ["location", "status", "manufacturer", "serialNumber", "name"].includes(filterId)
            ? filterGroup.includes(c[filterId])
            : true;
        })
      );

      return matchesGlobalFilter && matchesFilters;
    });
  }, [data, selectedFilters, globalFilter, filterOptions]);

  const handleHeaderCheckboxChange = () => {
    const allIds = parents.map((p) => p.uniqueAssetTypeCode);
    onSelectRow(allIds, true);
  };

  const totalAssets = parents.reduce((total, p) => total + (p.filteredChildren?.length || 0), 0);

  // // Helper for quantity color coding
  // const getQuantityStyle = (qty) => {
  //   if (qty > 10) return "quantityHigh";
  //   if (qty > 5) return "quantityMedium";
  //   return "quantityLow";
  // };

  return (
    <Box className="tableWrapper">
      <div className="headerContainer">
        <div className="tableTitle">
          <HvTypography variant="title3" style={{ fontWeight: 700 }}>
            Inventory Assets
          </HvTypography>
        </div>
        <div className="tableTitle">
          <div className="filterSearchContainer">
            <HvInput
              type="search"
              placeholder="Search all columns"
              onChange={(e, value) => setGlobalFilter(value)}
            />
            <HvFilterGroup
              ref={filterRef}
              filters={filterOptions}
              value={selectedFilters}
              onChange={handleFilters}
              filterContentProps={{ adornment: <Filters />, placeholder: null }}
            />
          </div>
        </div>
      </div>

      {/* Selected Filters Chips */}
      {selectedFilters?.flat().length > 0 && (
        <div className="filtersContainer">
          <div className="filters">
            <HvButton
              variant="primaryGhost"
              startIcon={<Add />}
              onClick={() => filterRef.current?.click()}
              className="actionButton"
            >
              Add Filter
            </HvButton>
            <div className="gemsContainer">
              {selectedFilters
                .flatMap((vals, i) => vals?.map((val) => ({ id: filterOptions[i].id, value: val })))
                .map((f, idx) => (
                  <HvButton
                    key={`${f.id}-${f.value}`}
                    startIcon={<Close />}
                    variant="secondarySubtle"
                    onClick={() => {
                      const newSel = selectedFilters.map((arr, j) =>
                        j === filterOptions.findIndex((flt) => flt.id === f.id)
                          ? arr.filter((x) => x !== f.value)
                          : arr
                      );
                      handleFilters(null, newSel);
                    }}
                  >
                    {`${f.id}: ${f.value}`}
                  </HvButton>
                ))}
            </div>
            <HvButton
              variant="secondaryGhost"
              onClick={() => handleFilters(null, [])}
            >
              Clear All
            </HvButton>
          </div>
        </div>
      )}

      <div className="tableContainer">
        <HvTable sx={{ minWidth: 650, borderCollapse: "separate", borderSpacing: 0 }}>
          <HvTableHead>
            <HvTableRow>
              <HvTableHeader className="headerCell checkboxCell">
                {/* Checkbox functionality temporarily disabled
                <HvCheckBox
                  checked={
                    parents.length > 0 &&
                    parents.every((p) => selectedIds.includes(p.uniqueAssetTypeCode))
                  }
                  indeterminate={
                    parents.length > 0 &&
                    selectedIds.length > 0 &&
                    !parents.every((p) => selectedIds.includes(p.uniqueAssetTypeCode)) &&
                    parents.some((p) => selectedIds.includes(p.uniqueAssetTypeCode))
                  }
                  onChange={handleHeaderCheckboxChange}
                />
                */}
              </HvTableHeader>
              {["Unique Asset Type Code", "Asset Type", "Quantity", "Logged By", "Log Date", "Action"].map((hdr) => (
                <HvTableHeader key={hdr} className="headerCell">
                  {hdr}
                </HvTableHeader>
              ))}
            </HvTableRow>
          </HvTableHead>
          <HvTableBody>
            {parents.length > 0 ? (
              parents.map((p, index) => {
                const isSel = selectedIds.includes(p.uniqueAssetTypeCode);
                const isExp = openRow === p.uniqueAssetTypeCode;
                const children = p.filteredChildren || [];

                const rowClasses = [
                  "parentRow",
                  isSel ? "selectedRow" : "",
                  isExp ? "expandedRow" : "",
                  index % 2 === 1 ? "stripedRow" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <React.Fragment key={p.uniqueAssetTypeCode}>
                    <HvTableRow
                      className={rowClasses}
                      onClick={() => onExpand(p.uniqueAssetTypeCode)}
                      hover={!isExp}
                    >
                      <HvTableCell
                        className="checkboxCell"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Checkbox functionality temporarily disabled
                        <HvCheckBox
                          checked={isSel}
                          onChange={() => onSelectRow(p.uniqueAssetTypeCode)}
                        />
                        */}
                      </HvTableCell>
                      <HvTableCell className="tableCell">
                        <Box display="flex" alignItems="center">
                          {isExp ? (
                            <ExpandLess className="expandIcon" style={{ color: "#1976d2" }} />
                          ) : (
                            <ExpandMore className="expandIcon" color="action" />
                          )}
                          <Box ml={1} className="cellContent">
                            <strong>{p.uniqueAssetTypeCode}</strong>
                          </Box>
                        </Box>
                      </HvTableCell>
                      <HvTableCell className="tableCell">{p.assetType}</HvTableCell>
                      <HvTableCell className="tableCell">
                        {/* <Box className={getQuantityStyle(p.quantity)}>{p.quantity}</Box> */}
                        {p.quantity}
                      </HvTableCell>
                      <HvTableCell className="tableCell">{p.loggedBy}</HvTableCell>
                      <HvTableCell className="tableCell">{p.logDate}</HvTableCell>
                      <HvTableCell className="tableCell">
                        <Box className="actionCell">
                          <Tooltip title="Add Item" arrow placement="top">
                            <IconButton
                              size="small"
                              className="iconButton addButton"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDialogOpen("add", p);
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove Item" arrow placement="top">
                            <IconButton
                              size="small"
                              className="iconButton removeButton"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDialogOpen("remove", p);
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Item" arrow placement="top">
                            <IconButton
                              size="small"
                              className="iconButton editButton"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDialogOpen("edit", p);
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </HvTableCell>
                    </HvTableRow>

                    {isExp && (
                      <HvTableRow>
                        <HvTableCell colSpan={7} style={{ padding: "0" }}>
                          <Box className="childTable">
                            {children.length > 0 ? (
                              <HvTable size="small">
                                <HvTableHead>
                                  <HvTableRow>
                                    {[
                                      "Unique Asset ID",
                                      "Asset Type",
                                      "Manufacturer",
                                      "Serial Number",
                                      "Name",
                                      "Logged By",
                                      "Log Date",
                                      "Location",
                                      "Status",
                                      "Comments",
                                      // "Attachments",
                                      "Action",
                                    ].map((h) => (
                                      <HvTableHeader key={h} className="childHeaderCell">
                                        {h}
                                      </HvTableHeader>
                                    ))}
                                  </HvTableRow>
                                </HvTableHead>
                                <HvTableBody>
                                  {children.map((c) => (
                                    <HvTableRow
                                      key={c.uniqueAssetID}
                                      hover
                                      style={{ borderBottom: "1px solid #f0f0f0" }}
                                    >
                                      <HvTableCell className="tableCell">
                                        <strong>{c.uniqueAssetID}</strong>
                                      </HvTableCell>
                                      <HvTableCell className="tableCell">{c.assetType}</HvTableCell>
                                      <HvTableCell className="tableCell">
                                        {c.assetManufacturer || "—"}
                                      </HvTableCell>
                                      <HvTableCell className="tableCell">
                                        {c.assetSerialNumber || "—"}
                                      </HvTableCell>
                                      <HvTableCell className="tableCell">{c.asset_name || "—"}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.loggedBy || "_"}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.logDate}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.location || "_"}</HvTableCell>
                                      <HvTableCell className="tableCell">
                                        <Box
                                          className={`statusBadge ${c.status === "Active"
                                              ? "activeStatus"
                                              : c.status === "Inactive"
                                                ? "inactiveStatus"
                                                : "removedStatus"
                                            }`}
                                        >
                                          {c.status}
                                        </Box>
                                      </HvTableCell>
                                      <HvTableCell className="tableCell">
                                        <Tooltip title={c.comments || "No comments"} arrow>
                                          <span className="commentCell">{c.comments || "—"}</span>
                                        </Tooltip>
                                      </HvTableCell>
                                      {/* <HvTableCell className="tableCell">
                                        {c.attachments ? (
                                          <Box className="attachmentBadge">{c.attachments}</Box>
                                        ) : (
                                          "None"
                                        )}
                                      </HvTableCell> */}
                                      <HvTableCell className="tableCell">
                                        <Box className="actionCell">
                                          <Tooltip title="Remove Asset" arrow placement="top">
                                            <IconButton
                                              size="small"
                                              className="iconButton removeButton"
                                              onClick={() => onDialogOpen("remove", c)}
                                            >
                                              <Remove fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Edit Asset" arrow placement="top">
                                            <IconButton
                                              size="small"
                                              className="iconButton editButton"
                                              onClick={() => onDialogOpen("edit", c)}
                                            >
                                              <Edit fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </Box>
                                      </HvTableCell>
                                    </HvTableRow>
                                  ))}
                                </HvTableBody>
                              </HvTable>
                            ) : (
                              <Box className="noDataMessage">
                                <HvTypography>No items found</HvTypography>
                              </Box>
                            )}
                          </Box>
                        </HvTableCell>
                      </HvTableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <HvTableRow>
                <HvTableCell colSpan={7} className="noDataMessage">
                  <HvTypography>No inventory assets found matching the current filters</HvTypography>
                </HvTableCell>
              </HvTableRow>
            )}
          </HvTableBody>
        </HvTable>
      </div>
    </Box>
  );
};

export default InventoryTable;