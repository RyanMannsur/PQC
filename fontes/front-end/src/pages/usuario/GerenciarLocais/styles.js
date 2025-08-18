import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px 24px 24px 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Tr = styled.tr``;

export const Th = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
`;

export const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
`;

export const TitleBottom = styled.h2`
  margin-bottom: 32px;
`;

export const TitleTop = styled.h2`
  margin-top: 40px;
`;

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

export const Wrapper = styled(Container)``;
export const Message = styled.div`
  margin-bottom: 8px;
  color: ${props => props.success ? 'green' : 'red'};
`;
export const TopBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 24px;
  margin-top: 32px;
`;
