import styled from "styled-components";

export const Button = styled.button`
  padding: 16px 20px;
  outline: none;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  background-color: #046ee5;
  color: white;
  font-weight: 600;
  font-size: 16px;
  max-width: 350px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0357b4;
    transform: scale(1.05);
  }
`;
