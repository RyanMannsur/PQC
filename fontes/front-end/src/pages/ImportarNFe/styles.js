import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 20px;
  line-height: 1.2;
`;

export const Loading = styled.div`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end; /* Opcional: alinha os botões à direita */
`;