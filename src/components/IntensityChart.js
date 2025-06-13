import React, { useState, useMemo } from "react";
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
  const [view, setView] = useState("alerts");

  const chemicalList = ["All Parameters", ...Object.keys(alertData)];

  // ✅ Dynamically extract alert types (columns)
  const dynamicAlertTypes = useMemo(() => {
    const sample = Object.values(alertData)?.[0];
    if (sample) {
      return Object.keys(sample).filter(
        (key) =>
          typeof sample[key] === "string" &&
          !["status", "timestamp", "value"].includes(key.toLowerCase())
      );
    }
    return [];
  }, [alertData]);

  const renderAlertCircle = (value, type) => {
    const val = (value || "").toLowerCase().trim();
    let color = "#ccc";

    if (val === "alert") {
      // Assign custom colors if needed
      if (type.toLowerCase().includes("concentration")) color = "#f9b233";
      else if (type.toLowerCase().includes("instant")) color = "#f9423a";
      else if (type.toLowerCase().includes("critical")) color = "#891c1c";
      else if (type.toLowerCase().includes("final")) color = "#e91e63";
      else if (type.toLowerCase().includes("preliminary")) color = "#3f51b5";
      else color = "#f442c8";
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
        {dynamicAlertTypes.map((type, idx) => (
          <Box
            key={idx}
            sx={{ width: `${70 / dynamicAlertTypes.length}%`, display: "flex", justifyContent: "center" }}
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
              <Alerts intensityData={intensityData} />
            ) : Object.keys(intensityData).length > 0 ? (
              <>
                {/* Most Recent Alert */}
                {mostRecentAlert?.type?.toLowerCase() !== "no alert" &&
                  mostRecentAlert?.type?.toLowerCase() !== "no warning triggered" && (
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
                    onChange={(e, newVal) => newVal && setSelectedChemical(newVal)}
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
                    {dynamicAlertTypes.map((type, i) => (
                      <Typography
                        key={i}
                        sx={{
                          width: `${70 / dynamicAlertTypes.length}%`,
                          textAlign: "center",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {type.replace(/_/g, " ")}
                      </Typography>
                    ))}
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
