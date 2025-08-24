import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

export const TitleBottom = styled.h2`
  margin-bottom: 32px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
`;

export const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
`;

export const Tr = styled.tr``;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  min-width: 320px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

export const TooltipError = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  background: #e74c3c;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 9999;
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
export const FormStyle = styled.div`
  background: #f1f1f1ff;
  padding: 3%;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  min-width: 400px;
  text-align: center;
  margin: 0 auto;
  input, select, option{
    width: 100%;
    text-align: center;
  }
`;