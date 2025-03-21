import { HvCard, HvCardHeader, HvCardContent, HvButton } from "@hitachivantara/uikit-react-core";
import { Modal, Box, Typography } from "@mui/material";
import biometrics from "../assets/biometrics.png";

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          
        }}
      >
        <HvCard bgcolor="white" style={{ borderRadius: "0px", height: "100%" }}>
          <HvCardHeader title="Switch to Supervisor Dashboard" />
          <HvCardContent>
            <Typography>
              Kindly provide your identity by scanning your finger vein.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <img src={biometrics} alt="finger scan" width="80" height="80" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <HvButton variant="primary" onClick={onConfirm}>Scan</HvButton>
              <HvButton variant="secondaryGhost" onClick={onClose}>Cancel</HvButton>
            </Box>
          </HvCardContent>
        </HvCard>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
