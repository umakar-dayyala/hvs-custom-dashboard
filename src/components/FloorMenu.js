import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

const FloorMenu = ({ isOpen, onClose }) => {
const floors = ['Ground Floor', 'First Floor', 'Second Floor', 'All Floors'];

return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#fbfcfc" color="#414141">
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>

            <DrawerBody>
                <VStack spacing={4} align="stretch">
                    <Menu>
                        <MenuButton>
                            {floors.map((floor, index) => (
                                <MenuItem key={index} onClick={() => alert(`${floor} Selected`)}>
                                    {floor}
                                </MenuItem>
                            ))}
                        </MenuButton>
                    </Menu>
                </VStack>
            </DrawerBody>
        </DrawerContent>
    </Drawer>
);
};

export default FloorMenu;
