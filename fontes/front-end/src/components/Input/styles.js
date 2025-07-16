import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

export const RequiredMark = styled.span`
  color: #dc3545;
  margin-left: 2px;
`;

export const ErrorMessage = styled.span`
  font-size: 12px;
  color: #dc3545;
  margin-top: 2px;
`;

const sizes = {
  small: css`
    padding: 8px 12px;
    font-size: 14px;
    min-height: 32px;
  `,
  medium: css`
    padding: 12px 16px;
    font-size: 16px;
    min-height: 40px;
  `,
  large: css`
    padding: 16px 20px;
    font-size: 18px;
    min-height: 48px;
  `,
};

export const Input = styled.input`
  outline: none;
  width: 100%;
  border-radius: 5px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  
  ${({ size }) => sizes[size]}

  &:focus {
    border-color: #046ee5;
    box-shadow: 0 0 0 2px rgba(4, 110, 229, 0.2);
    background-color: white;
  }

  &:hover:not(:disabled) {
    border-color: #adb5bd;
  }

  &::placeholder {
    color: #6c757d;
  }

  ${({ error }) => error && css`
    border-color: #dc3545;
    
    &:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
    }
  `}

  ${({ disabled }) => disabled && css`
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  `}
`;
