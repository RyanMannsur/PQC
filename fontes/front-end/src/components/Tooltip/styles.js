import styled from "styled-components";

export const TooltipContainer = styled.div`
position: fixed;
bottom: 20px;
right: 20px;
background-color: #333;
color: white;
padding: 10px 20px;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
display: flex;
align-items: center;
justify-content: space-between;
z-index: 1000;
animation: fadeIn 0.3s ease-in-out;

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export const TooltipMessage = styled.span`
font-size: 14px;
margin-right: 10px;
`;

export const CloseButton = styled.button`
background: none;
border: none;
font-size: 16px;
cursor: pointer;
color: white;

&:hover {
  color: #ff0000;
}
`;