import React from "react";
import * as C from "./styles";

const Modal = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <C.Overlay>
      <C.ModalContainer>
        <C.ModalHeader>
          <h2>{title}</h2>
          <C.CloseButton onClick={onClose}>&times;</C.CloseButton>
        </C.ModalHeader>
        <C.ModalContent>{children}</C.ModalContent>
        <C.ModalFooter>
          <C.Button onClick={onClose}>OK</C.Button>
        </C.ModalFooter>
      </C.ModalContainer>
    </C.Overlay>
  );
};

export default Modal;
