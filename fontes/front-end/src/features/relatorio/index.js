import React, { useState } from "react";
import * as C from "./styles";
import { formatarData } from "../../helpers/dataHelper";
import { tipoMovtoMap } from "../../services/produto/types";

const RelatorioProdutos = ({ data }) => {
const [produtosVisiveis, setProdutosVisiveis] = useState({}); 

const toggleMovimentacoes = (codProduto) => {
  setProdutosVisiveis((prevState) => ({
    ...prevState,
    [codProduto]: !prevState[codProduto], 
  }));
};

return (
  <C.Table>
    <thead>
      <tr>
        <C.Th>Produto</C.Th>
        <C.Th>Quantidade Geral Atual</C.Th>
        <C.Th>Ações</C.Th>
      </tr>
    </thead>
    <tbody>
      {data.map((produto) => (
        <React.Fragment key={produto.produto.codProduto}>
          <C.ProductRow>
            <C.Td>{produto.produto.nomProduto}</C.Td>
            <C.Td>{produto.qtdGeralAtual}</C.Td>
            <C.Td>
              <C.Button onClick={() => toggleMovimentacoes(produto.produto.codProduto)}>
                {produtosVisiveis[produto.produto.codProduto]
                  ? "Esconder Movimentações"
                  : "Mostrar Movimentações"}
              </C.Button>
            </C.Td>
          </C.ProductRow>

          {produtosVisiveis[produto.produto.codProduto] && (
            <>
              <C.SublistHeader>
                <C.SublistTh>Código do Item</C.SublistTh>
                <C.SublistTh>Tipo de Movimentação</C.SublistTh>
                <C.SublistTh>Data</C.SublistTh>
                <C.SublistTh>Quantidade</C.SublistTh>
                <C.SublistTh>Laboratório</C.SublistTh>
              </C.SublistHeader>

              {produto.movimentacoes.map((movto, index) => (
                <C.ItemRow key={`${produto.produto.codProduto}-${index}`}>
                  <C.SublistTd>{movto.seqItem}</C.SublistTd>
                  <C.SublistTd>{tipoMovtoMap[movto.idtTipoMovto]}</C.SublistTd>
                  <C.SublistTd>{formatarData(movto.datMovto)}</C.SublistTd>
                  <C.SublistTd>{movto.qtdEstoque}</C.SublistTd>
                  <C.SublistTd>{movto.nomLocal}</C.SublistTd>
                </C.ItemRow>
              ))}
            </>
          )}
        </React.Fragment>
      ))}
    </tbody>
  </C.Table>
);
};

export default RelatorioProdutos;