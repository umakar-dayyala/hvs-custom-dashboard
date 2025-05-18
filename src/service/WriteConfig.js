/* Thin wrapper around your bridge endpoint */
import axios from "axios";

export const sendParams = (cmd) =>
  axios.post("/api/mqtt/send", cmd);
