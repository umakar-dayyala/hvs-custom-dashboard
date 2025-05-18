import React from "react";
import {
  HvTable,
  HvTableHead,
  HvTableRow,
  HvTableHeader,
  HvTableBody,
  HvTableCell,
  HvCheckBox,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { IconButton, Tooltip, Box } from "@mui/material";
import { Add, Remove, Edit, ExpandMore, ExpandLess } from "@mui/icons-material";
import "../css/InventoryTable.css"; 

const InventoryTable = ({
  data,
  filters = {},
  selectedIds = [],
  onSelectRow = () => {},
  onDialogOpen,
  openRow,
  onExpand,
}) => {
  const parents = (data || []).filter((p) => {
    if (!filters.type || p.assetType === filters.type) {
      const children = Array.isArray(p.children) ? p.children : [];
      p.filteredChildren = children.filter(
        (c) =>
          c &&
          (!filters.location || c.location === filters.location) &&
          (!filters.status || c.status === filters.status)
      );
      return p.filteredChildren.length > 0 || (!filters.location && !filters.status);
    }
    return false;
  });

  const handleHeaderCheckboxChange = () => {
    const allIds = parents.map((p) => p.uniqueAssetTypeCode);
    onSelectRow(allIds, true);
  };

  const totalAssets = parents.reduce((total, p) => total + (p.filteredChildren?.length || 0), 0);

  // Helper for quantity color coding
  const getQuantityStyle = (qty) => {
    if (qty > 10) return "quantityHigh";
    if (qty > 5) return "quantityMedium";
    return "quantityLow";
  };

  return (
    <Box className="tableWrapper">
      <div className="tableTitle">
        <HvTypography variant="title3" style={{ fontWeight: 700 }}>
          Inventory Assets
        </HvTypography>
      </div>

      <div className="tableContainer">
        <HvTable sx={{ minWidth: 650, borderCollapse: "separate", borderSpacing: 0 }}>
          <HvTableHead>
            <HvTableRow>
              <HvTableHeader className="headerCell">
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
                  index % 2 === 1 ? "stripedRow" : ""
                ].filter(Boolean).join(" ");

                return (
                  <React.Fragment key={p.uniqueAssetTypeCode}>
                    <HvTableRow className={rowClasses} onClick={() => onExpand(p.uniqueAssetTypeCode)} hover={!isExp}>
                      <HvTableCell className="checkboxCell" onClick={(e) => e.stopPropagation()}>
                        {/* Checkbox functionality temporarily disabled
                        <HvCheckBox
                          checked={isSel}
                          onChange={() => onSelectRow(p.uniqueAssetTypeCode)}
                        />
                        */}
                      </HvTableCell>
                      <HvTableCell className="tableCell">
                        <Box display="flex" alignItems="center">
                          {isExp ? 
                            <ExpandLess className="expandIcon" style={{ color: "#1976d2" }} /> : 
                            <ExpandMore className="expandIcon" color="action" />
                          }
                          <Box ml={1} className="cellContent">
                            <strong>{p.uniqueAssetTypeCode}</strong>
                          </Box>
                        </Box>
                      </HvTableCell>
                      <HvTableCell className="tableCell">{p.assetType}</HvTableCell>
                      <HvTableCell className="tableCell">
                        <Box className={getQuantityStyle(p.quantity)}>{p.quantity}</Box>
                      </HvTableCell>
                      <HvTableCell className="tableCell">{p.loggedBy}</HvTableCell>
                      <HvTableCell className="tableCell">{p.logDate}</HvTableCell>
                      <HvTableCell className="tableCell">
                        <Box className="actionCell">
                          <Tooltip title="Add Item" arrow placement="top">
                            <IconButton 
                              size="small" 
                              className={`iconButton addButton`}
                              onClick={(e) => { e.stopPropagation(); onDialogOpen("add", p); }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove Item" arrow placement="top">
                            <IconButton 
                              size="small" 
                              className={`iconButton removeButton`}
                              onClick={(e) => { e.stopPropagation(); onDialogOpen("remove", p); }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Item" arrow placement="top">
                            <IconButton 
                              size="small" 
                              className={`iconButton editButton`}
                              onClick={(e) => { e.stopPropagation(); onDialogOpen("edit", p); }}
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
                                    {["Unique Asset ID", "Asset Type", "Manufacturer", "Serial Number", "Name", "Logged By", "Log Date", "Location", "Status", "Comments", "Attachments", "Action"].map((h) => (
                                      <HvTableHeader key={h} className="childHeaderCell">
                                        {h}
                                      </HvTableHeader>
                                    ))}
                                  </HvTableRow>
                                </HvTableHead>
                                <HvTableBody>
                                  {children.map((c) => (
                                    <HvTableRow key={c.uniqueAssetID} hover style={{ borderBottom: "1px solid #f0f0f0" }}>
                                      <HvTableCell className="tableCell"><strong>{c.uniqueAssetID}</strong></HvTableCell>
                                      <HvTableCell className="tableCell">{c.assetType}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.assetManufacturer || "—"}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.assetSerialNumber || "—"}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.asset_name || "—"}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.loggedBy}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.logDate}</HvTableCell>
                                      <HvTableCell className="tableCell">{c.location}</HvTableCell>
                                      <HvTableCell className="tableCell">
                                        <Box className={`statusBadge ${c.status === "Active" ? "activeStatus" : 
                                                                     c.status === "Inactive" ? "inactiveStatus" : 
                                                                     "removedStatus"}`}>
                                          {c.status}
                                        </Box>
                                      </HvTableCell>
                                      <HvTableCell className="tableCell">
                                        <Tooltip title={c.comments || "No comments"} arrow>
                                          <span className="cellContent">{c.comments || "—"}</span>
                                        </Tooltip>
                                      </HvTableCell>
                                      <HvTableCell className="tableCell">
                                        {c.attachments ? (
                                          <Box className="attachmentBadge">
                                            {c.attachments}
                                          </Box>
                                        ) : "None"}
                                      </HvTableCell>
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