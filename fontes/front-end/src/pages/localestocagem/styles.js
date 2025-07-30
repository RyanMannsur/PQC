import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
`;

export const TitleBottom = styled.h1`
  font-size: 2rem;
  margin-bottom: 24px;
  color: #2c3e50;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

export const Th = styled.th`
  background: #f5f5f5;
  padding: 10px;
  border: 1px solid #ddd;
  font-weight: bold;
`;

export const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
`;

export const Tr = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
`;
