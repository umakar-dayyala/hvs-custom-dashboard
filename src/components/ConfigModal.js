import React, { useRef } from "react";
import {
  HvButton,
  HvDialog, HvDialogTitle,
  HvDialogContent, HvDialogActions
} from "@hitachivantara/uikit-react-core";

import DetectorParams from "../components/DetectorParams";
import { sendParams } from "../service/ConfigurationPageService";

const WriteConfigurationModal = ({
  open, onClose, deviceId, location, sensor,ip,sensor_port,static_type_flag
}) => {
  const detectorRef = useRef();

  const handleSet = async () => {
    /* 1. Get { id: newValue } */
    const data = detectorRef.current.getPayload();

    /* 2. Build (but DO NOT post) the command */
    const cmd = {
      type: 2,
      device_id: deviceId,
      ip_address: ip || "10.42.12.34",
      port: sensor_port ,
      transaction_id: Date.now().toString(),
      data
    };

    try {
      await sendParams(cmd);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to set parameters");
    }
  };

  return (
    <HvDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <HvDialogTitle>Write Configuration</HvDialogTitle>

      <HvDialogContent>
        <p>Device: <strong>{deviceId}</strong></p>
        <p>Location: <strong>{location}</strong></p>
        <p>Sensor: <strong>{sensor?.name || sensor}</strong></p>

        <DetectorParams ref={detectorRef} />
      </HvDialogContent>

      <HvDialogActions>
        <HvButton onClick={onClose} variant="secondaryGhost">Cancel</HvButton>
        <HvButton onClick={handleSet} variant="primary">Set Parameters</HvButton>
      </HvDialogActions>
    </HvDialog>
  );
};

export default WriteConfigurationModal;
