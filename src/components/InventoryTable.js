import React from "react";
import {
  HvTableContainer,
  HvTable,
  HvTableHead,
  HvTableRow,
  HvTableHeader,
  HvTableBody,
  HvTableCell,
  HvCheckBox,
} from "@hitachivantara/uikit-react-core";
import { IconButton } from "@mui/material";
import { Add, Remove, Edit } from "@mui/icons-material";

const headerStyle = { backgroundColor: "grey", color: "white" };

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
          (!filters.location || c.location === filters.location) && // Changed from c.assetLocation
          (!filters.status || c.status === filters.status)          // Changed from c.assetStatus
      );
      return p.filteredChildren.length > 0 || (!filters.location && !filters.status);
    }
    return false;
  });
  console.log("Filtered Parents:", parents);

  const handleHeaderCheckboxChange = () => {
    const allIds = parents.map((p) => p.uniqueAssetTypeCode);
    onSelectRow(allIds, true);
  };

  return (
    <HvTableContainer>
      <HvTable>
        <HvTableHead>
          <HvTableRow>
            <HvTableHeader style={headerStyle}>
              <HvCheckBox
                checked={
                  parents.length > 0 &&
                  parents.every((p) => selectedIds.includes(p.uniqueAssetTypeCode))
                }
                indeterminate={
                  selectedIds.length > 0 && selectedIds.length < parents.length
                }
                onChange={handleHeaderCheckboxChange}
              />
            </HvTableHeader>
            {[
              "Unique Asset Type Code",
              "Asset Type",
              "Quantity",
              "Logged By",
              "Log Date",
              "Action",
            ].map((hdr) => (
              <HvTableHeader key={hdr} style={headerStyle}>
                {hdr}
              </HvTableHeader>
            ))}
          </HvTableRow>
        </HvTableHead>

        <HvTableBody>
          {parents.map((p) => {
            const isSel = selectedIds.includes(p.uniqueAssetTypeCode);
            const isExp = openRow === p.uniqueAssetTypeCode;
            const children = p.filteredChildren || [];

            return (
              <React.Fragment key={p.uniqueAssetTypeCode}>
                <HvTableRow onClick={() => onExpand(p.uniqueAssetTypeCode)}>
                  <HvTableCell onClick={(e) => e.stopPropagation()}>
                    <HvCheckBox
                      checked={isSel}
                      onChange={() => onSelectRow(p.uniqueAssetTypeCode)}
                    />
                  </HvTableCell>
                  <HvTableCell>{p.uniqueAssetTypeCode}</HvTableCell>
                  <HvTableCell>{p.assetType}</HvTableCell>
                  <HvTableCell>{p.quantity}</HvTableCell>
                  <HvTableCell>{p.loggedBy}</HvTableCell>
                  <HvTableCell>{p.logDate}</HvTableCell>
                  <HvTableCell>
                    <IconButton onClick={() => onDialogOpen("add", p)}>
                      <Add color="success" />
                    </IconButton>
                    <IconButton onClick={() => onDialogOpen("remove", p)}>
                      <Remove color="error" />
                    </IconButton>
                    <IconButton onClick={() => onDialogOpen("edit", p)}>
                      <Edit />
                    </IconButton>
                  </HvTableCell>
                </HvTableRow>

                {isExp && (
                  <HvTableRow>
                    <HvTableCell colSpan={7}>
                      <HvTable>
                        <HvTableHead>
                          <HvTableRow>
                            {[
                              "Unique Asset ID",
                              "Asset Type",
                              "Asset Manufacturer",
                              "Asset Serial Number",
                              "Asset Name",
                              "Logged By",
                              "Log Date",
                              "Location",
                              "Status",
                              "Comments",
                              "Attachments",
                              "Action",
                            ].map((h) => (
                              <HvTableHeader key={h} style={headerStyle}>
                                {h}
                              </HvTableHeader>
                            ))}
                          </HvTableRow>
                        </HvTableHead>
                        <HvTableBody>
                          {children.map((c) => (
                            <HvTableRow key={c.uniqueAssetID}>
                              <HvTableCell>{c.uniqueAssetID}</HvTableCell>
                              <HvTableCell>{c.assetType}</HvTableCell>
                              <HvTableCell>{c.assetManufacturer || "N/A"}</HvTableCell>
                              <HvTableCell>{c.assetSerialNumber || "N/A"}</HvTableCell>
                              <HvTableCell>{c.asset_name || "N/A"}</HvTableCell> 
                              <HvTableCell>{c.loggedBy}</HvTableCell>
                              <HvTableCell>{c.logDate}</HvTableCell>
                              <HvTableCell>{c.location}</HvTableCell>      
                              <HvTableCell>{c.status}</HvTableCell>        
                              <HvTableCell>{c.comments || "N/A"}</HvTableCell>
                              <HvTableCell>{c.attachments || "None"}</HvTableCell>
                              <HvTableCell>
                                <IconButton onClick={() => onDialogOpen("remove", c)}>
                                  <Remove color="error" />
                                </IconButton>
                                <IconButton onClick={() => onDialogOpen("edit", c)}>
                                  <Edit />
                                </IconButton>
                              </HvTableCell>
                            </HvTableRow>
                          ))}
                        </HvTableBody>
                      </HvTable>
                    </HvTableCell>
                  </HvTableRow>
                )}
              </React.Fragment>
            );
          })}
        </HvTableBody>
      </HvTable>
    </HvTableContainer>
  );
};

export default InventoryTable;