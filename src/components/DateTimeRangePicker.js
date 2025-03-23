import React, { useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack, Box, MenuItem, FormControl, Select } from "@mui/material";
import dayjs from "dayjs";
import '../css/DateTimeRangePicker.css';

const DateTimeRangePicker = ({ onChange }) => {
  const [startDate, setStartDate] = useState(dayjs().subtract(5, "minute"));
  const [endDate, setEndDate] = useState(dayjs());
  const [timeRange, setTimeRange] = useState("");

  const handleTimeRangeChange = (event) => {
    const value = event.target.value;
    setTimeRange(value);

    let newStartDate;
    let newEndDate = dayjs(); // Default end date is now

    if (value === "5min") {
      newStartDate = dayjs().subtract(5, "minute");
    } else if (value === "7min") {
      newStartDate = dayjs().subtract(7, "minute");
    } else if (value === "week") {
      newStartDate = dayjs().subtract(7, "day");
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onChange([newStartDate, newEndDate], 1);
  };

  const handleStartAccept = (newStart) => {
    setStartDate(newStart);
    setTimeRange(""); // Reset the selector
    onChange([newStart, endDate], 1);
  };

  const handleEndAccept = (newEnd) => {
    setEndDate(newEnd);
    setTimeRange(""); // Reset the selector
    onChange([startDate, newEnd], 1);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" className="date-time-range-picker">
      <Box mt={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DateTimePicker
              label="Start Date & Time"
              value={startDate}
              onAccept={handleStartAccept} // Updates only when "OK" is clicked
              renderInput={(params) => <TextField {...params} sx={{ width: "20rem" }} />}
            />
            <span>to</span>
            <DateTimePicker
              label="End Date & Time"
              value={endDate}
              onAccept={handleEndAccept} // Updates only when "OK" is clicked
              renderInput={(params) => <TextField {...params} sx={{ width: "20rem" }} />}
            />
          </Stack>
        </LocalizationProvider>
      </Box>
      <Box sx={{ minWidth: 120 }} mt={2} ml={2}>
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
            <MenuItem value="5min">Last 5 mins</MenuItem>
            <MenuItem value="7min">Last 7 mins</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default DateTimeRangePicker;
