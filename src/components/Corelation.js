import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  HvCard,
  HvCardContent,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const Corelation = ({ corelationData }) => {
  const isEmpty =
    !corelationData || Object.keys(corelationData).length === 0;

  // accordion expanded only when there is data
  const [expanded, setExpanded] = useState(!isEmpty);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <HvTypography variant="title3" >
          Correlation
        </HvTypography>
      </AccordionSummary>

      <AccordionDetails>
        <Box>
          <HvCard
            bgcolor="white"
            style={{
              height: "500px",
              borderRadius: 0,
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
            }}
            statusColor="red"
          >
            

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
                    {/* Alarm cyanide card */}
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

                    {/* No-alarm card */}
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
      </AccordionDetails>
    </Accordion>
  );
};

export default Corelation;
