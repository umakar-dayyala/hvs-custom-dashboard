import { useEffect } from "react";
import { useToast, Button, HStack, VStack, Text, Icon } from "@chakra-ui/react";
import { useAlert } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";
import { MdNotificationsActive } from "react-icons/md";

const AlertBanner = () => {
    const { alert, acknowledgeAlert } = useAlert();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (alert) {
            toast({
                position: "top-right",
                duration: null,
                maxWidth: "100vw",
                render: () => (
                    <VStack
                        bg="red.500"
                        color="white"
                        p={3}
                        borderRadius="md"
                        boxShadow="md"
                        spacing={3}
                        width="200px"
                        height={120}
                        align={"center"}
                        marginLeft="auto"
                        marginRight={1}
                        marginTop="60px" 
                    >
                        <Icon as={MdNotificationsActive} boxSize={5} />
                        
                        {/* Show Outlier or Anomaly */}
                        <Text fontWeight="bold">{alert.description}</Text>  
                        
                        <HStack spacing={2}>
                            <Button
                                colorScheme="purple"
                                size="xs"
                                onClick={() => {
                                    navigate(alert.path);
                                    toast.closeAll();
                                    acknowledgeAlert();
                                }}
                            >
                                View
                            </Button>
                            <Button
                                colorScheme="blue"
                                size="xs"
                                onClick={() => {
                                    toast.closeAll();
                                    acknowledgeAlert();
                                }}
                            >
                                Acknowledge
                            </Button>
                        </HStack>
                    </VStack>
                ),
            });
        }
    }, [alert, toast, navigate, acknowledgeAlert]);

    return null;
};

export default AlertBanner;
