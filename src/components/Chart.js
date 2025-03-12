import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Chart = ({ data }) => {
  return (
    <Box 
      p={5} 
      borderWidth="1px" 
      borderRadius="lg" 
      boxShadow="sm" 
      bg="gray.50" 
      overflowX="auto"
    >
      <Text fontWeight="bold" mb={4}>
        Alert Chart (Example)
      </Text>
      <Text>Columns: {data.columns.join(', ')}</Text>
      {data.data.map((row, index) => (
        <Box key={index} mb={2}>
          {row.join(' | ')}
        </Box>
      ))}
    </Box>
  );
};

export default Chart;
