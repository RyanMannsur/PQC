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

export const Select = styled.select`
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 5px;
font-size: 16px;
background-color: white;
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
background-color: #e8f4fc; /* Destaque para linha principal do produto */
font-weight: bold;

&:hover {
  background-color: #d0e8f2; /* Alteração de cor ao passar o mouse */
}
`;

export const ItemRow = styled.tr`
background-color: #ffffff; /* Fundo branco para sublinhas */
font-size: 14px; /* Tamanho menor para itens */

&:nth-child(even) {
  background-color: #f9f9f9; /* Alternância de cores */
}

&:hover {
  background-color: #f1f1f1; /* Alteração de cor ao passar o mouse */
}
`;

export const SublistTd = styled.td`
padding: 12px;
border: 1px solid #ddd;
text-align: left;
background-color: #f9f9f9; /* Fundo mais claro para sublinhas */
`;