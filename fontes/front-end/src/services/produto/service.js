import produtosByLab from "./produtosByLab.json";
import pacotesByProdutos from "./pacotesByProduto.json";

export const getProdutosByLabId = (idLab) => {
  const produtosFiltrados = produtosByLab
    .filter((lab) => Number(lab.idLab) === Number(idLab))
    .flatMap((lab) => lab.produtos)
    .filter((produto) => produto.quantidadeAtual > 0);

  return Array.isArray(produtosFiltrados) ? produtosFiltrados : [];
};

export const getProdutosByLabIdAndCodProduto = (idLab, codProduto) => {
  const produtosFiltrados = produtosByLab
    .filter((lab) => Number(lab.idLab) === Number(idLab))
    .flatMap((lab) => lab.produtos)
    .filter(
      (produto) =>
        produto.quantidadeAtual > 0 &&
        Number(produto.codProduto) === Number(codProduto)
    );

  return Array.isArray(produtosFiltrados) ? produtosFiltrados : [];
};

export const getPacotesByLabIdAndCodProduto = (idLab, codProduto) => {
  const resultado = pacotesByProdutos.find(
    (item) =>
      Number(item.idLab) === Number(idLab) &&
      Number(item.codProduto) === Number(codProduto)
  );

  if (!resultado) {
    return [];
  }

  return resultado.pacotes.map((pacote) => ({
    ...pacote,
    uniMedida: resultado.uniMedida,
  }));
};
