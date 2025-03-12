import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { getAlertData } from "../service/AlertSummaryService";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const toast = useToast();
  const [alert, setAlert] = useState(null);

  const showAlert = (title, description, path, status = "error") => {
    setAlert({ title, description, path });
  };

  const acknowledgeAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const alertDataArray = await getAlertData(); 
        if (alertDataArray.length > 0) {
          // Loop through each alert and display it
          alertDataArray.forEach((alertData, index) => {
            const navigationPath = `/${alertData.sensor_name}sensor?device_id=${alertData.device_id}`;
            showAlert(
              alertData.sensor_name,
              alertData.alert,
              navigationPath
            );
          });
        }
      } catch (error) {
        console.error("Error fetching alert data:", error);
      }
    }, 6000000); // Run every 1 min
  
    return () => clearInterval(interval);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, acknowledgeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
