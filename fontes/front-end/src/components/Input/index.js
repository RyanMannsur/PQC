import React from "react";
import * as C from "./styles";

const Input = ({ type, placeholder, value, onChange, label }) => {
  return (
    <C.Container>
      {label && <C.Label>{label}</C.Label>}
      <C.Input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
      />
    </C.Container>
  );
};

export default Input;
