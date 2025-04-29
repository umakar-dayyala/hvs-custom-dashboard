// InventoryService.js
export const getInventoryData = async () => {
  return [
    {
      uniqueAssetTypeCode: "PPE_234es1",
      assetType: "PPE",
      quantity: 2,
      loggedBy: "User1",
      logDate: "03/04/2025",
      children: [
        {
          uniqueAssetID: "PPE_234es1",
          assetType: "PPE",
          assetManufacturer: "ABC",
          assetSerialNumber: "ABC-291234",
          loggedBy: "User",
          logDate: "03/04/2025",
          location: "Storeroom",
          status: "Active",
          comments: "testing",
          attachments: "",
        },
        {
          uniqueAssetID: "PPE_234es2",
          assetType: "PPE",
          assetManufacturer: "XYZ",
          assetSerialNumber: "XYZ-123456",
          loggedBy: "User",
          logDate: "03/04/2025",
          location: "Warehouse 2",
          status: "Active",
          comments: "Needs maintenance",
          attachments: "",
        }
      ],
    },
  ];
};


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
  {
    id: "2",
    Asset_Name: "Asset-002",
    Asset_Type: "System",
    Asset_Manufacturer: "Panasonic",
    Asset_Serial_Number: "SN56789",
    Asset_Location: "Upper Ground",
    Asset_Status: "Removed",
    Logged_By: "User1",
    Logged_Date: "2025-01-10",
    Comments: "Replaced",
    Attachments: null,
  },
];

// export const getAssets = () => {
//   return [...assets];
// };

export const addAsset = (asset) => {
  const newAsset = { ...asset, id: Date.now().toString() };
  assets.push(newAsset);
  return newAsset;
};

export const removeAsset = (id) => {
  assets = assets.filter((a) => a.id !== id);
};

export const editAsset = (id, updatedData) => {
  assets = assets.map((a) => (a.id === id ? { ...a, ...updatedData } : a));
};

export const uploadAssets = (file) => {
  console.log("Simulating upload for file:", file.name);
};

export const downloadAssets = () => {
  const csv = assets.map((a) => Object.values(a).join(",")).join("\n");
  console.log("Simulated CSV Download:\n", csv);
};

// InventoryService.js

// InventoryService.js

export const getAssets = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          Asset_Code: "AST-001",
          Asset_Type: "PPE",
          Asset_Name: "Helmet",
          Asset_Manufacturer: "Hitachi",
          Asset_Serial_Number: "A12345",
          Quantity: 20,
          Asset_Status: "Active",
          Comments: "For upper site use",
          Attachments: {}, // Optional: include name or type if needed
          Logged_By: "Admin",
          Logged_Date: "2024-04-01",
          Asset_Location: "Storeroom"
        },
        {
          id: 2,
          Asset_Code: "AST-002",
          Asset_Type: "Sensor",
          Asset_Name: "Fire Sensor",
          Asset_Manufacturer: "Bosch",
          Asset_Serial_Number: "SN23455",
          Quantity: 10,
          Asset_Status: "In-active",
          Comments: "To be replaced",
          Attachments: {},
          Logged_By: "User1",
          Logged_Date: "2024-04-04",
          Asset_Location: "Upper Ground"
        },
        {
          id: 3,
          Asset_Code: "AST-003",
          Asset_Type: "System",
          Asset_Name: "Access Control",
          Asset_Manufacturer: "Siemens",
          Asset_Serial_Number: "SYS66789",
          Quantity: 5,
          Asset_Status: "Active",
          Comments: "Under warranty",
          Attachments: {},
          Logged_By: "User2",
          Logged_Date: "2024-04-06",
          Asset_Location: "Lower Ground"
        }
      ]);
    }, 500);
  });
};


