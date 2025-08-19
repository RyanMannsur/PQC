import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: #f7f8fa;
`;

export const FormFull = styled.div`
  width: 100%;
  max-width: 900px;
  min-height: 220px;
  background: #f7f8fa;
  margin: 20px auto 0 auto;
  padding: 18px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px #0001;
  border-radius: 8px;
  gap: 8px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-bottom: 6px;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 8px;
`;

export const Label = styled.label`
  font-size: 1rem;
  color: #222;
`;

export const InputQtd = styled.input`
  margin-left: 8px;
  width: 100px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const labelError = styled.label`
  font-size: 14px;
  color: red;
`;


export const Title = styled.h1`
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #222;
`;

export const Subtitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #007bff;
`;

export const TableWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto 24px auto;
`;

export const NoData = styled.p`
  color: #888;
  text-align: center;
  font-size: 1.1rem;
`;