import { HvButton, HvDialog, HvDialogActions, HvDialogContent, HvDialogTitle } from "@hitachivantara/uikit-react-core";
import DetectorParams from "../components/DetectorParams";

const WriteConfigurationModal = ({ open, onClose, deviceId,location,sensor}) => (
  <HvDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <HvDialogTitle>Write Configuration</HvDialogTitle>
    <HvDialogContent>
      <p>You're configuring device: <strong>{deviceId}</strong></p>
       <p>Location: <strong>{location}</strong></p>
       <p>Sensor: <strong>{sensor}</strong></p>
        <DetectorParams sensor={sensor}/>
    </HvDialogContent>
    <HvDialogActions>
      <HvButton onClick={onClose} variant="secondaryGhost">Cancel</HvButton>
      <HvButton onClick={() => { console.log("Writing config for", deviceId); onClose(); }} variant="primary">
        Set Parameters
      </HvButton>
    </HvDialogActions>
  </HvDialog>
);

export default WriteConfigurationModal;