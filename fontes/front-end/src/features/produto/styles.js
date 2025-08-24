import styled from "styled-components";

export const ScrollArea = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

export const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;