import * as C from "./styles";

const Select = ({
  options,
  value,
  onChange,
  placeholder = "Selecione a opção",
}) => {
  return (
    <C.Select value={value} onChange={onChange}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </C.Select>
  );
};

export default Select;
