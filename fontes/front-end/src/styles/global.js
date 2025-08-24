import { createGlobalStyle, styled } from "styled-components";

const GlobalStyle = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    background-color: #f0f2f5;
    font-family: Arial, Helvetica, sans-serif;
    /* Removido overflow-y: hidden para permitir scroll */
  }
`;
export const FormStyle = styled.div`
  background: #f1f1f1ff;
  padding: 3%;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  max-width: 400px;
  text-align: center;
  margin: 0 auto;
  input, select, option{
    width: 100%;
    text-align: center;
  }
`;
export default GlobalStyle;
