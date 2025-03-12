import * as C from "./styles";

const Select = ({
  options,
  value,
  onChange,
  placeholder = "Selecione a opção",
}) => {
  const handleChange = (e) => {
    const selectedOption = options.find(
      (option) => option.value === e.target.value
    );
    onChange(selectedOption);
  };

  return (
    <C.Select value={value} onChange={handleChange}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value} object={option}>
          {option.label}
        </option>
      ))}
    </C.Select>
  );
};

export default Select;
