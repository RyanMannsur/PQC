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

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

export const TooltipError = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #e74c3c;
  color: #fff;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: bold;
  z-index: 10000;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;
