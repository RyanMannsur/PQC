import React from "react";
import * as C from "./styles";

const Select = ({
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
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "") {
      onChange(null);
      return;
    }
    
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    onChange(selectedOption);
  };

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
        onChange={handleChange}
        disabled={disabled}
        error={error}
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

export default Select;
