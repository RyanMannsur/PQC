import styled from "styled-components";

export const Container = styled.div`
width: 100%;
max-width: 1200px;
margin: 0 auto;
padding: 20px;

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

p {
  text-align: center;
  font-size: 16px;
  color: #666;
}
`;

export const ButtonContainer = styled.div`
display: flex;
justify-content: center;
margin-top: 20px;
`;

export const ButtonGroup = styled.div`
display: flex;
justify-content: center;
gap: 10px;
margin-top: 30px;
`;