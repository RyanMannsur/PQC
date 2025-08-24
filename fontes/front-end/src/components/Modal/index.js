import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const Modal = ({ open, onClose, title, message, onConfirm, confirmDisabled, confirmContent }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={confirmDisabled}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" disabled={confirmDisabled}>
          {confirmContent || "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
