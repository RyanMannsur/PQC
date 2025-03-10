import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { obterEstoqueLocalEstocagem } from "../../services/produto/service";
import ItemList from "../../components/ItemList";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { formatarData } from "../../helpers/dataHelper";

const Inventario = () => {
  const { labId } = useLocal();
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const dataInicial = "1900-01-01";

  useEffect(() => {
    const fetchProdutos = async () => {
      if (labId) {
        const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;

        try {
          const produtosResponse = await obterEstoqueLocalEstocagem(
            codCampus,
            codUnidade,
            codPredio,
            codLaboratorio,
            dataInicial
          );

          const produtosNegativos = produtosResponse.filter(
            (produto) => produto.qtdEstoque < 0
          );
          if (produtosNegativos.length > 0) {
            setErro("Há produtos com quantidade negativa no estoque!");
            setProdutos([]);
            return;
          }

          const produtosComQuantidade = produtosResponse
            .filter((produto) => produto.qtdEstoque > 0)
            .map((produto) => {
              return {
                codProduto: produto.codProduto,
                nomProduto: produto.nomProduto,
                perPureza: produto.perPureza,
                vlrDensidade: produto.vlrDensidade,
                datValidade: formatarData(produto.datValidade),
                seqItem: produto.seqItem,
                quantidade: produto.qtdEstoque,
              };
            })
            .sort((a, b) =>
              a.quantidade === 0 ? 1 : b.quantidade === 0 ? -1 : 0
            );

          setProdutos(produtosComQuantidade);
          setErro("");
        } catch (error) {
          console.error("Erro ao buscar produtos e quantidades:", error);
          setProdutos([]);
          setErro("Erro ao buscar produtos e quantidades");
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
      const [codProduto, seqItem] = id.split("-");
      navigate(`/inventario/${codProduto}/${seqItem}`);
    }
  };

  const data = produtos.map((produto) => ({
    id: `${produto.codProduto}-${produto.seqItem}`,
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
      {erro && <p style={{ color: "red" }}>{erro}</p>}{" "}
      {/* Exibe mensagem de erro em vermelho */}
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
          Text="Adicionar Produto"
          onClick={() => navigate("/cadastrar-produto")}
        />
      </C.ButtonGroup>
    </C.Container>
  );
};

export default Inventario;
