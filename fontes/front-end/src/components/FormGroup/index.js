import * as C from "./styles";

const FormGroup = ({ 
  children, 
  direction = "column", 
  $gap = "medium",
  $alignItems = "stretch",
  $justifyContent = "flex-start",
  ...props 
}) => {
  return (
    <C.FormGroup 
      direction={direction} 
      $gap={$gap}
      $alignItems={$alignItems}
      $justifyContent={$justifyContent}
      {...props}
    >
      {children}
    </C.FormGroup>
  );
};

export default FormGroup;
