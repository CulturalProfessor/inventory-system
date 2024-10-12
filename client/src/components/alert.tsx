import { forwardRef } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const CustomAlert = forwardRef<HTMLDivElement, AlertProps>(function CustomAlert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default CustomAlert;
