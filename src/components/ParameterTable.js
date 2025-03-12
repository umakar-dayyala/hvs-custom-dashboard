import { Box, Grid, Text, Flex, Divider, SimpleGrid } from "@chakra-ui/react";

const ParameterTable = ({ parameters }) => {
  const groupedParams = (parameters || []).reduce((acc, param) => {
    (acc[param.category] = acc[param.category] || []).push(param);
    return acc;
  }, {});


  return (
    <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2} bg="gray.800" p={2} borderRadius="md">
      {Object.entries(groupedParams).map(([category, params], index) => (
        <Box key={index} p={2} bg="gray.700" borderRadius="md" minWidth="40%">
          <Text color="white" fontWeight="bold" mb={1} textAlign="center" fontSize="md">
            {category}
          </Text>
          <Divider mb={1} borderColor="gray.500" />
          <SimpleGrid columns={2} spacing={2}>
            {params.map((param, idx) => (
              <Flex key={idx} justify="space-between" p={1} borderBottom="1px solid gray">
                <Text color="gray.300" fontSize="sm">{param.name}</Text>
                <Text
                  color={category.toLowerCase() === "health status" && param.value === "OK" ? "green.500" : "white"}
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {param.value}
                </Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Grid>
  );
};

export default ParameterTable;

