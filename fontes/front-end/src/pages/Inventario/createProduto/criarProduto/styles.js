import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Content = styled.div`
  gap: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  box-shadow: 0 1px 2px #0003;
  background-color: white;
  max-width: 600px; /* Aumentando a largura do container */
  padding: 20px;
  border-radius: 5px;
`;

export const Row = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
`;

export const labelError = styled.label`
  font-size: 14px;
  color: red;
`;

export const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
  margin-top: 10px; /* Adicionando margem ao campo "Motivo" */
  color: #333;
`;