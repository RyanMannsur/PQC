import React from "react";
import * as C from "./styles";

const Button = ({ 
  children, 
  Text, // Mantém compatibilidade com a prop Text antiga
  onClick, 
  type = "button", 
    $variant = "primary", 
  size = "medium", 
  disabled = false,
  loading = false,
    $fullWidth = false,
  ...props 
}) => {
  // Usa Text se fornecido, senão usa children
  const buttonText = Text || children;
  
  return (
    <C.Button 
      type={type} 
      onClick={onClick}
        $variant={$variant}
      size={size}
      disabled={disabled || loading}
        $fullWidth={$fullWidth}
      {...props}
    >
      {loading ? "Carregando..." : buttonText}
    </C.Button>
  );
};

export default Button;
