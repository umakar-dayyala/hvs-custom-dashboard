import React from 'react';
import { Flex, Box, Text, Spacer, Badge, Button } from '@chakra-ui/react';

const StatusHeader = ({ title, location, activeSensors, inactiveSensors }) => (
    <Flex p={2} bg="gray.800" color="white" align="center">
        <Text fontSize="lg" fontWeight="bold">{title}</Text>
        <Spacer />
        <Text ml={2}><b>Location: </b> {location}</Text>
        <Badge colorScheme="green" ml={2}>Active</Badge>
        <Box as="button" bg="blue" color="white" ml={1} p={1} borderRadius="md">Acknowledge</Box>
        <Button ml={2} onClick={() => window.location.reload()} colorScheme="teal">Refresh</Button>
    </Flex>
);

export default StatusHeader;