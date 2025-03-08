import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { obterEstoqueLocalEstocagem } from "../../services/produto/service";
import ItemList from "../../components/ItemList";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Inventario = () => {
  const { labId } = useLocal();
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      if (labId) {
        const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;

        try {
          // Chamada para obter produtos e estoques
          const produtosResponse = await obterEstoqueLocalEstocagem(
            codCampus,
            codUnidade,
            codPredio,
            codLaboratorio
          );

          // Ajusta as quantidades nos produtos
          const produtosComQuantidade = produtosResponse.map((produto) => {
            return {
              codProduto: produto.codProduto,
              nomProduto: produto.nomProduto,
              perPureza: produto.perPureza,
              vlrDensidade: produto.vlrDensidade,
              datValidade: produto.datValidade,
              seqItem: produto.seqItem,
              quantidade: produto.qtdEstoque,
            };
          });

          setProdutos(produtosComQuantidade);
        } catch (error) {
          console.error("Erro ao buscar produtos e quantidades:", error);
          setProdutos([]);
        }
      }
    };

    fetchProdutos();
  }, [labId]);

  const columns = [
    { key: "nomProduto", label: "Produto", type: "string" },
    { key: "perPureza", label: "Pureza", type: "string" },
    { key: "vlrDensidade", label: "Densidade", type: "string" },
    { key: "datValidade", label: "Validade", type: "string" },
    { key: "seqItem", label: "Item", type: "numeric" },
    { key: "quantidade", label: "Quantidade", type: "numeric" },
    { key: "acoes", label: "Atualizar", type: "button" },
  ];

  const handleActionClick = (id, key) => {
    if (key === "acoes") {
      navigate(`/inventario/${id}`);
    }
  };

  const data = produtos.map((produto) => ({
    id: `${produto.codProduto}-${produto.seqItem}`, // Geração de chave única
    nomProduto: produto.nomProduto,
    perPureza: produto.perPureza,
    vlrDensidade: produto.vlrDensidade,
    datValidade: produto.datValidade,
    seqItem: produto.seqItem,
    quantidade: produto.quantidade,
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
