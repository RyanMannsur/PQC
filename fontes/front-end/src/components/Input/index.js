import React from "react";
import * as C from "./styles";

const Input = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  label,
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  size = "medium",
  ...props 
}) => {
  return (
    <C.Container>
      {label && (
        <C.Label>
          {label}
          {required && <C.RequiredMark>*</C.RequiredMark>}
        </C.Label>
      )}
      <C.Input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        size={size}
        {...props}
      />
      {error && errorMessage && (
        <C.ErrorMessage>{errorMessage}</C.ErrorMessage>
      )}
    </C.Container>
  );
};

export default Input;
