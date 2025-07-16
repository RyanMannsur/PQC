import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
`;

export const Th = styled.th`
  padding: 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: #1a1a1a;
  background-color: #f8f9fa;
`;

export const Td = styled.td`
  padding: 8px;
  vertical-align: top;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
`;

export const ProductRow = styled.tr`
  background-color: #4a90e2;
  color: white;
  font-weight: 500;
`;

export const CampusRow = styled.tr`
  background-color: #add8e6;
  color: #2d3748;
`;

export const ItemRow = styled.tr`
  background-color: #d4edda;
  color: #2d3748;
`;

export const MovRow = styled.tr`
  background-color: #f8f9fa;
  font-size: 14px;
  color: #4a5568;
`;


