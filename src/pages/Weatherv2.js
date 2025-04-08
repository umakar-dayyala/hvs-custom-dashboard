import React from 'react';
import { HvCard, HvGrid, HvTypography } from '@hitachivantara/uikit-react-core';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import location from '../assets/location.png';

import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import OpacityIcon from '@mui/icons-material/Opacity';
import CompressIcon from '@mui/icons-material/Compress';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import WindRoseChart from '../components/WindRoseChart';
import WindRoseChartTango from '../components/WindRoseChartTango';

import GaugeChart from 'react-gauge-chart';

const weatherMetaMap = {
    'Air Temperature': {
      icon: <ThermostatIcon sx={{ color: 'red', fontSize: '60px' }} />,
      max: 50,
    },
    'Relative Humidity (%)': {
      icon: <WaterDropIcon sx={{ color: 'skyblue', fontSize: '60px' }} />,
      max: 100,
    },
    'Cumulative Rain (mm)': {
      icon: <OpacityIcon sx={{ color: 'skyblue', fontSize: '60px' }} />,
      max: 100,
    },
    'Pressure': {
      icon: <CompressIcon sx={{ color: 'skyblue', fontSize: '60px' }} />,
      max: 1100,
    },
    'Solar radiation': {
      icon: <WbSunnyIcon color="warning" sx={{ fontSize: '60px' }} />,
      max: 1000,
    },
  };

const Weatherv2 = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const apiData = [
    { label: 'Air Temperature', value: '32°C' },
    { label: 'Relative Humidity (%)', value: '60%' },
    { label: 'Cumulative Rain (mm)', value: '12.5 mm' },
    { label: 'Pressure', value: '1013 hPa' },
    { label: 'Solar radiation', value: '450 Wm' },
  ];
  
  const weatherStatsIG6 = apiData.map(item => {
    const meta = weatherMetaMap[item.label] || {};
    const numericValue = parseFloat(item.value); // Extract number from value string
  
    return {
      ...item,
      icon: meta.icon,
      max: meta.max,
      numeric: isNaN(numericValue) ? undefined : numericValue,
    };
  });
  
  const weatherStatsTango = [...weatherStatsIG6];

  const locations = [
    { name: 'IG 6', stats: weatherStatsIG6 },
    { name: 'Tango', stats: weatherStatsTango },
  ];

  return (
    <Box padding={2}>
      <HvGrid container spacing={2}>
        {locations.map((locationData, index) => {
          const firstRow = locationData.stats.slice(0, 2);
          const secondRow = locationData.stats.slice(2, 5);

          return (
            <HvGrid item xs={12} md={6} key={index}>
              <HvCard
                style={{
                  borderRadius: '0px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  padding: '10px',
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                  }}
                >
                  <img src={location} alt="location" style={{ width: '40px', height: '40px' }} />
                  <HvTypography variant="title3">{locationData.name}</HvTypography>
                </Box>

                {/* First Row */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '10px',
                    justifyContent: isSmallScreen ? 'center' : 'space-between',
                  }}
                >
                  {firstRow.map((stat, idx) => (
                   <HvCard
                   key={idx}
                   bgcolor="white"
                   style={{
                     flex: '1 1 calc(50% - 10px)',
                     minWidth: '160px',
                     boxSizing: 'border-box',
                   }}
                 >
                   <Box margin={2}>
                     <HvTypography variant="title3" style={{ marginBottom: '8px' }}>
                       {stat.label}
                     </HvTypography>
                 
                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                       {/* Icon and Value Section */}
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         {stat.icon}
                         <HvTypography variant="title" style={{ fontSize: '30px' }}>
                           {stat.value}
                         </HvTypography>
                       </Box>
                 
                       {/* Gauge for Air Temp and Humidity */}
                       {(stat.label === 'Air Temperature' || stat.label === 'Relative Humidity (%)') && (
                         <Box sx={{ width: '200px', height: '80px' }}>
                           <GaugeChart
                             id={`gauge-${index}-${idx}`}
                             nrOfLevels={20}
                             percent={stat.numeric / stat.max}
                             colors={['#FF5F6D', '#FFC371', '#00C851']}
                             arcWidth={0.3}
                             textColor="#000000"
                             animate={true}
                             needleColor="#345243"
                             formatTextValue={() => ''}
                           />
                         </Box>
                       )}
                     </Box>
                   </Box>
                 </HvCard>
                 
                  ))}
                </Box>

                {/* Second Row */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    padding: '10px',
                    justifyContent: isSmallScreen ? 'center' : 'space-between',
                  }}
                >
                  {secondRow.map((stat, idx) => (
                    <HvCard
                      key={idx}
                      bgcolor="white"
                      style={{
                        flex: '1 1 calc(33.33% - 10px)',
                        minWidth: '140px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Box margin={2}>
                        <HvTypography variant="title3" style={{ marginBottom: '8px' }}>
                          {stat.label}
                        </HvTypography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 1 }}>{stat.icon}</Box>
                          <HvTypography variant="title" style={{ fontSize: '30px' }}>
                            {stat.value}
                          </HvTypography>
                        </Box>
                      </Box>
                    </HvCard>
                  ))}
                </Box>
              </HvCard>
            </HvGrid>
          );
        })}
      </HvGrid>

      {/* Wind Rose Charts */}
      <HvGrid container spacing={2} style={{ marginTop: 16 }}>
        <HvGrid item xs={12} md={6}>
          <WindRoseChart />
        </HvGrid>
        <HvGrid item xs={12} md={6}>
          <WindRoseChartTango />
        </HvGrid>
      </HvGrid>
    </Box>
  );
};

export default Weatherv2;
