import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const Th = styled.th`
  background-color: #f0f0f0;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

export const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

export const ActionMenu = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 10;
`;

export const ActionItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;
