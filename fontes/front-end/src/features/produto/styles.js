import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Input = styled.input`
  padding: 6px;
  width: 100%;
`;

export const Checkbox = styled.input`
  margin-left: 10px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  background-color: #4CAF50;
  border: none;
  color: white;
  cursor: pointer;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
`;
