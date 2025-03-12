import { useEffect, useState } from "react";
import { Box, SimpleGrid, VStack, Text } from "@chakra-ui/react";
//import Header from "../components/Header";
import Cards from "../components/Cards";
import FloorTab from "../components/FloorTabs";
import FloorCard from "../components/FloorCard";
import { fetchOperatorsDashboardData } from "../service/OperatorDashboardService";

const OperatorsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchOperatorsDashboardData();
      console.log(data);
      if (data) setDashboardData(data);
    };
    loadData();
  }, []);

 
  return (
    <Box>
      {dashboardData && (
        <>
          <Cards data={dashboardData.summary} />
          <VStack align="stretch" spacing={4} p={4}>
            <Text fontWeight="bold" fontSize="lg">Operators Dashboard - Main Page</Text>
            <FloorTab tabs={dashboardData.tabs} />
            <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={10}>
              {dashboardData.floors.map((floor, index) => (
                <FloorCard key={index} floor={floor} />
              ))}
            </SimpleGrid>
          </VStack>
          <Box p={4} bg="green.100" mt={4} textAlign="center">
            <Text fontWeight="bold">{dashboardData.footerMessage}</Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default OperatorsDashboard;
