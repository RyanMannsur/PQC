import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  gap: 4px;

  label {
    font-weight: 500;
    margin-bottom: 2px;
  }

  input {
    width: 33%;
    min-width: 180px;
    max-width: 400px;
    box-sizing: border-box;
  }
`;
