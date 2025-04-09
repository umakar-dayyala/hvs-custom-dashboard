import { useState } from "react";
import {
  Box, Button, MenuItem, TextField, Stack, IconButton
} from "@mui/material";
import { Add, Remove, Upload, Download } from "@mui/icons-material";
import InventoryTable from "../components/InventoryTable";
import AssetDialog from "../components/AssetDialog";

const InventoryDashboard = () => {
  const [openRow, setOpenRow] = useState(null);
  const [dialog, setDialog] = useState({ type: '', open: false });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [formData, setFormData] = useState({
    Asset_Type: '',
    Asset_Name: '',
    Asset_Manufacturer: '',
    Asset_Serial_Number: '',
    Asset_Location: '',
    Asset_Status: '',
    Comments: '',
    Attachments: null,
  });

  const assetTypes = ["Sensor", "PPE", "System", "Other"];
  const assetLocations = ["Storeroom", "Upper Ground", "Lower Ground", "Other"];
  const assetStatuses = ["Active", "In-active", "Removed"];

  const [filters, setFilters] = useState({
    type: '',
    location: '',
    status: ''
  });

  const [allRows, setAllRows] = useState([
    {
      id: '1', title: 'Asset-001', type: 'Sensor', status: 'Active',
      probability: 'John Doe', severity: '2024-12-20', priority: 'Storeroom',
    },
    {
      id: '2', title: 'Asset-002', type: 'System', status: 'Removed',
      probability: 'Alice', severity: '2025-01-10', priority: 'Upper Ground',
    },
  ]);

  const filteredRows = allRows.filter(row =>
    (!filters.type || row.type === filters.type) &&
    (!filters.location || row.priority === filters.location) &&
    (!filters.status || row.status === filters.status)
  );

  const handleExpand = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkRemove = () => {
    const updated = allRows.filter(row => !selectedIds.includes(row.id));
    setAllRows(updated);
    setSelectedIds([]);
  };

  const handleDialogOpen = (type, asset = null) => {
    setDialog({ type, open: true });
    setSelectedAsset(asset);

    if (type === 'edit' && asset) {
      setFormData({
        Asset_Type: asset.type || '',
        Asset_Name: asset.title || '',
        Asset_Manufacturer: '',
        Asset_Serial_Number: '',
        Asset_Location: asset.priority || '',
        Asset_Status: asset.status || '',
        Comments: '',
        Attachments: null,
      });
    }
  };

  const handleDialogClose = () => {
    setDialog({ type: '', open: false });
    setFormData({
      Asset_Type: '',
      Asset_Name: '',
      Asset_Manufacturer: '',
      Asset_Serial_Number: '',
      Asset_Location: '',
      Asset_Status: '',
      Comments: '',
      Attachments: null,
    });
    setSelectedAsset(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDialogSubmit = () => {
    console.log(dialog.type === 'remove' ? 'Removing:' : 'Submitting:', dialog.type === 'remove' ? selectedAsset : formData);
    handleDialogClose();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploading file:", file.name);
    }
  };

  const handleDownload = () => {
    console.log("Downloading data...");
  };

  return (
    <Box p={2} mt={5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={() => handleDialogOpen("add")}>
            <Add color="success" />
          </IconButton>
          <IconButton onClick={handleBulkRemove} disabled={selectedIds.length === 0}>
            <Remove color="error" />
          </IconButton>
          <IconButton onClick={handleDownload}>
            <Download />
          </IconButton>
          <Button component="label" variant="outlined" startIcon={<Upload />}>
            Upload
            <input type="file" hidden onChange={handleUpload} />
          </Button>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            select label="Filter Type" name="type" value={filters.type} onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {assetTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
          </TextField>

          <TextField
            select label="Filter Location" name="location" value={filters.location} onChange={handleFilterChange}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All</MenuItem>
            {assetLocations.map((loc) => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
          </TextField>

          <TextField
            select label="Filter Status" name="status" value={filters.status} onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {assetStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </TextField>
        </Stack>
      </Stack>

      <InventoryTable
        rows={filteredRows}
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
      />
    </Box>
  );
};

export default InventoryDashboard;
