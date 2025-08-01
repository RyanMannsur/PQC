import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Select, Button, FormGroup } from "../../../components";
import * as C from "./styles";
import {
obterProduto,
atualizarInventario,
} from "../../../services/produto/service";
import { obterTodosLaboratorios } from "../../../services/laboratorio/service";
import ItemList from "../../../components/ItemList";
import { formatarData } from "../../../helpers/dataHelper";

const TransferirProduto = () => {
const { codProduto, seqItem } = useParams();
const navigate = useNavigate();
const [produto, setProduto] = useState({});
const [labId, setLabId] = useState(null);
const [novoLab, setNovoLab] = useState(null);
const [labs, setLabs] = useState([]);
const [mensagem, setMensagem] = useState("");

useEffect(() => {
  const localStorageData = JSON.parse(localStorage.getItem("labId"));
  setLabId(localStorageData);

  const fetchLabs = async () => {
    try {
      const labsResponse = await obterTodosLaboratorios();

      const filteredLabs = labsResponse.filter(
        (lab) =>
          !(
            lab.codCampus === localStorageData.codCampus &&
            lab.codUnidade === localStorageData.codUnidade &&
            lab.codPredio === localStorageData.codPredio &&
            lab.codLaboratorio === localStorageData.codLaboratorio
          )
      );

      setLabs(
        filteredLabs.map((lab) => ({
          value: lab.codLaboratorio,
          label: lab.nomLocal,
          codCampus: lab.codCampus,
          codUnidade: lab.codUnidade,
          codPredio: lab.codPredio,
          codLaboratorio: lab.codLaboratorio,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar laboratórios:", error);
    }
  };

  fetchLabs();
}, []);

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
        
        // Backend retorna um array, pegar o primeiro elemento
        const produtoData = Array.isArray(produtoResponse) && produtoResponse.length > 0 
          ? produtoResponse[0] 
          : produtoResponse;
          
        setProduto({
          ...produtoData,
          datValidade: formatarData(produtoData.datValidade),
        });
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    }
  };

  fetchProduto();
}, [labId, codProduto, seqItem]);

const handleTransferir = async () => {
  if (!novoLab) {
    setMensagem("Por favor, selecione um laboratório para transferência.");
    return;
  }

  const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
  const qtdAtual = parseFloat(produto.qtdEstoque);

  if (qtdAtual <= 0) {
    setMensagem("Quantidade do produto no estoque atual é zero ou negativa.");
    return;
  }

  const {
    codCampus: codCampusDestino,
    codUnidade: codUnidadeDestino,
    codPredio: codPredioDestino,
    codLaboratorio: codLaboratorioDestino,
  } = novoLab;

  try {
    await atualizarInventario(
      codProduto,
      seqItem,
      -qtdAtual,
      codCampus,
      codUnidade,
      codPredio,
      codLaboratorio,
      "TS"
    );
    await atualizarInventario(
      codProduto,
      seqItem,
      qtdAtual,
      codCampusDestino,
      codUnidadeDestino,
      codPredioDestino,
      codLaboratorioDestino,
      "TE"
    );

    setMensagem(""); 

    navigate("/transferencias", {
      state: { successMessage: "Transferência realizada com sucesso!" },
    });
  } catch (error) {
    setMensagem("Erro ao realizar transferência.");
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
    id: `${produto.codProduto}-${produto.seqItem}`,
    nomProduto: produto.nomProduto,
    perPureza: produto.perPureza,
    vlrDensidade: produto.vlrDensidade,
    datValidade: produto.datValidade,
    seqItem: produto.seqItem,
    quantidade: produto.qtdEstoque,
  },
];

return (
  <C.Container>
    <h1>Transferir Produto</h1>

    {produto.nomProduto && <h2>{produto.nomProduto}</h2>}

    {data.length > 0 ? (
      <ItemList columns={columns} data={data} />
    ) : (
      <p>Nenhum produto encontrado no inventário.</p>
    )}
    <C.Content>
      <Select
        label="Selecionar Laboratório de Destino"
        options={labs}
        value={novoLab ? novoLab.value : ""}
        onChange={(selectedOption) => {
          setNovoLab(selectedOption);
          setMensagem("");
        }}
        placeholder="Selecione um laboratório"
      />
      <C.labelError>{mensagem}</C.labelError>
      <FormGroup justifyContent="center">
        <Button Text="Transferir" onClick={handleTransferir} />
      </FormGroup>
    </C.Content>
  </C.Container>
);
};

export default TransferirProduto;