import React, { useEffect, useState } from "react";
import FilterComponent from "../components/HistoryFilter";
import DataTableComponent from "../components/HistoryDataTable";
import { getSensorEventHistory } from "../service/HistoryService";
import Breadcrumbs from "../components/Breadcrumbs";
import Loader from "../components/Loader";
import { Box, Typography } from "@mui/material";

const SensorEventHistory = () => {
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const areFiltersEqual = (a, b) => {
    if (a.deviceId !== b.deviceId || a.sensorType !== b.sensorType) {
      return false;
    }
    const aNames = a.sensorNames || [];
    const bNames = b.sensorNames || [];
    if (aNames.length !== bNames.length || !aNames.every((val, i) => val === bNames[i])) {
      return false;
    }
    const aLocations = a.sensorLocation || [];
    const bLocations = b.sensorLocation || [];
    if (aLocations.length !== bLocations.length || !aLocations.every((val, i) => val === bLocations[i])) {
      return false;
    }
    const aDateRange = a.dateRange || [null, null];
    const bDateRange = b.dateRange || [null, null];
    const isDateRangeEqual =
      ((aDateRange[0] === null && bDateRange[0] === null) ||
        (aDateRange[0] && bDateRange[0] && aDateRange[0].isSame(bDateRange[0]))) &&
      ((aDateRange[1] === null && bDateRange[1] === null) ||
        (aDateRange[1] && bDateRange[1] && aDateRange[1].isSame(bDateRange[1])));
    if (!isDateRangeEqual) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchData(filters);
    }
  }, [filters]);

  const fetchData = async (filters) => {
    setLoading(true);
    try {
      const data = await getSensorEventHistory(filters);
      console.log("Fetched table data:", data.map(item => ({
        device_id: item.device_id,
        sensor_status: item.sensor_status,
        sensor_type: item.sensor_type,
        sensor_name: item.sensor_name,
        description: item.description,
        connection: item.connection,
        health: item.health,
        timestamp: item.timestamp,
        datetime: item.datetime,
      })));
      setTableData(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
      setError("No data found for the selected filters. Try adjusting the filters.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    if (!areFiltersEqual(filters, newFilters)) {
      setFilters(newFilters);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs />
      </div>
      <div style={{ padding: "20px" }}>
        <FilterComponent onFilterChange={handleFilterChange} />
        {loading && <Loader />}
        {error && (
          <Box sx={{ color: "red", my: 2 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        {!loading && <DataTableComponent data={tableData} tableFilters={filters} />}
      </div>
    </>
  );
};

export default SensorEventHistory;