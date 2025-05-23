const API_BASE_URL = `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_IP}:${process.env.REACT_APP_API_PORT}/api/inventory`;

export const getInventoryData = async () => {
  try {
    const url = `${API_BASE_URL}/getCombinedInventory?param_asset_status=ALL&param_asset_type_unique_id=ALL&param_asset_location=ALL`;
    console.log('Fetching inventory from:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received inventory data:', data);

    // Map API response to the expected structure using correct field names
    return data.data.map(item => ({
      uniqueAssetTypeCode: item.uniqueAssetTypeCode,
      assetType: item.assetType,
      quantity: item.quantity,
      loggedBy: item.loggedBy,
      logDate: item.logDate, // Already a string, no need to convert
      children: item.children.map(child => ({
        uniqueAssetID: child.uniqueAssetID,
        asset_type_unique_id: item.uniqueAssetTypeCode, // If needed by the frontend
        assetType: child.assetType,
        assetManufacturer: child.assetManufacturer,
        assetSerialNumber: child.assetSerialNumber,
        loggedBy: child.loggedBy,
        logDate: child.logDate, // Already a string
        location: child.assetLocation,
        status: child.assetStatus,
        asset_name: child.assetName,
        installation_date: child.installationDate,
        camc_period: child.CamcPeriod,
        warranty_start_date: child.WarrantyStartDate,
        warranty_end_date: child.WarrantyEndDate,
        comments: child.comments,
        attachments: child.attachments, // Assuming this field exists
      })),
    }));
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};
// Add a new asset
export const addAsset = async (asset) => {
  try {
    // Log the payload being sent
    console.log('Sending payload to /insertInventoryRecords:', JSON.stringify(asset, null, 2));

    const response = await fetch(`${API_BASE_URL}/insertInventoryRecords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });

    // Log response details
    const responseBody = await response.text();
    console.log('Received response from /insertInventoryRecords:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody,
    });

    if (!response.ok) {
      console.error('Server error details:', {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
      });
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseBody}`);
    }

    const result = JSON.parse(responseBody);
    if (!result.success) {
      console.error('Server indicated failure:', result);
      throw new Error('Failed to add asset: ' + (result.error || 'Unknown error'));
    }

    console.log('Successfully added asset:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error adding asset:', error);
    throw error;
  }
};

// Update an existing asset
export const editAsset = async (asset) => {
  try {
    const response = await fetch(`${API_BASE_URL}/updateInventoryRecords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to update asset');
    }
    return result.message;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

// Remove an asset
export const removeAsset = async (asset) => {
  try {
    const response = await fetch(`${API_BASE_URL}/removeInventoryRecord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error('Failed to remove asset');
    }
    return result.message;
  } catch (error) {
    console.error('Error removing asset:', error);
    throw error;
  }
};

// Bulk upload assets
export const uploadAssetsBulk = async (payload) => {
  try {
    console.log('Sending bulk payload to /insertInventoryRecordsBulk:', JSON.stringify(payload, null, 2));
    const response = await fetch(`${API_BASE_URL}/insertInventoryRecordsBulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseBody = await response.text();
    console.log('Received response from /insertInventoryRecordsBulk:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody,
    });

    if (!response.ok) {
      console.error('Server error details:', {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
      });
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseBody}`);
    }

    const result = JSON.parse(responseBody);
    if (!result.success) {
      console.error('Server indicated failure:', result);
      throw new Error('Failed to upload assets: ' + (result.error || 'Unknown error'));
    }

    console.log('Successfully uploaded assets:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error uploading assets:', error);
    throw error;
  }
};


/*
// Retained but commented out unused functions for reference
let assets = [
  {
    id: "1",
    Asset_Name: "Asset-001",
    Asset_Type: "Sensor",
    Asset_Manufacturer: "Hitachi",
    Asset_Serial_Number: "SN12345",
    Asset_Location: "Storeroom",
    Asset_Status: "Active",
    Logged_By: "User1",
    Logged_Date: "2024-12-20",
    Comments: "All good",
    Attachments: null,
  },
  // ... other assets
];

export const getAssets = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          Asset_Code: "AST-001",
          Asset_Type: "PPE",
          Asset_Name: "Helmet",
          // ... other fields
        },
        // ... other assets
      ]);
    }, 500);
  });
};

export const uploadAssets = (file) => {
  console.log("Simulating upload for file:", file.name);
};

export const downloadAssets = () => {
  const csv = assets.map((a) => Object.values(a).join(",")).join("\n");
  console.log("Simulated CSV Download:\n", csv);
};
*/

