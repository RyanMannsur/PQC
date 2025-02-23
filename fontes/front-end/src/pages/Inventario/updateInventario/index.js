import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as C from "./styles";
import { getPacotesByLabIdAndCodProduto } from "../../../services/produto/service";
import ItemList from "../../../components/ItemList";

const InventarioDetalhes = () => {
  const { idProduto } = useParams();
  const labId = localStorage.getItem("labId");
  const navigate = useNavigate();
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    if (labId && idProduto) {
      const pacotesFiltrados = getPacotesByLabIdAndCodProduto(labId, idProduto);
      setPacotes(pacotesFiltrados);
    }
  }, [labId, idProduto]);

  const handleInputChange = (updatedData) => {
    setPacotes(updatedData);
  };

  const columns = [
    { key: "sequencia", label: "Sequência", type: "string" },
    { key: "ultimaModificacao", label: "Última Modificação", type: "string" },
    { key: "quantidade", label: "Quantidade", type: "input" },
    { key: "uniMedida", label: "Unidade de Medida", type: "string" },
  ];

  const data = pacotes.map((pacote) => ({
    id: pacote.sequencia,
    sequencia: pacote.sequencia,
    ultimaModificacao: new Date(pacote.ultimaModificacao).toLocaleString(),
    quantidade: pacote.quantidade,
    uniMedida: pacote.uniMedida,
  }));

  return (
    <C.Container>
      <h1>Detalhes do Inventário</h1>
      {pacotes.length > 0 ? (
        <ItemList
          columns={columns}
          data={data}
          onInputChange={handleInputChange}
        />
      ) : (
        <p>Nenhum pacote encontrado.</p>
      )}
      <C.ButtonGroup>
        <C.Button onClick={() => navigate("/inventario")}>
          Confirmar Inventário
        </C.Button>
        <C.CancelButton onClick={() => window.location.reload()}>
          Cancelar
        </C.CancelButton>
      </C.ButtonGroup>
    </C.Container>
  );
};

export default InventarioDetalhes;
