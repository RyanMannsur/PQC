import styled from "styled-components";

export const Overlay = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
`;

export const Container = styled.div`
background-color: white;
padding: 20px;
border-radius: 5px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
max-width: 500px;
`;

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