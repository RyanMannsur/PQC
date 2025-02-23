import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLab } from "../../contexts/lab";
import { getProdutosByLabId } from "../../services/produto/service";
import ItemList from "../../components/ItemList";
import { useNavigate } from "react-router-dom";

const Inventario = () => {
  const { labId } = useLab();
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (labId) {
      const produtosFiltrados = getProdutosByLabId(labId);
      setProdutos(Array.isArray(produtosFiltrados) ? produtosFiltrados : []);
    }
  }, [labId]);

  const columns = [
    { key: "nome", label: "Produto", type: "string" },
    { key: "quantidade", label: "Quantidade", type: "numeric" },
    { key: "acoes", label: "Ações", type: "action" },
  ];

  const data = produtos.map((produto) => ({
    id: produto.codProduto,
    nome: produto.nomProduto,
    quantidade: `${produto.quantidadeAtual} ${produto.uniMedida}`,
    acoes: (
      <C.Button onClick={() => navigate(`/inventario/${produto.codProduto}`)}>
        Ver Detalhes
      </C.Button>
    ),
  }));

  return (
    <C.Container>
      <h1>Inventário</h1>
      {produtos.length > 0 ? (
        <ItemList columns={columns} data={data} />
      ) : (
        <p>Nenhum produto encontrado no inventário.</p>
      )}
    </C.Container>
  );
};

export default Inventario;
