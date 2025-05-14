import React, { useEffect, useState } from "react";
import FilterComponent from "../components/HistoryFilter";
import DataTableComponent from "../components/HistoryDataTable";
import { getSensorEventHistory } from "../service/HistoryService";
import { Button } from "@mui/material";
import { CSVLink } from "react-csv";

const SensorEventHistory = () => {
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const fetchData = async (filters) => {
    try {
      const data = await getSensorEventHistory(filters);
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div style={{ padding: "20px" }}>
      <FilterComponent onFilterChange={handleFilterChange} />
      <div style={{ margin: "10px 0" }}>
        <CSVLink data={tableData} filename={"sensor-event-history.csv"}>
          <Button variant="outlined">Export to CSV</Button>
        </CSVLink>
      </div>
      <DataTableComponent data={tableData} />
    </div>
  );
};

export default SensorEventHistory;
