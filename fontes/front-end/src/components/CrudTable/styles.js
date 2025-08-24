// src/components/CrudTable/styles.js
import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  background: #f5f5f5;
  padding: 8px;
  border: 1px solid #ddd;
`;

export const Td = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

export const Tr = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
  }

  p {
    margin-bottom: 20px;
  }

  div {
    display: flex;
    justify-content: space-around;
  }
`;