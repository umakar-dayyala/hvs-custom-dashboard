import React, { useState } from "react";
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
  selectedIds = [],
  onSelectRow = () => {},
  onDialogOpen,
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const handleRowClick = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelect = (id) => {
    alert(`Selected ID: `);
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    onSelectRow(newSelected);
  };

  const handleSelectAll = () => {
    alert(`Selected All IDs: `);
    const allIds = data.map((item) => item.uniqueAssetTypeCode);
    const isAllSelected = allIds.every((id) => selectedIds.includes(id));
    onSelectRow(isAllSelected ? [] : allIds);
  };

  return (
    <HvTableContainer>
      <HvTable>
        <HvTableHead>
          <HvTableRow>
            <HvTableHeader style={headerStyle}>
              <HvCheckBox
                checked={
                  data.length > 0 &&
                  data.every((item) => selectedIds.includes(item.uniqueAssetTypeCode))
                }
                indeterminate={
                  selectedIds.length > 0 &&
                  selectedIds.length < data.length
                }
                onChange={handleSelectAll}
              />
            </HvTableHeader>
            <HvTableHeader style={headerStyle}>Unique Asset Type Code</HvTableHeader>
            <HvTableHeader style={headerStyle}>Asset Type</HvTableHeader>
            <HvTableHeader style={headerStyle}>Quantity</HvTableHeader>
            <HvTableHeader style={headerStyle}>Logged By</HvTableHeader>
            <HvTableHeader style={headerStyle}>Log Date</HvTableHeader>
            <HvTableHeader style={headerStyle}>Action</HvTableHeader>
          </HvTableRow>
        </HvTableHead>

        <HvTableBody>
          {data.map((parent, index) => {
            const isSelected = selectedIds.includes(parent.uniqueAssetTypeCode);
            return (
              <React.Fragment key={index}>
                <HvTableRow
                  onClick={() => handleRowClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  <HvTableCell onClick={(e) => e.stopPropagation()}>
                    <HvCheckBox
                      checked={isSelected}
                      onChange={() => handleSelect(parent.uniqueAssetTypeCode)}
                    />
                  </HvTableCell>
                  <HvTableCell>{parent.uniqueAssetTypeCode}</HvTableCell>
                  <HvTableCell>{parent.assetType}</HvTableCell>
                  <HvTableCell>{parent.quantity}</HvTableCell>
                  <HvTableCell>{parent.loggedBy}</HvTableCell>
                  <HvTableCell>{parent.logDate}</HvTableCell>
                  <HvTableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton onClick={() => onDialogOpen("add", parent)}>
                      <Add color="success" />
                    </IconButton>
                    <IconButton onClick={() => onDialogOpen("remove", parent)}>
                      <Remove color="error" />
                    </IconButton>
                    <IconButton onClick={() => onDialogOpen("edit", parent)}>
                      <Edit />
                    </IconButton>
                  </HvTableCell>
                </HvTableRow>

                {expandedRows[index] && (
                  <HvTableRow>
                    <HvTableCell colSpan={7}>
                      <HvTable>
                        <HvTableHead>
                          <HvTableRow>
                            <HvTableHeader style={headerStyle}>Unique Asset ID</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Asset Type</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Asset Manufacture</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Asset Serial Number</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Logged By</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Log Date</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Location</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Status</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Comments</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Attachments</HvTableHeader>
                            <HvTableHeader style={headerStyle}>Action</HvTableHeader>
                          </HvTableRow>
                        </HvTableHead>
                        <HvTableBody>
                          {parent.children.map((child, idx) => (
                            <HvTableRow key={idx}>
                              <HvTableCell>{child.uniqueAssetID}</HvTableCell>
                              <HvTableCell>{child.assetType}</HvTableCell>
                              <HvTableCell>{child.assetManufacturer}</HvTableCell>
                              <HvTableCell>{child.assetSerialNumber}</HvTableCell>
                              <HvTableCell>{child.loggedBy}</HvTableCell>
                              <HvTableCell>{child.logDate}</HvTableCell>
                              <HvTableCell>{child.location}</HvTableCell>
                              <HvTableCell>{child.status}</HvTableCell>
                              <HvTableCell>{child.comments}</HvTableCell>
                              <HvTableCell>{child.attachments}</HvTableCell>
                              <HvTableCell>
                                <IconButton onClick={() => onDialogOpen("add", child)}>
                                  <Add color="success" />
                                </IconButton>
                                <IconButton onClick={() => onDialogOpen("remove", child)}>
                                  <Remove color="error" />
                                </IconButton>
                                <IconButton onClick={() => onDialogOpen("edit", child)}>
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
