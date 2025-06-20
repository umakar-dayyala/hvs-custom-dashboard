import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
} from "@mui/material";

// Utility function to format date to ISO (YYYY-MM-DDTHH:mm:ss.sss)
const formatToISO = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, -1); // Returns YYYY-MM-DDTHH:mm:ss.sss
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Utility function to format ISO to datetime-local input format (YYYY-MM-DDTHH:mm)
const formatForDateTimeLocal = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting for datetime-local:", error);
    return "";
  }
};

const AssetDialog = ({
  open,
  type,
  onClose,
  onSubmit,
  formData = {},
  onChange,
  selectedAsset,
  assetTypes,
  assetLocations,
  assetStatuses,
  onSelectChildForEdit,
  allRows,
}) => {
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editStep, setEditStep] = useState("edit");

  useEffect(() => {
    if (open) {
      setSelectedChildren([]);
      setShowConfirm(false);
      setEditStep(
        type === "edit" && Array.isArray(selectedAsset?.children)
          ? "select"
          : "edit"
      );
    }
  }, [open, type, selectedAsset]);

  const validateForm = () => {
    if (!formData.Asset_Type) return "Asset Type is required";
    // if (!formData.asset_unique_id) return "Asset Unique ID is required";
    return null;
  };

  const handleConfirmRemove = () => {
    const toRemove = (selectedAsset.children || []).filter((c) =>
      selectedChildren.includes(c.uniqueAssetID)
    );
    console.log("Removing assets:", toRemove);
    onSubmit(toRemove);
    onClose();
  };

  // const handleConfirmRemoveTypes = () => {
  //   if (selectedAsset.type === "all") {
  //     console.log("Removing asset types:", selectedAsset.assetTypes);
  //     onSubmit(selectedAsset.assetTypes);
  //   } else {
  //     const typeId = selectedAsset.assetType?.uniqueAssetTypeCode;
  //     console.log("Removing asset type:", typeId);
  //     onSubmit([typeId].filter(Boolean));
  //   }
  //   onClose();
  // };

  // Modified onChange handler to format date-time fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let formattedValue = value;

    // Format date-time fields to ISO
    if (
      ["installation_date", "warranty_start_date", "warranty_end_date"].includes(
        name
      )
    ) {
      formattedValue = formatToISO(value);
      console.log(`Formatted ${name}:`, formattedValue); // Debug log
    } else if (name === "Attachments" && files?.length) {
      formattedValue = files[0];
    }

    onChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  const renderContent = () => {
    if (
      type === "remove" &&
      Array.isArray(selectedAsset?.children) &&
      !showConfirm
    ) {
      const children = selectedAsset.children.filter((c) => c && c.uniqueAssetID) || [];
      const availableAssets = children.filter(
        (asset) => asset.status?.toLowerCase() !== "removed"
      );
      return (
        <>
          <p>Select assets to remove:</p>
          {availableAssets.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Asset ID</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableAssets.map((c) => (
                  <TableRow key={c.uniqueAssetID}>
                    <TableCell>
                      <Checkbox
                        checked={selectedChildren.includes(c.uniqueAssetID)}
                        onChange={() =>
                          setSelectedChildren((prev) =>
                            prev.includes(c.uniqueAssetID)
                              ? prev.filter((x) => x !== c.uniqueAssetID)
                              : [...prev, c.uniqueAssetID]
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{c.uniqueAssetID}</TableCell>
                    <TableCell>{c.assetType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No assets available for selection.</p>
          )}
        </>
      );
    }

    if (type === "remove" && showConfirm) {
      const children = (selectedAsset.children || [])
        .filter(
          (c) =>
            c &&
            c.uniqueAssetID &&
            selectedChildren.includes(c.uniqueAssetID) &&
            c.status?.toLowerCase() !== "removed"
        );
      return (
        <>
          <Typography variant="subtitle1" color="error.main">
            Confirm remove these assets?
          </Typography>
          {children.length > 0 ? (
            children.map((c) => (
              <div
                key={c.uniqueAssetID}
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#f9f9f9",
                  borderRadius: 6,
                }}
              >
                <strong>Asset Code:</strong>{" "}
                {c.uniqueAssetTypeCode || c.uniqueAssetID || "N/A"}
                <br />
                <strong>Type:</strong> {c.assetType || "N/A"}
                <br />
                <strong>Status:</strong> {c.status || "N/A"}
                <br />
                <strong>Location:</strong> {c.location || "N/A"}
                <br />
                <strong>Logged By:</strong> {c.loggedBy || "N/A"}
                <br />
                <strong>Log Date:</strong> {c.logDate || "N/A"}
              </div>
            ))
          ) : (
            <p>No assets to display.</p>
          )}
        </>
      );
    }

    // if (type === "remove_types" && !showConfirm) {
    //   return (
    //     <>
    //       <Typography variant="subtitle1" color="error.main">
    //         Confirm remove the following asset types?
    //       </Typography>
    //       {selectedAsset.type === "all" ? (
    //         selectedAsset.assetTypes.map((typeId) => {
    //           const row = (allRows || []).find((r) => r.uniqueAssetTypeCode === typeId);
    //           return (
    //             <div
    //               key={typeId}
    //               style={{
    //                 marginTop: 12,
    //                 padding: "8px 12px",
    //                 background: "#f9f9f9",
    //                 borderRadius: 6,
    //               }}
    //             >
    //               <strong>Asset Type:</strong> {row?.assetType || typeId}
    //               <br />
    //               <strong>Quantity:</strong> {row?.quantity || "N/A"}
    //             </div>
    //           );
    //         })
    //       ) : (
    //         <div
    //           style={{
    //             marginTop: 12,
    //             padding: "8px 12px",
    //             background: "#f9f9f9",
    //             borderRadius: 6,
    //           }}
    //         >
    //           <strong>Asset Type:</strong>{" "}
    //           {selectedAsset.assetType?.assetType ||
    //             selectedAsset.assetType?.uniqueAssetTypeCode ||
    //             "N/A"}
    //           <br />
    //           <strong>Quantity:</strong>{" "}
    //           {selectedAsset.assetType?.quantity || "N/A"}
    //         </div>
    //       )}
    //     </>
    //   );
    // }

    if (type === "edit" && editStep === "select") {
      const children = selectedAsset?.children?.filter((c) => c && c.uniqueAssetID) || [];
      return (
        <>
          <p>Select one asset to edit:</p>
          {children.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Asset ID</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {children.map((c) => (
                  <TableRow key={c.uniqueAssetID}>
                    <TableCell>
                      <Checkbox
                        checked={selectedChildren.includes(c.uniqueAssetID)}
                        onChange={() => setSelectedChildren([c.uniqueAssetID])}
                      />
                    </TableCell>
                    <TableCell>{c.uniqueAssetID}</TableCell>
                    <TableCell>{c.assetType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No child assets available.</p>
          )}
        </>
      );
    }

    if (type === "add" || (type === "edit" && editStep === "edit")) {
      return (
        <>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Asset Type"
            name="Asset_Type"
            value={formData.Asset_Type || ""}
            onChange={onChange}
            disabled={type === "edit"}
            required
          >
            {assetTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Asset Name"
            name="Asset_Name"
            value={formData.Asset_Name || ""}
            onChange={onChange}
          // required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Asset Type Unique ID"
            name="asset_type_unique_id"
            value={formData.asset_type_unique_id || ""}
            onChange={onChange}
            disabled={type === "edit"}
            required
          />
          {type === "edit" && editStep === "edit" && (
            <TextField
              fullWidth
              margin="normal"
              label="Asset Unique ID"
              name="asset_unique_id"
              value={formData.asset_unique_id || ""}
              onChange={onChange}
              disabled={type === "edit"}
              required
            />
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Asset Manufacturer"
            name="Asset_Manufacturer"
            value={formData.Asset_Manufacturer || ""}
            onChange={onChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Asset Serial Number"
            name="Asset_Serial_Number"
            value={formData.Asset_Serial_Number || ""}
            onChange={onChange}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Asset Location"
            name="Asset_Location"
            value={formData.Asset_Location || ""}
            onChange={onChange}
            // required
          >
            {assetLocations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Asset Status"
            name="Asset_Status"
            value={formData.Asset_Status || ""}
            onChange={onChange}
            required
          >
            {assetStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Installation Date"
            name="installation_date"
            type="datetime-local"
            value={formatForDateTimeLocal(formData.installation_date)}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="CAMC Period"
            name="camc_period"
            value={formData.camc_period || ""}
            onChange={onChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Warranty Start Date"
            name="warranty_start_date"
            type="datetime-local"
            value={formatForDateTimeLocal(formData.warranty_start_date)}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Warranty End Date"
            name="warranty_end_date"
            type="datetime-local"
            value={formatForDateTimeLocal(formData.warranty_end_date)}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            margin="normal"
            label="Comments"
            name="Comments"
            value={formData.Comments || ""}
            onChange={onChange}
          />
          {/* <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Attachment
            <input
              hidden
              type="file"
              name="Attachments"
              onChange={onChange}
            />
          </Button>
          {formData.Attachments ? (
            <p style={{ marginTop: 8 }}>Uploaded: {formData.Attachments.name}</p>
          ) : selectedAsset?.attachments ? (
            <p style={{ marginTop: 8 }}>Existing: {selectedAsset.attachments}</p>
          ) : null} */}
        </>
      );
    }

    if (type === "remove") {
      if (selectedAsset?.status?.toLowerCase() === "removed") {
        return (
          <>
            <p>This asset is already removed and cannot be removed again.</p>
          </>
        );
      } else {
        return (
          <>
            <Typography variant="subtitle1" color="error.main">
              Confirm remove this asset?
            </Typography>
            <div>
              <strong>{selectedAsset?.uniqueAssetID || "Unknown"}</strong> —{" "}
              {selectedAsset?.assetType || "Unknown"}
            </div>
          </>
        );
      }
    }

    return null;
  };

  const renderActions = () => {
    if (
      type === "remove" &&
      Array.isArray(selectedAsset?.children) &&
      !showConfirm
    ) {
      return (
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color="error"
            onClick={() => setShowConfirm(true)}
            disabled={!selectedChildren.length}
          >
            Delete
          </Button>
        </>
      );
    }
    if (type === "remove" && showConfirm) {
      return (
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="error" onClick={handleConfirmRemove}>
            Confirm
          </Button>
        </>
      );
    }
    // if (type === "remove_types") {
    //   return (
    //     <>
    //       <Button onClick={onClose}>Cancel</Button>
    //       <Button color="error" onClick={handleConfirmRemoveTypes}>
    //         Confirm
    //       </Button>
    //     </>
    //   );
    // }
    if (type === "edit" && editStep === "select") {
      return (
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              const selectedChild = (selectedAsset.children || []).find(
                (c) => c.uniqueAssetID === selectedChildren[0]
              );
              if (selectedChild) {
                onSelectChildForEdit(selectedChild);
                setEditStep("edit");
              }
            }}
            disabled={selectedChildren.length !== 1}
          >
            Next
          </Button>
        </>
      );
    }
    if (type === "add" || (type === "edit" && editStep === "edit")) {
      return (
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color="primary"
            onClick={() => {
              const error = validateForm();
              if (error) {
                alert(error);
                return;
              }
              console.log("Submitting form data:", formData);
              onSubmit(formData);
            }}
          >
            Submit
          </Button>
        </>
      );
    }
    if (type === "remove") {
      if (selectedAsset?.status?.toLowerCase() === "removed") {
        return (
          <>
            <Button onClick={onClose}>Close</Button>
          </>
        );
      } else {
        return (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button color="error" onClick={() => onSubmit([selectedAsset])}>
              Confirm
            </Button>
          </>
        );
      }
    }
    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {type === "add"
          ? "Add Asset"
          : type === "edit"
            ? "Edit Asset"
            : type === "remove_types"
              ? "Remove Asset Types"
              : "Remove Asset"}
      </DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
      <DialogActions>{renderActions()}</DialogActions>
    </Dialog>
  );
};

export default AssetDialog;