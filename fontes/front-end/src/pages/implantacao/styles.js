import styled from "styled-components";

export const Container = styled.div`
max-width: 1200px;
margin: 0 auto;
padding: 20px;
`;

export const Title = styled.h1`
font-size: 24px;
font-weight: bold;
color: #333;
margin-bottom: 20px;
`;

export const Loading = styled.div`
font-size: 18px;
color: #666;
text-align: center;
margin-top: 50px;
`;

export const ConfirmButton = styled.button`
background-color: #28a745;
color: white;
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 16px;
margin-top: 20px;
transition: background 0.3s;

&:hover {
  background-color: #218838;
}
`;
