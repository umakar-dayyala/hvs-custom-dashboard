// FloatingNotificationButton.jsx
import React, { useState } from "react";
import { Fab, Drawer } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationPanel from "./NotificationPanel";

const FloatingNotificationButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1300 }}
        onClick={() => setOpen(true)}
      >
        <NotificationsIcon />
      </Fab>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: 1200 }}
      >
        <NotificationPanel onClose={() => setOpen(false)} />
      </Drawer>
    </>
  );
};

export default FloatingNotificationButton;
