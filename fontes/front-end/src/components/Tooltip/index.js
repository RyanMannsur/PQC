import React, { useEffect } from "react";
import * as C from "./styles";

const Tooltip = ({ message, isVisible, onClose, duration = 3000 }) => {
useEffect(() => {
  if (isVisible) {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); 
  }
}, [isVisible, onClose, duration]);

if (!isVisible) return null;

return (
  <C.TooltipContainer>
    <C.TooltipMessage>{message}</C.TooltipMessage>
    <C.CloseButton onClick={onClose}>&times;</C.CloseButton>
  </C.TooltipContainer>
);
};

export default Tooltip;