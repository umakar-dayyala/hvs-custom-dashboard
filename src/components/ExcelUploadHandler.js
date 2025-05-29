import { Button } from "@mui/material";
import { Upload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { uploadAssetsBulk } from "../service/InventoryService";

const ExcelUploadHandler = ({ setLoading, handleShowNotification, getInventoryData, setAllRows, disabled }) => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      handleShowNotification("No file selected", "error");
      // Reset input
      e.target.value = '';
      return;
    }

    // Check if the file is an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      handleShowNotification("Please upload an Excel file (.xlsx or .xls)", "error");
      // Reset input
      e.target.value = '';
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          console.log('Reading Excel file:', file.name);
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Check for required column headers
          const requiredColumns = [
            'Asset_Type',
            'Asset_type_unique_id',
            'Asset_Location',
            'Asset_Status'
          ];
          console.log('Excel headers:', jsonData[0]);
          const headers = jsonData[0] || [];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
          }

          // Convert to JSON with headers
          const records = XLSX.utils.sheet_to_json(worksheet);
          console.log('Parsed records:', records);

          // Validate and transform Excel data to the required payload format
          const payloadRecords = records.map((row, index) => {
            // Validate required fields
            const requiredFields = {
              'Asset Type': row['Asset_Type'],
              'Asset Type Unique ID': row['Asset_type_unique_id'],
              'Asset Location': row['Asset_Location'],
              'Asset Status': row['Asset_Status'],
            };
            for (const [fieldName, value] of Object.entries(requiredFields)) {
              if (value === undefined || value === null || value === '') {
                throw new Error(`${fieldName} is missing or empty in row ${index + 1}: ${JSON.stringify(row)}`);
              }
            }

            return {
              asset_type_unique_id: row['Asset_type_unique_id'] || '',
              // asset_unique_id: row['Asset_unique_id'] || '',
              asset_type: row['Asset_Type'] || '',
              asset_quantity: 1,
              asset_name: row['Asset_Name'] || '',
              asset_manufacterer: row['Asset_Manufacterer'] || '',
              asset_serial_number: row['Asset_Serial_Number'] || '',
              asset_location: row['Asset_Location'] || '',
              asset_status: row['Asset_Status'] || '',
              installation_date: row['installation_date'] || null,
              camc_period: row['camc_period'] || '',
              warranty_start_date: row['warranty_start_date'] || null,
              warranty_end_date: row['warranty_end_date'] || null,
              comments: row['Comments'] || '',
              asset_log_date: new Date().toISOString(),
            };
          });

          // Send the payload to the bulk insert API
          console.log('Uploading payload:', JSON.stringify({ records: payloadRecords }, null, 2));
          const response = await uploadAssetsBulk({ records: payloadRecords });
          console.log('API response:', response);
          // Extract number of records from response or fallback to payload length
          const numRecords = response.data && typeof response.data === 'string' 
            ? parseInt(response.data.match(/\d+/)?.[0]) || payloadRecords.length
            : payloadRecords.length;
          handleShowNotification(`${numRecords} record${numRecords === 1 ? '' : 's'} Assets added successfully`, 'success');

          // Refetch inventory data to update the table
          const updatedData = await getInventoryData();
          setAllRows(updatedData);
        } catch (error) {
          console.error('Error processing Excel file:', error);
          handleShowNotification(`Error: ${error.message}`, 'error');
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        handleShowNotification("Error reading the Excel file", "error");
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Upload error:', error);
      handleShowNotification(`Error: ${error.message}`, 'error');
      setLoading(false);
    } finally {
      // Reset input after every attempt
      e.target.value = '';
    }
  };

  return (
    <Button
      component="label"
      variant="outlined"
      startIcon={<Upload />}
      disabled={disabled}
    >
      Upload
      <input hidden type="file" accept=".xlsx,.xls" onChange={handleUpload} />
    </Button>
  );
};

export default ExcelUploadHandler;