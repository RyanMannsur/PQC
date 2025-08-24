import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px 16px 32px 16px;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f5f6fa;
`;

export const TitleBottom = styled.h2`
  margin-bottom: 24px;
  font-size: 1.6rem;
  color: #333;
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
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  min-width: 320px;
  text-align: center;
`;

export const TooltipError = styled.div`
  background: #ffdddd;
  color: #a00;
  padding: 12px 20px;
  border-radius: 6px;
  margin-top: 16px;
  font-weight: bold;
  text-align: center;
`;

