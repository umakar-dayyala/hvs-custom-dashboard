import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, Box } from "@mui/material";
import dayjs from "dayjs";

const DateTimeRangePicker = ({ onChange, onOptionChange }) => {
  const [timeRange, setTimeRange] = useState("5min");
  const [startDate, setStartDate] = useState(dayjs().subtract(5, "minute"));
  const [endDate, setEndDate] = useState(dayjs());

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss");

  const updateTimeRange = (selectedRange) => {
    let newStartDate = dayjs();
    switch (selectedRange) {
      case "5min":
        newStartDate = dayjs().subtract(5, "minute");
        break;
      case "7min":
        newStartDate = dayjs().subtract(7, "minute");
        break;
      case "10min":
        newStartDate = dayjs().subtract(10, "minute");
        break;
      case "15min":
        newStartDate = dayjs().subtract(15, "minute");
        break;
      case "7days":
        newStartDate = dayjs().subtract(7, "day");
        break;
      case "lastMonth":
        newStartDate = dayjs().subtract(1, "month");
        break;
      default:
        newStartDate = dayjs().subtract(5, "minute");
    }

    setStartDate(newStartDate);
    setEndDate(dayjs());

    if (onChange) {
      onChange([formatDate(newStartDate), formatDate(dayjs())], 1);
    }
  };

  // Update when time range is selected
  useEffect(() => {
    updateTimeRange(timeRange);
  }, [timeRange]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTimeRange(timeRange);
    }, 10000); // Updates every 10 seconds

    return () => clearInterval(intervalId);
  }, [timeRange]);

  const handleTimeRangeChange = (event) => {
    const value = event.target.value;
    setTimeRange(value);
    if (onOptionChange) {
      onOptionChange(value);
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <FormControl fullWidth>
        <Select
          labelId="quick-select-label"
          id="quick-select"
          value={timeRange}
          onChange={handleTimeRangeChange}
          displayEmpty
          style={{ height: "2rem" }}
        >
          <MenuItem value="5min">Last 5 mins</MenuItem>
          <MenuItem value="7min">Last 7 mins</MenuItem>
          <MenuItem value="10min">Last 10 mins</MenuItem>
          <MenuItem value="15min">Last 15 mins</MenuItem>
          <MenuItem value="7days">Last 7 days</MenuItem>
          <MenuItem value="lastMonth">Last Month</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default DateTimeRangePicker;
