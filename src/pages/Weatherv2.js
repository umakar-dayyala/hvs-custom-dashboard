import React from 'react';
import { HvCard, HvGrid } from '@hitachivantara/uikit-react-core';
import { Box } from '@mui/material'; // Assuming Box is from MUI
//import {location} from '../assets/location.png'

const Weatherv2 = () => {
  return (
    <Box  paddingTop={2}>
    <HvGrid 
      container
      direction="row"
      
    >
      <HvGrid item style={{ flex: 1 }}>
        <HvCard style={{borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
          <p>div 1</p>
          {/* <img src={location} alt='location' style={{width: "100px", height: "100px"}}/> */}
        </HvCard>
      </HvGrid>
      <HvGrid item style={{ flex: 1 }}>
        <HvCard style={{borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
          <p>div 2</p>
        </HvCard>
      </HvGrid>
      <HvGrid item style={{ flex: 1 }}>
        <HvCard style={{borderRadius: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
          <p>div 3</p>
        </HvCard>
      </HvGrid>
    </HvGrid>
    </Box>
  );
};

export default Weatherv2;
