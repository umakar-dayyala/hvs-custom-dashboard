import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function QuickTimeSelector() {
  const [timeRange, setTimeRange] = React.useState('');

  const handleChange = (event) => {
    setTimeRange(event.target.value);
    console.log(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }} mt={2}>
      <FormControl fullWidth>
        <Select
          labelId="quick-select-label"
          id="quick-select"
          value={timeRange}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Time Range
          </MenuItem>
          <MenuItem value="5min">Last 5 mins</MenuItem>
          <MenuItem value="7min">Last 7 mins</MenuItem>
          <MenuItem value="week">Last Week</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
