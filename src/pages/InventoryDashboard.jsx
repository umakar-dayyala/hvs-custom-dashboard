import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Remove, Upload, Download } from "@mui/icons-material";
import { saveAs } from "file-saver";
import InventoryTable from "../components/InventoryTable";
import AssetDialog from "../components/AssetDialog";
import { getInventoryData, addAsset, editAsset, removeAsset } from "../service/InventoryService";

const InventoryDashboard = () => {
  const [allRows, setAllRows] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [dialog, setDialog] = useState({ type: "", open: false });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState({
    asset_type_unique_id: "",
    asset_unique_id: "",
    Asset_Type: "",
    Asset_Name: "",
    Asset_Manufacturer: "",
    Asset_Serial_Number: "",
    Asset_Location: "",
    Asset_Status: "",
    installation_date: "",
    camc_period: "",
    warranty_start_date: "",
    warranty_end_date: "",
    Comments: "",
    Attachments: null,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  const assetTypes = [
    "VRM", "WRM", "PRM", "AGM", "AP4CF", "IBAC", "MAB", "WM", "FCAD", "AAM",
    "FTIR", "APC", "DO", "PCAD", "GCMS", "RCM", "LRGS", "LDGS", "OM", "ASU",
    "BAT", "FIS", "ANCM", "ATR", "OTH"
  ];

  const assetLocations = [
    "Storeroom",
    "Upper Ground",
    "Lower Ground",
    "Terrace",
    "Iron Gate",
    "Other",
  ];
  const assetStatuses = ["Active", "Inactive", "Removed"];

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    status: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getInventoryData();
        console.log('Initial inventory data:', data);
        setAllRows(data);
      } catch (error) {
        setNotification({
          open: true,
          message: "Failed to fetch inventory data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleExpand = (id) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  const handleSelectRow = (idsOrId, isHeader = false) => {
    if (isHeader) {
      const allIds = allRows.map((p) => p.uniqueAssetTypeCode);
      const newSelectedIds = selectedIds.length === allIds.length ? [] : allIds;
      setSelectedIds(newSelectedIds);
      if (newSelectedIds.length > 0) {
        handleDialogOpen("remove_types", { type: "all", assetTypes: newSelectedIds });
      }
    } else {
      setSelectedIds((prev) =>
        prev.includes(idsOrId)
          ? prev.filter((x) => x !== idsOrId)
          : [...prev, idsOrId]
      );
      if (!selectedIds.includes(idsOrId)) {
        const asset = allRows.find((p) => p.uniqueAssetTypeCode === idsOrId);
        handleDialogOpen("remove_types", { type: "single", assetType: asset });
      }
    }
  };

  const getAllChildAssets = () =>
    allRows.flatMap((p) => (Array.isArray(p.children) ? p.children : []));

  const handleDialogOpen = (type, asset = null) => {
    setDialog({ type, open: true });
    setSelectedAsset(asset);
    if (type === 'add') {
      setFormData({
        asset_type_unique_id: '',
        asset_unique_id: '',
        Asset_Type: '',
        Asset_Name: '',
        Asset_Manufacturer: '',
        Asset_Serial_Number: '',
        Asset_Location: '',
        Asset_Status: '',
        installation_date: '',
        camc_period: '',
        warranty_start_date: '',
        warranty_end_date: '',
        Comments: '',
        Attachments: null,
      });
    } else if (type === "edit") {
      if (asset?.uniqueAssetID) {
        setFormData({
          asset_type_unique_id: asset.asset_type_unique_id || "",
          asset_unique_id: asset.uniqueAssetID || "",
          Asset_Type: asset.assetType || "",
          Asset_Name: asset.asset_name || "",
          Asset_Manufacturer: asset.assetManufacturer || "",
          Asset_Serial_Number: asset.assetSerialNumber || "",
          Asset_Location: asset.location || "",
          Asset_Status: asset.status || "",
          installation_date: asset.installation_date || "",
          camc_period: asset.camc_period || "",
          warranty_start_date: asset.warranty_start_date || "",
          warranty_end_date: asset.warranty_end_date || "",
          Comments: asset.comments || "",
          Attachments: null,
        });
      } else {
        setFormData({
          asset_type_unique_id: asset?.uniqueAssetTypeCode || "",
          asset_unique_id: "",
          Asset_Type: asset?.assetType || "",
          Asset_Name: asset?.uniqueAssetTypeCode || "",
          Asset_Manufacturer: "",
          Asset_Serial_Number: "",
          Asset_Location: "",
          Asset_Status: "",
          installation_date: "",
          camc_period: "",
          warranty_start_date: "",
          warranty_end_date: "",
          Comments: "",
          Attachments: null,
        });
      }
    } else if (type === "remove" && asset && asset.type === "all") {
      setSelectedAsset({ type: "all", children: getAllChildAssets() });
    }
  };

  const handleDialogClose = () => {
    setDialog({ type: "", open: false });
    setSelectedAsset(null);
    setFormData({
      asset_type_unique_id: "",
      asset_unique_id: "",
      Asset_Type: "",
      Asset_Name: "",
      Asset_Manufacturer: "",
      Asset_Serial_Number: "",
      Asset_Location: "",
      Asset_Status: "",
      installation_date: "",
      camc_period: "",
      warranty_start_date: "",
      warranty_end_date: "",
      Comments: "",
      Attachments: null,
    });
    setSelectedIds([]);
  };

  const handleShowNotification = (msg, sev = "success") =>
    setNotification({ open: true, message: msg, severity: sev });
  const handleCloseNotification = () =>
    setNotification((n) => ({ ...n, open: false }));

  const handleDialogSubmit = async (data) => {
    setLoading(true);
    try {
      if (dialog.type === 'add') {
        // Validate required fields
        const requiredFields = {
          'Asset Type': formData.Asset_Type,
          'Asset Name': formData.Asset_Name,
          'Asset Location': formData.Asset_Location,
          'Asset Status': formData.Asset_Status,
        };
        for (const [fieldName, value] of Object.entries(requiredFields)) {
          if (!value) {
            throw new Error(`${fieldName} is required`);
          }
        }

        // Validate warranty dates
        if (formData.warranty_start_date && formData.warranty_end_date) {
          const startDate = new Date(formData.warranty_start_date);
          const endDate = new Date(formData.warranty_end_date);
          if (endDate < startDate) {
            throw new Error('Warranty End Date must be after Warranty Start Date');
          }
        }

        const payload = {
          asset_type_unique_id: "TYPE-001", // Use known valid ID
          asset_unique_id: `ASSET-${Date.now()}`,
          asset_type: formData.Asset_Type,
          asset_quantity: 1,
          asset_name: formData.Asset_Name,
          asset_manufacterer: formData.Asset_Manufacturer || '', // Match working example
          asset_serial_number: formData.Asset_Serial_Number || '',
          asset_location: formData.Asset_Location,
          asset_status: formData.Asset_Status,
          installation_date: formData.installation_date || '2024-01-01',
          camc_period: formData.camc_period || '',
          warranty_start_date: formData.warranty_start_date || '2024-01-01',
          warranty_end_date: formData.warranty_end_date || '2026-01-01',
          comments: formData.Comments || '',
          asset_log_date: new Date().toISOString(),
        };
        console.log('Submitting add payload:', JSON.stringify(payload, null, 2));
        await addAsset(payload);
        handleShowNotification('Asset added successfully');
      } else if (dialog.type === 'remove') {
        const toRemove = Array.isArray(data) ? data : [data];
        for (const asset of toRemove) {
          const payload = {
            asset_type_unique_id: asset.asset_type_unique_id || '',
            asset_unique_id: asset.uniqueAssetID || '',
          };
          console.log('Submitting remove payload:', JSON.stringify(payload, null, 2));
          await removeAsset(payload);
        }
        handleShowNotification('Asset(s) removed successfully');
      } else if (dialog.type === 'remove_types') {
        for (const typeId of data) {
          const asset = allRows.find((p) => p.uniqueAssetTypeCode === typeId);
          if (asset) {
            const payload = {
              asset_type_unique_id: asset.uniqueAssetTypeCode,
              asset_unique_id: '',
            };
            console.log('Submitting remove_types payload:', JSON.stringify(payload, null, 2));
            await removeAsset(payload);
          }
        }
        handleShowNotification('Asset type(s) removed successfully');
      } else if (dialog.type === 'edit') {
        // Validate required fields
        const requiredFields = {
          'Asset Type': formData.Asset_Type,
          'Asset Name': formData.Asset_Name,
          'Asset Location': formData.Asset_Location,
          'Asset Status': formData.Asset_Status,
        };
        for (const [fieldName, value] of Object.entries(requiredFields)) {
          if (!value) {
            throw new Error(`${fieldName} is required`);
          }
        }

        // Validate warranty dates
        if (formData.warranty_start_date && formData.warranty_end_date) {
          const startDate = new Date(formData.warranty_start_date);
          const endDate = new Date(formData.warranty_end_date);
          if (endDate < startDate) {
            throw new Error('Warranty End Date must be after Warranty Start Date');
          }
        }

        const payload = {
          asset_type_unique_id: formData.asset_type_unique_id || '',
          asset_unique_id: formData.asset_unique_id || '',
          asset_type: formData.Asset_Type,
          asset_quantity: 1,
          asset_name: formData.Asset_Name,
          asset_manufacterer: formData.Asset_Manufacturer || '',
          asset_serial_number: formData.Asset_Serial_Number || '',
          asset_location: formData.Asset_Location,
          asset_status: formData.Asset_Status,
          installation_date: formData.installation_date || '2024-01-01',
          camc_period: formData.camc_period || '',
          warranty_start_date: formData.warranty_start_date || '2024-01-01',
          warranty_end_date: formData.warranty_end_date || '2026-01-01',
          comments: formData.Comments || '',
          asset_log_date: new Date().toISOString(),
        };
        console.log('Submitting edit payload:', JSON.stringify(payload, null, 2));
        await editAsset(payload);
        handleShowNotification('Asset updated successfully');
      }

      // Refetch inventory data
      const updatedData = await getInventoryData();
      console.log('Refetched inventory data:', updatedData);
      setAllRows(updatedData);
    } catch (error) {
      console.error('Operation failed:', error);
      handleShowNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
      handleDialogClose();
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleShowNotification(`Uploading file: ${file.name}`);
    }
  };

  const handleDownload = () => {
    saveAs(
      process.env.PUBLIC_URL + "/templates/Inventory-Template.xlsx",
      "Inventory-Template.xlsx"
    );
  };

  const handleSelectChildForEdit = (child) => {
    setSelectedAsset(child);
    setFormData({
      asset_type_unique_id: child.asset_type_unique_id || "",
      asset_unique_id: child.uniqueAssetID || "",
      Asset_Type: child.assetType || "",
      Asset_Name: child.asset_name || "",
      Asset_Manufacturer: child.assetManufacturer || "",
      Asset_Serial_Number: child.assetSerialNumber || "",
      Asset_Location: child.location || "",
      Asset_Status: child.status || "",
      installation_date: child.installation_date || "",
      camc_period: child.camc_period || "",
      warranty_start_date: child.warranty_start_date || "",
      warranty_end_date: child.warranty_end_date || "",
      Comments: child.comments || "",
      Attachments: null,
    });
  };

  return (
    <Box p={2} mt={5}>
      {loading && <div>Loading...</div>}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={() => handleDialogOpen("add")} disabled={loading}>
            <Add color="success" />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen("remove", { type: "all" })} disabled={loading}>
            <Remove color="error" />
          </IconButton>
          <IconButton onClick={handleDownload} disabled={loading}>
            <Download />
          </IconButton>
          <Button component="label" variant="outlined" startIcon={<Upload />} disabled={loading}>
            Upload
            <input hidden type="file" onChange={handleUpload} />
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Filter Type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
            disabled={loading}
          >
            <MenuItem value="">All</MenuItem>
            {assetTypes.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Filter Location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            sx={{ minWidth: 180 }}
            disabled={loading}
          >
            <MenuItem value="">All</MenuItem>
            {assetLocations.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Filter Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
            disabled={loading}
          >
            <MenuItem value="">All</MenuItem>
            {assetStatuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>

      <InventoryTable
        data={allRows}
        filters={filters}
        openRow={openRow}
        onExpand={handleExpand}
        onDialogOpen={handleDialogOpen}
        selectedIds={selectedIds}
        onSelectRow={handleSelectRow}
      />

      <AssetDialog
        open={dialog.open}
        type={dialog.type}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        formData={formData}
        onChange={handleChange}
        selectedAsset={selectedAsset}
        assetTypes={assetTypes}
        assetLocations={assetLocations}
        assetStatuses={assetStatuses}
        onSelectChildForEdit={handleSelectChildForEdit}
        allRows={allRows}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryDashboard;
