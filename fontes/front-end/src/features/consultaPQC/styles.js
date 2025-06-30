import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

`;

export const Th = styled.th`
  padding: 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden
  text-overflow: ellipsis; 
`;

export const Td = styled.td`
  padding: 8px;
  vertical-align: top;
`;

export const ProductRow = styled.tr`
  background-color:rgb(102, 153, 204);
`;

export const CampusRow = styled.tr`
  background-color:rgb(153, 204, 255)
`;

export const ItemRow = styled.tr`
  background-color: rgb(204, 229, 255)
`;

export const MovRow = styled.tr`
  background-color: rgb(230, 242, 255)
  font-size: 14px;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;


