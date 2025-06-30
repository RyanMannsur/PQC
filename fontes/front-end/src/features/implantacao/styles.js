import styled from "styled-components";

export const Table = styled.table`
width: 100%;
border-collapse: collapse;
margin-top: 20px;

th,
td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
`;


export const Button = styled.button`
  display: block; 
  margin-left: auto;
  margin-right: auto;
  color: white;
  padding: 8px 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Input = styled.input`
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 5px;
font-size: 16px;
`;

export const Td = styled.td`
padding: 12px;
border: 1px solid #ddd;
`;

export const Th = styled.th`
padding: 12px;
border: 1px solid #ddd;
background-color: #f4f4f4;
font-weight: bold;
`;

export const ProductRow = styled.tr`
background-color: #e8f4fc; 
font-weight: bold;

&:hover {
  background-color: #d0e8f2; 
}
`;

export const ItemRow = styled.tr`
background-color: #ffffff;
font-size: 14px;

&:nth-child(even) {
  background-color: #f9f9f9;
}

&:hover {
  background-color: #f1f1f1;
}
`;

export const SublistTd = styled.td`
padding: 12px;
border: 1px solid #ddd;
text-align: left;
background-color: #f9f9f9; 
`;
