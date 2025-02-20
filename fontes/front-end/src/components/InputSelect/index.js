import * as C from "./styles";

const Select = ({ options, value, onChange }) => {
  return (
    <C.Select value={value} onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </C.Select>
  );
};

export default Select;
