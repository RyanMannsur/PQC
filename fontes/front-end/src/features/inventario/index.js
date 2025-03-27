import React from "react";
import * as C from "./styles";

const InventarioList = ({ data, onQuantityChange }) => {
return (
  <C.Table>
    <thead>
      <tr>
        <C.Th>Produto</C.Th>
        <C.Th>Pureza</C.Th>
        <C.Th>Densidade</C.Th>
        <C.Th>Validade</C.Th>
        <C.Th>Item</C.Th>
        <C.Th>Embalagem</C.Th>
        <C.Th>Quantidade Atual</C.Th>
        <C.Th>Nova Quantidade</C.Th>
      </tr>
    </thead>
    <tbody>
      {data.map((produto) => (
        <React.Fragment key={produto.codProduto}>
          {/* Renderiza os itens do produto */}
          {produto.itens.map((item, index) => (
            <tr key={`${produto.codProduto}-${item.seqItem}`}>
              {/* Renderiza as informações do produto apenas na primeira linha */}
              {index === 0 && (
                
                <>
                  <C.Td rowSpan={produto.itens.length}>{produto.nomProduto}</C.Td>
                  <C.Td rowSpan={produto.itens.length}>{produto.perPureza}</C.Td>
                  <C.Td rowSpan={produto.itens.length}>{produto.vlrDensidade}</C.Td>
                </>
              )}
              {/* Renderiza as informações do item */}
              <C.Td>{item.datValidade}</C.Td>
              <C.Td>{item.seqItem}</C.Td>
              <C.Td>{item.nomEmbalagem}</C.Td>
              <C.Td>{item.qtdAtual}</C.Td>
              <C.Td>
                <C.Input
                  type="number"
                  defaultValue={item.qtdNova}
                  onChange={(e) =>
                    onQuantityChange(produto.codProduto, item.seqItem, e.target.value)
                  }
                />
              </C.Td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </C.Table>
);
};

export default InventarioList;