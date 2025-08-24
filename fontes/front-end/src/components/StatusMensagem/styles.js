
import styled from 'styled-components';

export const MessageWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);

  /* 🔼 Para ficar acima de Dialog/Modal do MUI (1300) e alinhado com Snackbar (1400) */
  z-index: 1500;

  /* Evita que algum container com transform/filters crie stacking context estranho */
  pointer-events: auto;
`;
