import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ItemList from "../../components/ItemList";
import { buscarProdutos } from "../../services/produto/service";

const Transferencias = () => {
  const navigate = useNavigate();
  const [produto, setProduto] = useState("");
  const [pureza, setPureza] = useState("");
  const [densidade, setDensidade] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("labId"));
    setLocalData(localStorageData);
  }, []);

  const handlePesquisar = async () => {
    if (localData) {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = localData;
      const produtosResponse = await buscarProdutos(
        codCampus,
        codUnidade,
        codPredio,
        codLaboratorio,
        produto,
        pureza,
        densidade
      );
      setProdutos(produtosResponse);
    } else {
      console.error("Dados de local não encontrados no local storage.");
    }
  };

  const handleActionClick = (id, key) => {
    console.log("id", id);
    console.log("key", key);
    if (key === "acoes") {
      const [codProduto, seqItem] = id.split("-");
      navigate(`/transferir/${codProduto}/${seqItem}`);
    }
  };

  const columns = [
    { key: "codigo", label: "Código", type: "string" },
    { key: "nome", label: "Nome", type: "string" },
    { key: "quantidade", label: "Quantidade", type: "string" },
    { key: "validade", label: "Data de Validade", type: "string" },
    { key: "pureza", label: "Pureza", type: "string" },
    { key: "densidade", label: "Densidade", type: "string" },
    {
      key: "acoes",
      label: "Transferir",
      type: "button",
    },
  ];

  const data = produtos.map((produto) => ({
    id: `${produto.codProduto}-${produto.seqItem}`,
    codigo: produto.codProduto,
    nome: produto.nomProduto,
    quantidade: produto.qtdEstoque,
    validade: produto.datValidade,
    pureza: produto.perPureza,
    densidade: produto.vlrDensidade,
    seqItem: produto.seqItem,
  }));

  return (
    <C.Container>
      <h1>Transferências</h1>

      <C.FilterContainer>
        <Input
          type="text"
          placeholder="Digite o produto"
          value={produto}
          label="Produto"
          onChange={(e) => setProduto(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Digite a pureza"
          value={pureza}
          label="Pureza"
          onChange={(e) => setPureza(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Digite a densidade"
          value={densidade}
          label="Densidade"
          onChange={(e) => setDensidade(e.target.value)}
        />
        <Button Text="Pesquisar" onClick={handlePesquisar} />
      </C.FilterContainer>

      {produtos.length > 0 ? (
        <ItemList
          columns={columns}
          data={data}
          onActionClick={handleActionClick}
        />
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </C.Container>
  );
};

export default Transferencias;
