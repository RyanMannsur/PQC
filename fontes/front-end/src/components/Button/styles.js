import styled, { css } from 'styled-components';

const sizes = {
  small: css`
    padding: 8px 16px;
    font-size: 14px;
    min-height: 36px;
  `,
  medium: css`
    padding: 12px 20px;
    font-size: 16px;
    min-height: 44px;
  `,
  large: css`
    padding: 16px 24px;
    font-size: 18px;
    min-height: 52px;
  `,
};

const variants = {
  primary: css`
    background-color: #046ee5;
    color: white;
    border: 1px solid #046ee5;
    
    &:hover:not(:disabled) {
      background-color: #0357b4;
      border-color: #0357b4;
    }
  `,
  secondary: css`
    background-color: #6c757d;
    color: white;
    border: 1px solid #6c757d;
    
    &:hover:not(:disabled) {
      background-color: #5a6268;
      border-color: #5a6268;
    }
  `,
  success: css`
    background-color: #28a745;
    color: white;
    border: 1px solid #28a745;
    
    &:hover:not(:disabled) {
      background-color: #218838;
      border-color: #218838;
    }
  `,
  danger: css`
    background-color: #dc3545;
    color: white;
    border: 1px solid #dc3545;
    
    &:hover:not(:disabled) {
      background-color: #c82333;
      border-color: #c82333;
    }
  `,
  warning: css`
    background-color: #ffc107;
    color: #212529;
    border: 1px solid #ffc107;
    
    &:hover:not(:disabled) {
      background-color: #e0a800;
      border-color: #e0a800;
    }
  `,
  outline: css`
    background-color: transparent;
    color: #046ee5;
    border: 1px solid #046ee5;
    
    &:hover:not(:disabled) {
      background-color: #046ee5;
      color: white;
    }
  `,
};

export const Button = styled.button`
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-sizing: border-box;
  min-width: 100px;
  
  ${({ size }) => sizes[size]}
  ${({ variant }) => variants[variant]}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
    max-width: 350px;
  `}
  
  ${({ disabled }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  &:focus {
    outline: 2px solid rgba(4, 110, 229, 0.3);
    outline-offset: 2px;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;
