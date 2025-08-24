import React from "react";
import { Tooltip, IconButton } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const TooltipError = ({ open, message }) => {
  if (!open) return null;

  return (
    <Tooltip title={message} open arrow>
      <IconButton color="error">
        <ErrorIcon />
      </IconButton>
    </Tooltip>
  );
};

export default TooltipError;
