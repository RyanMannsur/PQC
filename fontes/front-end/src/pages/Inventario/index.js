import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { getProdutosByLabId } from "../../services/produto/service";
import ItemList from "../../components/ItemList";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Inventario = () => {
  const { labId } = useLocal();
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
    { key: "acoes", label: "Atualizar", type: "button" }, // Define um botão automaticamente
  ];

  // Função para lidar com ações nos botões gerados automaticamente
  const handleActionClick = (id, key) => {
    if (key === "acoes") {
      navigate(`/inventario/${id}`);
    }
  };

  const data = produtos.map((produto) => ({
    id: produto.codProduto,
    nome: produto.nomProduto,
    quantidade: `${produto.quantidadeAtual} ${produto.uniMedida}`,
  }));

  return (
    <C.Container>
      <h1>Inventário</h1>
      {produtos.length > 0 ? (
        <ItemList
          columns={columns}
          data={data}
          onActionClick={handleActionClick}
        />
      ) : (
        <p>Nenhum produto encontrado no inventário.</p>
      )}
      <C.ButtonGroup>
        <Button
          Text="Cadastrar Produto"
          onClick={() => navigate("/cadastrar-produto")}
        />
      </C.ButtonGroup>
    </C.Container>
  );
};

export default Inventario;
