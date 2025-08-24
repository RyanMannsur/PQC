import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ModalMessage = ({ open, title, message, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 300,
          textAlign: "center"
        }}
      >
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>
        <Button variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalMessage;
