import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

export const Th = styled.th`
  background: #f5f5f5;
  padding: 8px;
  border: 1px solid #ddd;
  font-weight: bold;
`;

export const Td = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

export const Tr = styled.tr``;

export const Button = styled.button`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
`;
