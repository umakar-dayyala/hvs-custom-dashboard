import React, { useState, useEffect } from "react";
import { HvCard, HvCardContent, HvTypography, HvStack } from "@hitachivantara/uikit-react-core";
import "../css/IndividualParameters.css"; // Importing external CSS

// Function to capitalize the first letter of each word
const capitalize = (str) =>
  str
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const IndividualParameters = ({ sampleData = [] }) => {
  const [notificationData, setNotificationData] = useState(null);

  // Simulate fetching notification data
  //call notification api
  useEffect(() => {
    // Dummy notification data
    const dummyNotificationData = {
      alert: "High Radiation Detected",
      timestamp: "2025-03-20 12:45:00",
    };

    setNotificationData(dummyNotificationData);
  }, []);

  if (!sampleData.length) return <p>No data available</p>; // Handle empty array case

  const dataObject = sampleData[0]; // Extract the first object from the array

  return (
    <div className="parameter-container">
      {Object.keys(dataObject).map((sectionTitle) => {
        const parameters = dataObject[sectionTitle];

        return (
          <HvCard key={sectionTitle} className="parameter-card" bgcolor="white" statusColor="red">
            <HvCardContent className="parameter-content">
              <HvTypography variant="title2">{sectionTitle.replace(/_/g, " ")}</HvTypography>
              <HvStack direction="column" divider spacing="sm">
                {Object.keys(parameters).map((key) => (
                  <div key={key} className="parameter-row">
                    <HvTypography className="parameter-key">{capitalize(key)}</HvTypography>
                    <HvTypography className="parameter-value">{parameters[key]}</HvTypography>
                  </div>
                ))}
              </HvStack>
            </HvCardContent>
          </HvCard>
        );
      })}

      {/* Notification Card with Dummy Data */}
      {notificationData && (
        <HvCard key="notification" className="parameter-card" bgcolor="white" statusColor="red">
          <HvCardContent className="parameter-content">
            <HvTypography variant="title2">Notifications</HvTypography>
            <HvStack direction="column" divider spacing="sm">
              {Object.keys(notificationData).map((key) => (
                <div key={key} className="parameter-row">
                  <HvTypography className="parameter-key">{capitalize(key)}</HvTypography>
                  <HvTypography className="parameter-value">{notificationData[key]}</HvTypography>
                </div>
              ))}
            </HvStack>
          </HvCardContent>
        </HvCard>
      )}
    </div>
  );
};

export default IndividualParameters;
