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
import EcilLogo from "../assets/ecilIcon.svg";

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
        <img src="/HVS_Hitachi_LOGO.png" alt="Logo" style={{ width: 'auto', height: '15px', marginRight: '10px' }} />
        {/* ECIL Logo */}
        <img
          src={EcilLogo}
          alt="ECIL Logo"
          style={{ width: 'auto', height: '25px', marginRight: '20px' }}
        />
        <Text size="sm">Hitachi Visualization Suite</Text>
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
