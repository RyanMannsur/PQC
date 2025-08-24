  import React from "react";
  import { Input } from "../../components";
  import * as C from "./styles";

  const TransferenciaList = ({ data, onQuantityChange }) => {
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
          <C.Th>Qtde Estoque</C.Th>
          <C.Th>Qtde a Transferir</C.Th>
        </tr>
      </thead>
      <tbody>
        {data.map((produto) => (
          <React.Fragment key={produto.codProduto}>
            {produto.itens.map((item, index) => (
              <tr key={`${produto.codProduto}-${item.seqItem}`}>
                {index === 0 && (
                  <>
                    <C.Td rowSpan={produto.itens.length}>{produto.nomProduto}</C.Td>
                    <C.Td rowSpan={produto.itens.length}>{produto.perPureza}</C.Td>
                    <C.Td rowSpan={produto.itens.length}>{produto.vlrDensidade}</C.Td>
                  </>
                )}
                <C.Td>{item.datValidade}</C.Td>
                <C.Td>{item.seqItem}</C.Td>
                <C.Td>{item.codEmbalagem}</C.Td>
                <C.Td>{item.qtdAtual}</C.Td>
                <C.Td>
                  <Input
                    type="number"
                    value={item.qtdTransferir}
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

  export default TransferenciaList;