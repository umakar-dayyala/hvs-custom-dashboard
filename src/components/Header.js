import React from 'react';
import PublicImage from '../PublicImage';

import {
  Flex,
  Text,
  Heading,
  Box,
  HStack,
  IconButton,
} from '@chakra-ui/react';
// import { HamburgerIcon } from '@chakra-ui/icons';
import EcilLogo from "../assets/ECIL_Logo.ico";
import VerticalDivider from './VerticalDivider';

const Header = ({ onMenuToggle }) => {
  //const currentTime = new Date().toLocaleString();

  const [currentTime, setCurrentTime] = React.useState(new Date().toLocaleString());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Flex justifyContent="space-between" alignItems="center" bg="#fbfcfc" color="#414141" p={1}>
      <Box display="flex" alignItems="center">
        <IconButton
          // icon={<HamburgerIcon />}
          aria-label="Toggle Menu"
          variant="ghost"
          onClick={onMenuToggle}
          mr={2}
        />
        {/* ECIL Logo */}
        <img
          src={EcilLogo}
          alt="ECIL Logo"
          style={{ width: 'auto', height: '40px', marginRight: '10px' }}
        />

<PublicImage src="HVS_Hitachi_LOGO.png" alt="Hitachi Logo" style={{ width: 'auto', height: '20px', marginRight: '5px' }} />
        <Text size="sm"> Hitachi Visualization Suite</Text>
      </Box>

      <HStack spacing={2}>
        <Text fontSize="sm">{currentTime}</Text>
        <PublicImage src="helpIcon.svg" alt="Help Icon" size="sm" />
        <PublicImage src="openWindowIcon.svg" alt="Open window" size="sm" />
        <PublicImage src="connectionIcon.svg" alt="Connection Icon" size="sm" />
        <PublicImage src="filterIcon.svg" alt="Filter Icon" size="sm" />
        <PublicImage src="bellIcon.svg" alt="Ball Icon" size="sm" />
        <PublicImage src="userIcon.svg" alt="User Icon" size="sm" />
      </HStack>
    </Flex>
  );
};

export default Header;