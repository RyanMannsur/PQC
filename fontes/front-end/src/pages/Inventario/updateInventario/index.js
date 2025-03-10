import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocal } from "../../../contexts/local";
import {
  obterProduto,
  atualizarInventario,
} from "../../../services/produto/service";
import ItemList from "../../../components/ItemList";
import Input from "../../../components/Input"; // Adicionando o componente de Input
import Button from "../../../components/Button";
import { formatarData } from "../../../helpers/dataHelper";
import * as C from "./styles";

const InventarioDetalhes = () => {
  const { codProduto, seqItem } = useParams();
  const { labId } = useLocal();
  const navigate = useNavigate();
  const [produto, setProduto] = useState({});
  const [novaQuantidade, setNovaQuantidade] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchProduto = async () => {
      if (labId) {
        const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
        try {
          const produtoResponse = await obterProduto(
            codCampus,
            codUnidade,
            codPredio,
            codLaboratorio,
            codProduto,
            seqItem
          );
          setProduto({
            ...produtoResponse,
            datValidade: formatarData(produtoResponse.datValidade),
          });
        } catch (error) {
          console.error("Erro ao buscar produto:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduto();
  }, [labId, codProduto, seqItem]);

  const handleSave = async () => {
    const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
    const valorAtual = parseFloat(novaQuantidade);
    const valorAnterior = parseFloat(produto.qtdEstoque);
    const qtdMovimentacao = -(valorAnterior - valorAtual);

    if (qtdMovimentacao > 0 || valorAtual < 0) {
      setMensagem(
        "A quantidade nova não pode ser maior que a quantidade anterior. E nem menor que 0."
      );
      return;
    }

    try {
      const response = await atualizarInventario(
        codProduto,
        seqItem,
        qtdMovimentacao,
        codCampus,
        codUnidade,
        codPredio,
        codLaboratorio
      );
      if (response.error) {
        setMensagem(response.error);
      } else {
        setMensagem("Inventário atualizado com sucesso");
        navigate("/inventario");
      }
    } catch (error) {
      setMensagem("Erro ao atualizar inventário");
    }
  };

  const columns = [
    { key: "nomProduto", label: "Produto", type: "string" },
    { key: "perPureza", label: "Pureza", type: "string" },
    { key: "vlrDensidade", label: "Densidade", type: "string" },
    { key: "datValidade", label: "Validade", type: "string" },
    { key: "seqItem", label: "Item", type: "numeric" },
    { key: "quantidade", label: "Quantidade", type: "numeric" },
  ];

  const data = [
    {
      id: `${produto.codProduto}-${produto.seqItem}`, // Geração de chave única
      nomProduto: produto.nomProduto,
      perPureza: produto.perPureza,
      vlrDensidade: produto.vlrDensidade,
      datValidade: produto.datValidade,
      seqItem: produto.seqItem,
      quantidade: produto.qtdEstoque,
    },
  ];

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <C.Container>
      <h1>Atualizando Inventário</h1>
      {data.length > 0 ? (
        <ItemList columns={columns} data={data} />
      ) : (
        <p>Nenhum produto encontrado no inventário.</p>
      )}
      <C.Content>
        <Input
          type="number"
          placeholder="Digite a nova quantidade"
          value={novaQuantidade}
          label="Quantidade Nova:"
          onChange={(e) => [setNovaQuantidade(e.target.value), setMensagem("")]}
        />
        <C.labelError>{mensagem}</C.labelError>
        <p>O gasto foi de {produto.qtdEstoque - novaQuantidade} unidades.</p>
        <Button Text="Salvar" onClick={handleSave} />
      </C.Content>
    </C.Container>
  );
};

export default InventarioDetalhes;
