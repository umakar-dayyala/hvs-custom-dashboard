import { HvCard, HvCardContent, HvTypography } from "@hitachivantara/uikit-react-core";
import { Box } from "@mui/material";
import React from "react";

const Corelation = ({ corelationData }) => {
  const isEmpty = !corelationData || Object.keys(corelationData).length === 0;

  return (
    <Box>
      
      <HvCard
        bgcolor="white"
        style={{
          height: "500px",
          borderRadius: "0px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        statusColor="red"
      >
         <Box p={2}>
                <HvTypography variant="title2">Correlation</HvTypography>
              </Box>
        <HvCardContent>
          {isEmpty ? (
            <Box
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <HvTypography variant="title3">No data available</HvTypography>
            </Box>
          ) : (
            <>
             

              <Box textAlign="center" mb={2}>
                <HvTypography variant="title3">
                  Floor | Zone | Location
                </HvTypography>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={4}
                flexWrap="wrap"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                >
                  <Box
                    sx={{
                      backgroundColor: "red",
                      width: { xs: 120, sm: 150, md: 200 },
                      height: { xs: 120, sm: 150, md: 200 },
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      fontWeight: "bold",
                      borderRadius: "4px",
                    }}
                  >
                    Alarm CN
                    <br />
                    (Cyanide)
                  </Box>
                  <HvTypography>AP4C - F</HvTypography>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                >
                  <Box
                    sx={{
                      backgroundColor: "green",
                      width: { xs: 120, sm: 150, md: 200 },
                      height: { xs: 120, sm: 150, md: 200 },
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      fontWeight: "bold",
                      borderRadius: "4px",
                    }}
                  >
                    No Alarm
                  </Box>
                  <HvTypography>FCAD</HvTypography>
                </Box>
              </Box>
            </>
          )}
        </HvCardContent>
      </HvCard>
    </Box>
  );
};

export default Corelation;
