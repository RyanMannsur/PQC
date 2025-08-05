import React from "react";
import * as C from "./styles";

const InputSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Selecione uma opção",
  disabled = false,
  error = false,
  label,
  required = false,
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
      <C.Select 
        value={value || ""} 
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        $error={error}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </C.Select>
    </C.Container>
  );
};

export default InputSelect;
