import { HvButton, HvDialog, HvDialogActions, HvDialogContent, HvDialogTitle } from "@hitachivantara/uikit-react-core";


const ImageModal= ({ open, onClose}) => (
  <HvDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <HvDialogTitle>Write Configuration</HvDialogTitle>
    <HvDialogContent>
      
    </HvDialogContent>
    <HvDialogActions>
      <HvButton onClick={onClose} variant="secondaryGhost">Cancel</HvButton>
      <HvButton onClick={() => { onClose(); }} variant="primary">
        Set Parameters
      </HvButton>
    </HvDialogActions>
  </HvDialog>
);

export default ImageModal;