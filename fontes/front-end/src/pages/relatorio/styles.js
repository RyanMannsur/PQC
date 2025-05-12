import styled from "styled-components";

export const Container = styled.div`
display: flex;
flex-direction: column;
margin: 0 auto;
padding: 20px;
max-width: 800px;

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

export const FiltersContainer = styled.div`
display: flex;
align-items: flex-end;
gap: 15px; 
margin-bottom: 20px;

@media (max-width: 768px) {
  flex-direction: column;
  align-items: stretch;
}
`;

export const InputGroup = styled.div`
display: flex;
flex-direction: column;
flex: 1;
`;

export const Input = styled.input`
outline: none;
padding: 10px 15px; 
width: 100%;
border-radius: 5px;
font-size: 14px; 
background-color: #ffffff; 
border: 1px solid #ccc;
transition: border-color 0.3s;

&:focus {
  border-color: #046ee5;
}
`;

export const Label = styled.label`
margin-bottom: 5px; 
font-size: 13px; 
color: #333;
`;

export const Button = styled.button`
padding: 10px 15px; 
outline: none;
border: none;
border-radius: 5px;
cursor: pointer;
background-color: #046ee5;
color: white;
font-weight: 600;
font-size: 14px; 
max-width: 120px; 
transition: background-color 0.3s, transform 0.2s;

&:hover {
  background-color: #0357b4;
  transform: scale(1.05);
}
`;