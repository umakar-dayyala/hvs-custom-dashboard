import React from 'react';
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
import combinationLogo from "../assets/Combination_Logo.png";
import VerticalDivider from './VerticalDivider';
import HitachiLogo from "../assets/HVS_Hitachi_LOGO.png";

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
        {/* <img
          src={combinationLogo}
          alt="ECIL Logo"
          style={{ width: 'auto', height: '90px', marginRight: '15px',marginLeft: '10px' }}
        /> */}

        <img
          src={EcilLogo}
          alt="ECIL Logo"
          style={{ width: 'auto', height: '80px', marginRight: '15px', marginLeft: '10px' }}
        />
        
        <img
          src={HitachiLogo}
          alt="Hitachi Logo"
          style={{ width: 'auto', height: '20px', marginRight: '15px' }}
        />

        {/* <img src="/HVS_Hitachi_LOGO.png" alt="Logo" style={{ width: 'auto', height: '20px', marginRight: '5px' }} />
        <Text size="sm"> Hitachi Visualization Suite</Text> */}
      </Box>

      <HStack spacing={2}>
        <Text fontSize="sm">{currentTime}</Text>
        <img src="/helpIcon.svg" size="sm" />
        <img src="/openWindowIcon.svg" size="sm" />
        <img src="/connectionIcon.svg" size="sm" />
        <img src="/filterIcon.svg" size="sm" />
        <img src="/bellIcon.svg" size="sm" />
        <img src="/userIcon.svg" size="sm" />
      </HStack>
    </Flex>
  );
};

export default Header;
