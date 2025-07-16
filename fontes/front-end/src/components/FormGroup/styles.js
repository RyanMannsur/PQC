import styled, { css } from "styled-components";

const gaps = {
  small: "8px",
  medium: "16px",
  large: "24px",
  none: "0px"
};

export const FormGroup = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: ${({ gap }) => gaps[gap]};
  align-items: ${({ alignItems }) => alignItems};
  justify-content: ${({ justifyContent }) => justifyContent};
  width: 100%;
  
  ${({ direction }) => direction === "row" && css`
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `}
`;
