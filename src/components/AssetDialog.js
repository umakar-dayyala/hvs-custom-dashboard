import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem
  } from "@mui/material";
  
  const AssetDialog = ({
    open,
    type,
    onClose,
    onSubmit,
    formData,
    onChange,
    selectedAsset,
    assetTypes,
    assetLocations,
    assetStatuses
  }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {type === "add" ? "Add Asset" : type === "edit" ? "Edit Asset" : "Remove Asset"}
        </DialogTitle>
        <DialogContent dividers>
          {type === "remove" ? (
            <>
              <p>Are you sure you want to remove the following asset?</p>
              {selectedAsset && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: '#f9f9f9', borderRadius: 6 }}>
                  <strong>Asset Code:</strong> {selectedAsset.title}<br />
                  <strong>Type:</strong> {selectedAsset.type}<br />
                  <strong>Status:</strong> {selectedAsset.status}<br />
                  <strong>Location:</strong> {selectedAsset.priority}<br />
                  <strong>Logged By:</strong> {selectedAsset.probability}<br />
                  <strong>Log Date:</strong> {selectedAsset.severity}
                </div>
              )}
            </>
          ) : (
            <>
              <TextField
                select fullWidth margin="normal" label="Asset Type" name="Asset_Type"
                value={formData.Asset_Type} onChange={onChange}
              >
                {assetTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </TextField>
  
              <TextField fullWidth margin="normal" label="Asset Name" name="Asset_Name"
                value={formData.Asset_Name} onChange={onChange} />
  
              <TextField fullWidth margin="normal" label="Asset Manufacturer" name="Asset_Manufacturer"
                value={formData.Asset_Manufacturer} onChange={onChange} />
  
              <TextField fullWidth margin="normal" label="Asset Serial Number" name="Asset_Serial_Number"
                value={formData.Asset_Serial_Number} onChange={onChange} />
  
              <TextField select fullWidth margin="normal" label="Asset Location" name="Asset_Location"
                value={formData.Asset_Location} onChange={onChange}
              >
                {assetLocations.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
              </TextField>
  
              <TextField select fullWidth margin="normal" label="Asset Status" name="Asset_Status"
                value={formData.Asset_Status} onChange={onChange}
              >
                {assetStatuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </TextField>
  
              <TextField fullWidth multiline rows={3} margin="normal" label="Comments" name="Comments"
                value={formData.Comments} onChange={onChange} />
  
              <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                Upload Attachment
                <input hidden type="file" name="Attachments" onChange={onChange} />
              </Button>
              {formData.Attachments && (
                <p style={{ marginTop: 8 }}>{formData.Attachments.name}</p>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            color={type === "remove" ? "error" : "primary"}
            onClick={onSubmit}
          >
            {type === "remove" ? "Confirm Remove" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default AssetDialog;
  