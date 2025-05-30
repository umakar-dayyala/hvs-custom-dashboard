import React, { useState, useEffect, useRef } from "react";
import { CSVLink } from "react-csv";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { getSensorEventHistory } from "../service/HistoryService";

// CSS for animations
const pulseKeyframes = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const smoothFillKeyframes = `
  @keyframes smoothFill {
    0% { transform: scaleX(0); }
    100% { transform: scaleX(1); }
  }
`;

const styles = StyleSheet.create({
  page: {
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    fontSize: 8,
    paddingHorizontal: 2,
    textAlign: "left",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#eee",
    paddingVertical: 6,
  },
  title: {
    fontSize: 8,
    marginBottom: 10,
    fontWeight: "bold",
  },
  pageNumber: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 8,
    color: "#333",
  },
});

export const HistoryPDF = ({ data, allColumns, filters }) => {
  console.log("Generating PDF with data:", data);
  const columnsPerPage = 9;
  const columnChunks = [];
  for (let i = 0; i < allColumns.length; i += columnsPerPage) {
    columnChunks.push(allColumns.slice(i, i + columnsPerPage));
  }
  // Extract unique sensor_name, device_id, and sensor_type from data
  const sensorNames = [...new Set(data.map((row) => row.sensor_name).filter((name) => name))].join(", ") || "N/A";
  const deviceIds = [...new Set(data.map((row) => row.device_id).filter((id) => id))].join(", ") || "N/A";
  const sensorTypes = [...new Set(data.map((row) => row.sensor_type).filter((type) => type))].join(", ") || "N/A";
  const titleDataType = filters?.dataType === "raw" ? "Raw data" : "Processed data";

  return (
    <Document>
      {columnChunks.map((chunk, chunkIndex) => (
        <Page key={chunkIndex} size="A4" orientation="landscape" style={styles.page}>
          <Text style={styles.title}>{`Sensor Event History(${titleDataType}) Part ${chunkIndex + 1} - Sensor: ${sensorNames}, Device ID: ${deviceIds}, Sensor Type: ${sensorTypes}`}</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            fixed 
          />
          <View style={styles.row}>
            {chunk.map((col) => (
              <Text key={col} style={[styles.cell, styles.header]}>
                {col.replace(/_/g, " ").toUpperCase()}
              </Text>
            ))}
          </View>
          {data.map((row, idx) => (
            <View style={styles.row} key={idx}>
              {chunk.map((col) => (
                <Text key={col} style={styles.cell}>
                  {row[col]?.toString() ?? "N/A"}
                </Text>
              ))}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export const Export = ({ data, allColumns, filters }) => {
  const [openChoiceDialog, setOpenChoiceDialog] = useState(false);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const [exportType, setExportType] = useState(null); // "csv" or "pdf"
  const [dateRange, setDateRange] = useState(filters?.dateRange || [null, null]);
  const [progress, setProgress] = useState(0);
  const [exportData, setExportData] = useState(null); // Store fetched data for CSV or PDF
  const [error, setError] = useState(null);
  const csvLinkRef = useRef(null);
  const pdfLinkRef = useRef(null);
  const animationRef = useRef(null);
  const startTimePickerRef = useRef(null);

  const handleOpenChoiceDialog = () => {
    setOpenChoiceDialog(true);
    setError(null);
  };

  const handleChooseExport = (type) => {
    setExportType(type);
    setOpenChoiceDialog(false);
    if (!filters?.dataType) {
      setError("Please apply filters with a valid Data Type before exporting.");
      setOpenProgressDialog(true);
      return;
    }
    setDateRange(filters?.dateRange || [null, null]);
    setOpenDateDialog(true);
  };

  const validateDateRange = ([start, end], type) => {
    if (!start || !start.isValid() || !end || !end.isValid()) return false;
    const diff = dayjs(end).diff(start, type === "csv" ? "day" : "hour", true);
    if (type === "csv") {
      return diff > 0 && diff <= 6; // Within 7 days for CSV
    } else {
      return diff > 0 && diff <= 1; // Within 1 hour for PDF
    }
  };

  const handleStartDateChange = (newStart, type) => {
    if (newStart && newStart.isValid()) {
      const maxUnit = type === "csv" ? "day" : "hour";
      const maxValue = type === "csv" ? 6 : 1;
      const newEnd = dayjs(newStart).add(maxValue, maxUnit);
      setDateRange([newStart, newEnd]);
    } else {
      setDateRange([null, null]);
    }
    setError(null);
  };

  const handleEndDateChange = (newEnd) => {
    if (newEnd && newEnd.isValid()) {
      setDateRange([dateRange[0], newEnd]);
    } else {
      setDateRange([dateRange[0], null]);
    }
    setError(null);
  };

  const updateProgress = (startTime, targetProgress, duration) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const newProgress = fraction * (targetProgress - progress) + progress;
      setProgress(Math.min(newProgress, targetProgress));

      if (fraction < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleDateRangeSubmit = async () => {
    if (!validateDateRange(dateRange, exportType)) {
      setError(`Please select a valid date range within ${exportType === "csv" ? "seven days" : "one hour"}.`);
      setOpenDateDialog(false);
      setOpenProgressDialog(true);
      return;
    }

    if (!filters?.dataType) {
      setError("Data Type is required for export.");
      setOpenDateDialog(false);
      setOpenProgressDialog(true);
      return;
    }

    setOpenDateDialog(false);
    setOpenProgressDialog(true);
    setProgress(0);
    setError(null);

    try {
      const exportFilters = {
        dataType: filters.dataType,
        deviceId: filters.deviceId || null,
        sensorType: filters.sensorType || null,
        sensorNames: filters.sensorNames || [],
        sensorLocation: filters.sensorLocation || [],
        dateRange,
      };
      console.log(`${exportType.toUpperCase()} Export Filters:`, exportFilters);

      const fetchStartTime = performance.now();
      updateProgress(fetchStartTime, 50, 1000);

      const fetchedData = await getSensorEventHistory(exportFilters);
      if (!Array.isArray(fetchedData)) {
        throw new Error("Fetched data is not an array");
      }
      setExportData(fetchedData);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setProgress(50);
    } catch (err) {
      const errorMessage = err.message === "Network Error"
        ? `Failed to connect to the server. Please check your network or try again.`
        : `Failed to fetch data for ${exportType.toUpperCase()} export: ${err.message}`;
      setError(errorMessage);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setProgress(0);
    }
  };

  const handleRetry = () => {
    setError(null);
    setProgress(0);
    handleDateRangeSubmit();
  };

  const handleCancel = () => {
    setOpenProgressDialog(false);
    setError(null);
    setExportType(null);
    setExportData(null);
    setProgress(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (openProgressDialog && exportData && !error) {
      const processStartTime = performance.now();
      const baseProcessingTime = exportType === "csv" ? 500 : 1000;
      const perRowTime = exportType === "csv" ? 5 : 20;
      const estimatedProcessingTime = baseProcessingTime + exportData.length * perRowTime;

      updateProgress(processStartTime, 100, estimatedProcessingTime);

      const processData = async () => {
        try {
          if (exportType === "csv" && csvLinkRef.current?.link) {
            csvLinkRef.current.link.click();
            setProgress(100);
          } else if (exportType === "pdf" && pdfLinkRef.current) {
            const blob = await pdf(<HistoryPDF data={exportData} allColumns={allColumns} filters={filters} />).toBlob();
            const url = URL.createObjectURL(blob);
            pdfLinkRef.current.href = url;
            pdfLinkRef.current.download = "sensor-event-history.pdf";
            pdfLinkRef.current.click();
            URL.revokeObjectURL(url);
            setProgress(100);
          }

          setTimeout(() => {
            setOpenProgressDialog(false);
            setExportType(null);
            setExportData(null);
            setProgress(0);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
            }
          }, 500);
        } catch (err) {
          const errorMessage = err.message === "Network Error"
            ? `Failed to download. Please check your network or try again.`
            : `Failed to generate ${exportType.toUpperCase()}: ${err.message}`;
          setError(errorMessage);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          setProgress(0);
        }
      };

      processData();
    }
  }, [openProgressDialog, exportType, exportData, allColumns, error]);

  useEffect(() => {
    if (openDateDialog && startTimePickerRef.current) {
      // Focus the start time picker when dialog opens
      startTimePickerRef.current.focus();
    }
  }, [openDateDialog]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{pulseKeyframes}</style>
      <style>{smoothFillKeyframes}</style>
      <Button variant="outlined" onClick={handleOpenChoiceDialog}>
        Export
      </Button>
      <Dialog
        open={openChoiceDialog}
        maxWidth="xs"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus // Prevent focus restoration issues
        BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      >
        <DialogTitle>Choose Export Format</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Please select an export format:</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleChooseExport("csv")}
            disabled={!filters?.dataType}
          >
            Export to CSV
          </Button>
          <Button
            onClick={() => handleChooseExport("pdf")}
            disabled={!filters?.dataType}
          >
            Export to PDF
          </Button>
          <Button onClick={() => setOpenChoiceDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={openDateDialog}
          maxWidth="sm"
          fullWidth
          disableEnforceFocus
          disableRestoreFocus // Prevent focus restoration issues
          BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
        >
          <DialogTitle>Select Date Range for {exportType === "csv" ? "CSV" : "PDF"} Export</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please select a start time and end time{exportType === "csv" ? " (7 days range)" : " (one hour)"}.
            </Typography>
            <DateTimePicker
              label="Start Time"
              value={dateRange[0]}
              onChange={(newStart) => handleStartDateChange(newStart, exportType)}
              disableFuture
              maxDateTime={dayjs().subtract(1, "day")}
              sx={{ mb: 2, width: "100%" }}
              inputRef={startTimePickerRef} // Ref for explicit focus
            />
            <DateTimePicker
              label="End Time"
              value={dateRange[1]}
              onChange={handleEndDateChange}
              disableFuture
              maxDateTime={dateRange[0] ? dayjs(dateRange[0]).add(exportType === "csv" ? 6 : 1, exportType === "csv" ? "day" : "hour") : dayjs().subtract(1, "day")}
              minDateTime={dateRange[0] || undefined}
              sx={{ width: "100%" }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDateDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleDateRangeSubmit}>
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
      <Dialog
        open={openProgressDialog}
        maxWidth="xs"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus // Prevent focus restoration issues
        BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      >
        <DialogTitle>Processing {exportType === "csv" ? "CSV" : "PDF"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {error ? "Export failed" : `Preparing your ${exportType === "csv" ? "CSV" : "PDF"} download...`}
          </Typography>
          <LinearProgress
            variant="buffer"
            value={progress}
            valueBuffer={progress + 10}
            sx={{
              "& .MuiLinearProgress-bar1Buffer": {
                backgroundColor: "#388e3c",
                animation: "pulse 1.5s infinite",
                transition: "transform 0.3s ease-in-out",
              },
              "& .MuiLinearProgress-bar2Buffer": {
                backgroundColor: "#a5d6a7",
              },
              mt: 2,
            }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          {error && (
            <Button variant="contained" onClick={handleRetry}>
              Retry
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <CSVLink
        data={Array.isArray(exportData) ? exportData : []}
        filename="sensor-event-history.csv"
        style={{ display: "none" }}
        ref={csvLinkRef}
      />
      {exportType === "pdf" && (
        <a ref={pdfLinkRef} style={{ display: "none" }} />
      )}
    </>
  );
};