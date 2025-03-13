import React from "react";
import { SimpleGrid, Box, Text, Flex, HStack } from "@chakra-ui/react";
// import { BellIcon } from "@chakra-ui/icons";

// Define image mappings based on type and notification status
const imageMap = {
  biological: {
    default: "/aBiological.png",
    alert: "/rBiological.png",
  },
  radiological: {
    default: "/aRadiation.png",
    alert: "/rRadiation.png",
  },
  chemical: {
    default: "/aChemical.png",
    alert: "/rChemical.png",
  },
};

const StatusCards = ({ data }) => {
  // If data is undefined or not an array, use an empty array
  const safeData = Array.isArray(data) ? data : [];

  // Determine the main image based on the first card type, with safety check
  const mainImage =
    safeData.length > 0
      ? imageMap[safeData[0].type]?.[safeData.some((card) => card.hasNotification) ? "alert" : "default"]
      : "/default.png";

  return (
    <HStack w="full" justify="space-between" align="center">
      {/* Main Image - Fixed width */}
      <Box flex="0 0 100px">
        <img src={mainImage} alt="Logo" width="100" height="100" />
      </Box>

      {/* Cards - Take remaining space */}
      <SimpleGrid w="full" columns={{ base: safeData.length, md: safeData.length }} spacing={2}>
        {safeData.map((card, index) => (
          <Box
            key={index}
            flex="1"
            p={4}
            bg="gray.700"
            color="white"
            borderRadius="md"
            textAlign="center"
            borderTopWidth="6px"
            borderColor={card.hasNotification ? "red" : "green"}
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="lg" fontWeight="bold" flex="1" textAlign="center">
                {card.label}
              </Text>
              {/* <BellIcon
                boxSize={8}
                color={card.hasNotification ? "red" : "green"}
              /> */}
            </Flex>
            <Text fontSize="2xl" fontWeight="bold">{card.value}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </HStack>
  );
};

export default StatusCards;
