import { CheckboxContainer, CheckboxInput, CheckboxLabel } from './styles';

const Checkbox = ({ 
  id, 
  name, 
  checked, 
  onChange, 
  label, 
  disabled = false,
  ...props 
}) => {
  return (
    <CheckboxContainer>
      <CheckboxInput
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && (
        <CheckboxLabel htmlFor={id} disabled={disabled}>
          {label}
        </CheckboxLabel>
      )}
    </CheckboxContainer>
  );
};

export default Checkbox;