import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  p {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const CancelButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #a71d2a;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
