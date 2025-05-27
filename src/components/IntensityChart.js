import React, { useState } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HvCard } from "@hitachivantara/uikit-react-core";
import Alerts from "./Alerts";


const IntensityChart = ({ intensityData = {} }) => {
  const { alertData = {}, mostRecentAlert = {} } = intensityData;
  const [selectedChemical, setSelectedChemical] = useState("All Parameters");
  const [view, setView] = useState("alerts"); // toggle between overview and alerts

  const chemicalList = ["All Parameters", ...Object.keys(alertData)];

  const renderAlertCircle = (value, type) => {
    const val = (value || "").toLowerCase().trim();
    let color = "#ccc";

    if (val === "alert") {
      if (type === "concentration") color = "#f9b233";
      else if (type === "instant") color = "#f9423a";
      else if (type === "critical") color = "#891c1c";
    }

    return (
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: color,
          margin: "auto",
        }}
      />
    );
  };

  const renderAlertMatrix = () => {
    const filteredData =
      selectedChemical === "All Parameters"
        ? alertData
        : { [selectedChemical]: alertData[selectedChemical] };

    return Object.entries(filteredData).map(([chemical, alerts]) => (
      <Box
        key={chemical}
        display="flex"
        justifyContent="space-between"
        py={1}
        borderBottom="1px solid #eee"
      >
        <Typography sx={{ width: "30%", textTransform: "capitalize" }}>
          {chemical}
        </Typography>
        {["concentration", "instant", "critical"].map((type, idx) => (
          <Box
            key={idx}
            sx={{ width: "22%", display: "flex", justifyContent: "center" }}
          >
            {renderAlertCircle(alerts?.[type], type)}
          </Box>
        ))}
      </Box>
    ));
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" fontWeight="bold">
          Intensity Estimation
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ width: "100%" }}>
          {/* View Toggle */}
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, val) => val && setView(val)}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="overview">Overview</ToggleButton>
            <ToggleButton value="alerts">Alerts</ToggleButton>
          </ToggleButtonGroup>

          <HvCard
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "white",
              borderRadius: "0px",
            }}
          >
            {view === "alerts" ? (
              <Alerts intensityData={intensityData}/>
            ) : Object.keys(intensityData).length > 0 ? (
              <>
                {/* Summary Cards */}
                <Box paddingTop={2}>
                  <Box display="flex" gap={2} flexWrap="wrap" m={2}>
                    <Box
                      flex={1}
                      bgcolor="#fff3cd"
                      p={2}
                      borderRadius={2}
                      minWidth={250}
                    >
                      <Typography fontWeight="bold">Concentration Alert</Typography>
                      <Typography fontSize="0.875rem" mb={1}>
                        concentration exceeds normal levels
                      </Typography>
                    </Box>

                    <Box
                      flex={1}
                      bgcolor="#f8d7da"
                      p={2}
                      borderRadius={2}
                      minWidth={250}
                    >
                      <Typography fontWeight="bold">Instant Alert</Typography>
                      <Typography fontSize="0.875rem" mb={1}>
                        concentration requires immediate attention
                      </Typography>
                    </Box>

                    <Box
                      flex={1}
                      bgcolor="#f5c6cb"
                      p={2}
                      borderRadius={2}
                      minWidth={250}
                    >
                      <Typography fontWeight="bold">Critical Alert</Typography>
                      <Typography fontSize="0.875rem" mb={1}>
                        Dangerous level reached, evacuation may be necessary
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Most Recent Alert */}
                {mostRecentAlert?.type?.toLowerCase() !== "no alert" && (
                  <Box m={2}>
                    <Typography variant="body2" fontWeight="bold">
                      Most Recent Alert:
                    </Typography>
                    <Typography variant="body2">
                      <strong>{mostRecentAlert.type}</strong> for{" "}
                      {mostRecentAlert.parameter} at {mostRecentAlert.time}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Alert Matrix */}
                <Box m={2}>
                  <Typography variant="h6" gutterBottom>
                    Alert Matrix
                  </Typography>

                  <ToggleButtonGroup
                    value={selectedChemical}
                    exclusive
                    onChange={(e, newVal) =>
                      newVal && setSelectedChemical(newVal)
                    }
                    size="small"
                    sx={{ mb: 2, flexWrap: "wrap" }}
                  >
                    {chemicalList.map((chem) => (
                      <ToggleButton key={chem} value={chem}>
                        {chem.toUpperCase()}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>

                  {/* Table Header */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    borderBottom="2px solid #000"
                    pb={1}
                  >
                    <Typography sx={{ width: "30%", fontWeight: "bold" }}>
                      Parameters
                    </Typography>
                    <Typography
                      sx={{
                        width: "22%",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#f9b233",
                      }}
                    >
                      Concentration
                    </Typography>
                    <Typography
                      sx={{
                        width: "22%",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#f9423a",
                      }}
                    >
                      Instant
                    </Typography>
                    <Typography
                      sx={{
                        width: "22%",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#891c1c",
                      }}
                    >
                      Critical
                    </Typography>
                  </Box>

                  {renderAlertMatrix()}
                </Box>
              </>
            ) : (
              <Box p={3}>
                <Typography color="textSecondary" align="center">
                  No intensity data available.
                </Typography>
              </Box>
            )}
          </HvCard>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default IntensityChart;
