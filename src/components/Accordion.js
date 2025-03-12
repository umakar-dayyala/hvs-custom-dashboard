import React from "react";
import { NavLink } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Link,
} from "@chakra-ui/react";
import { FaBiohazard, FaRadiation } from "react-icons/fa";
import { tableFloors } from "../service/summeryDashboard";

const AccordionTable = ({ floors }) => {
  if (!floors || floors.length === 0) {
    return <Text>No data available.</Text>;
  }

  const totalFloors = floors.length;
  const totalZones = floors.reduce((acc, floor) => acc + floor.zones.length, 0);
  const totalSensors = floors.reduce(
    (floorAcc, floor) =>
      floorAcc +
      floor.zones.reduce((zoneAcc, zone) => zoneAcc + zone.sensors, 0),
    0
  );

  const getIcon = (sensorName) => {
    sensorName = String(sensorName);

    if (sensorName.includes("Radiation")) {
      return (
        <Flex align="center" gap={3}>
          {/* TODO:: // Change the color of the flask icon to based on condition */}
          <FaRadiation color="green" size="20px" />
          <Text>{sensorName.replace("Radiation", "")}</Text>
        </Flex>
      );
    } else if (sensorName.includes("Biological")) {
      return (
        <Flex align="center" gap={3}>
          {/* TODO:: // Change the color of the flask icon to based on condition */}
          <FaBiohazard color="green" size="35px" />
          <Text>{sensorName.replace("Biological", "")}</Text>
        </Flex>
      );
    } else if (sensorName.includes("Chemical")) {
      return (
        <Flex align="center" gap={3}>
          {/* TODO:: // Change the color of the flask icon to based on condition */}
          <FaBiohazard color="green" size="20px" />
          <Text>{sensorName.replace("Chemical", "")}</Text>
        </Flex>
      );
    } else {
      return <Text>{sensorName}</Text>;
    }
  };

  return (
    <>
      <Flex justify="space-between" width="100%" wrap="wrap" gap={2} mb={4}>
        <Text flex="1" textAlign="left" fontWeight="bold">
          ALL Floors
        </Text>
        <Flex gap={2}>
          <Text>Total Floors: {totalFloors}</Text>
          <Text>Total Zones: {totalZones}</Text>
          <Text>Total Sensors: {totalSensors}</Text>
        </Flex>
      </Flex>

      <Accordion
        allowToggle
        width="100%"
        borderRadius={5}
        background="#f5f5f5"
        borderColor="#f5f5f5"
      >
        {floors.map((floor, floorIndex) => (
          <AccordionItem key={floorIndex} borderColor="#f5f5f5">
            <Box>
              <h2>
                <AccordionButton
                  background="#f5f5f5"
                  color="#676a6c"
                  borderColor="#f5f5f5"
                >
                  <Flex
                    justify="space-between"
                    width="100%"
                    wrap="wrap"
                    gap={2}
                  >
                    <Text flex="1" textAlign="left" fontWeight="bold">
                      Floor: {floor.floorName}
                    </Text>

                    {/* Floor-level stats displayed in the AccordionButton */}
                    <Flex gap={2}>
                      <Text>
                        Inactive :{" "}
                        {floor.zones.reduce(
                          (acc, zone) => acc + zone.inactiveSensors,
                          0
                        )}
                      </Text>
                      <Text>
                        Alarms:{" "}
                        {floor.zones.reduce(
                          (acc, zone) => acc + zone.cbrnAlarms,
                          0
                        )}
                      </Text>
                      <Text>
                        Health Alerts:{" "}
                        {floor.zones.reduce(
                          (acc, zone) => acc + zone.healthAlerts,
                          0
                        )}
                      </Text>
                      <Text>
                        Incidents:{" "}
                        {floor.zones.reduce(
                          (acc, zone) => acc + zone.openIncidents,
                          0
                        )}
                      </Text>
                    </Flex>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} borderColor="#4a4a4a">
                {/* Zone-level stats */}
                <Accordion allowToggle borderColor="#4a4a4a">
                  {floor.zones.map((zone, zoneIndex) => (
                    <AccordionItem key={zoneIndex} borderColor="#4a4a4a">
                      <h2>
                        <AccordionButton
                          // background="#5a5a5a"
                          // color="#faf9fd"
                          // borderColor="#5a5a5a"
                          background="#f8fbff"
                          color="#676a6c"
                          borderColor="#f5f5f5"
                        >
                          <Flex
                            justify="space-between"
                            width="100%"
                            wrap="wrap"
                            gap={2}
                          >
                            <Text flex="1" textAlign="left" fontWeight="bold">
                             Zone {zone.zoneNumber}
                            </Text>
                            <Flex gap={2}>
                              <Text>Inactive : {zone.inactiveSensors}</Text>
                              <Text>Alarms: {zone.cbrnAlarms}</Text>
                              <Text>Health Alerts: {zone.healthAlerts}</Text>
                              <Text>Incidents: {zone.openIncidents}</Text>
                            </Flex>
                          </Flex>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4} borderColor="#5a5a5a">
                        <Table variant="simple" size="sm" >
                          <Thead background="#fbfbfb">
                            <Tr>
                              {zone.columns.map((column, index) => (
                                <Th key={index} color="#676a6c">
                                  {column}
                                </Th>
                              ))}
                            </Tr>
                          </Thead>
                          <Tbody>
                            {zone.data.map((row, rowIndex) => {
                              const deviceId = row.device_id; 
                              const sensorType = `${row.sensor_type} ${row.Sensor}`; 
                              return (
                                <Tr key={rowIndex}>
                                  {Object.entries(row)
                                    .filter(([key]) => (key !== "device_id" && key !== "sensor_type"))
                                    .map(([key, cell], cellIndex) => {
                                      let sensorPath = "";
                                      // Dynamically create sensor URL
                                      if (key === "Sensor") {
                                        sensorPath = `${cell.toLowerCase()}sensor?device_id=${deviceId}&location=${row.Location}`;    
                                      }

                                      return (
                                        <Td key={cellIndex} color="#676a6c">
                                            
                                          {key === "Sensor" ? (
                                            <Link
                                              target="_blank"
                                              href={sensorPath}
                                              color="#676a6c"
                                            >
                                              {getIcon(sensorType)}
                                            </Link>
                                          ) :(
                                            cell
                                          )}
                                        </Td>
                                      );
                                    })}
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionPanel>
            </Box>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default AccordionTable;
