import React, { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack, Box, MenuItem, FormControl, Select } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; // ✅ Move this above dayjs.extend()
import "../css/DateTimeRangePicker.css"; // ✅ Keep all imports together

dayjs.extend(customParseFormat); // ✅ Move this below all imports


const DateTimeRangePicker = ({ onChange }) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(dayjs());
  const [timeRange, setTimeRange] = useState("");

  const formatDate = (date) => {
    return date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : null;
  };

  const handleTimeRangeChange = (event) => {
    const value = event.target.value;
    setTimeRange(value);

    let newStartDate = dayjs(); 
    let newEndDate = dayjs();

    if (value === "5min") {
      newStartDate = dayjs().subtract(5, "minute");
    } else if (value === "7min") {
      newStartDate = dayjs().subtract(7, "minute");
    } else if (value === "hour") {
      newStartDate = dayjs().subtract(1, "hour");
    } else if (value === "4hours") {
      newStartDate = dayjs().subtract(4, "hour");
    } else if (value === "24hours") {
      newStartDate = dayjs().subtract(24, "hour");
    } else if (value === "7days") {
      newStartDate = dayjs().subtract(7, "day");
    } else if (value === "week") {
      newStartDate = dayjs().subtract(7, "day");
    } else if (value === "last15Days") {
      newStartDate = dayjs().subtract(15, "day");
    } else if (value === "lastMonth") {
      newStartDate = dayjs().subtract(1, "month");
    } else if (value === "lastYear") {
      newStartDate = dayjs().subtract(1, "year");
    }else if(value === "10min"){
      newStartDate = dayjs().subtract(10, "minute");
    }else if(value === "15min"){
      newStartDate = dayjs().subtract(15, "minute");
    }
    

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    if (onChange) {
      onChange([formatDate(newStartDate), formatDate(newEndDate)], 1);
    }
  };

  const handleStartAccept = (newStart) => {
    setStartDate(newStart);
    setTimeRange("");
    onChange([formatDate(newStart), formatDate(endDate)], 1);
  };

  const handleEndAccept = (newEnd) => {
    setEndDate(newEnd);
    setTimeRange("");
    onChange([formatDate(startDate), formatDate(newEnd)], 1);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" className="date-time-range-picker">
      {/* Quick Select Dropdown */}
      <Box >
        <FormControl fullWidth>
        <Select
  labelId="quick-select-label"
  id="quick-select"
  value={timeRange}
  onChange={handleTimeRangeChange}
  displayEmpty
  style={{ height: "2rem" }}
>
  <MenuItem value="" disabled>
    Select Time
  </MenuItem>
  
  <MenuItem value="7min">Last 7 mins</MenuItem>
  <MenuItem value="10min">Last 10 mins</MenuItem>
  <MenuItem value="15min">Last 15 mins</MenuItem>
  {/* <MenuItem value="24hours">Last 24 hours</MenuItem>
  <MenuItem value="7days">Last 7 days</MenuItem> */}
  <MenuItem value="lastYear">Last Year</MenuItem>
</Select>

        </FormControl>
      </Box>
    </Box>
  );
};

export default DateTimeRangePicker;
