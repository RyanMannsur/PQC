import React, { useState, useEffect } from "react";
import * as C from "./styles";

const ImplantacaoList = ({ data, onChange }) => {
const [implantacoes, setImplantacoes] = useState({}); // Estado local para gerenciar os produtos adicionados

const handleAddItem = (codProduto) => {
  setImplantacoes((prev) => ({
    ...prev,
    [codProduto]: [
      ...(prev[codProduto] || []),
      { qtd: 0, validade: "" }, // Adiciona um novo item vazio
    ],
  }));
};

const handleRemoveItem = (codProduto, index) => {
  setImplantacoes((prev) => ({
    ...prev,
    [codProduto]: prev[codProduto].filter((_, i) => i !== index), // Remove o item pelo índice
  }));
};

const handleQuantityChange = (codProduto, index, value) => {
  setImplantacoes((prev) => ({
    ...prev,
    [codProduto]: prev[codProduto].map((item, i) =>
      i === index ? { ...item, qtd: value } : item
    ),
  }));
};

const handleValidityChange = (codProduto, index, value) => {
  setImplantacoes((prev) => ({
    ...prev,
    [codProduto]: prev[codProduto].map((item, i) =>
      i === index ? { ...item, validade: value } : item
    ),
  }));
};

// Chama a função `onChange` sempre que houver alterações
useEffect(() => {
  onChange(implantacoes);
}, [implantacoes, onChange]);

return (
  <C.Table>
    <thead>
      <tr>
        <C.Th>Produto</C.Th>
        <C.Th>Lista</C.Th>
        <C.Th>Pureza</C.Th>
        <C.Th>Densidade</C.Th>
        <C.Th>Ações</C.Th>
      </tr>
    </thead>
    <tbody>
      {data.map((produto) => (
        <React.Fragment key={produto[0]}>
          <C.ProductRow>
            <C.Td>{produto[1]}</C.Td> {/* Nome do produto */}
            <C.Td>{produto[2]}</C.Td> {/* Lista */}
            <C.Td>{produto[3]}</C.Td> {/* Pureza */}
            <C.Td>{produto[4]}</C.Td> {/* Densidade */}
            <C.Td>
              <C.Button onClick={() => handleAddItem(produto[0])}>
                +
              </C.Button>
            </C.Td>
          </C.ProductRow>

          {/* Sublista para itens adicionados */}
          {implantacoes[produto[0]]?.map((item, index) => (
            <C.ItemRow key={`${produto[0]}-${index}`}>
              <C.SublistTd colSpan={3}>
                <C.Input
                  type="number"
                  placeholder="Quantidade"
                  value={item.qtd}
                  onChange={(e) =>
                    handleQuantityChange(produto[0], index, e.target.value)
                  }
                />
              </C.SublistTd>
              <C.SublistTd>
                <C.Input
                  type="date"
                  placeholder="Validade"
                  value={item.validade}
                  onChange={(e) =>
                    handleValidityChange(produto[0], index, e.target.value)
                  }
                />
              </C.SublistTd>
              <C.SublistTd>
                <C.Button
                  onClick={() => handleRemoveItem(produto[0], index)}
                >
                  -
                </C.Button>
              </C.SublistTd>
            </C.ItemRow>
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </C.Table>
);
};

export default ImplantacaoList;