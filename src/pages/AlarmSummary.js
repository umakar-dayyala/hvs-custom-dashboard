import React from 'react';
import SummaryCards from '../components/SummaryCards';
import DeviceFilter from '../components/DeviceFilter';
import { Box } from '@mui/material';
import Breadcrumbs from '../components/Breadcrumbs';


const AlarmSummary = () => {
  return (
    <Box>
        <Breadcrumbs/>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>

      {/* Fixed Summary Cards */}
      <Box  mt={2}>
        <SummaryCards />
      </Box>
      
      {/* Device Filter with scrollable content */}
      <Box sx={{ flex: 1, overflow: 'hidden', mt: 2 }}>
        <DeviceFilter />
      </Box>
    </Box>
    </Box>
  );
};

export default AlarmSummary;