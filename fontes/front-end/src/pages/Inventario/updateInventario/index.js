/*import React, { useEffect, useState } from "react";
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
      const pacotesComNovaQuantidade = pacotesFiltrados.map((pacote) => ({
        ...pacote,
        nova_quantidade: pacote.quantidade, // Inicializa com a quantidade atual
      }));
      setPacotes(pacotesComNovaQuantidade);
    }
  }, [labId, idProduto]);

  const handleInputChange = (id, key, value) => {
    setPacotes((prevPacotes) =>
      prevPacotes.map((pacote) =>
        pacote.sequencia === id ? { ...pacote, [key]: value } : pacote
      )
    );
  };

  const handleConfirmarInventario = () => {
    console.log("Dados confirmados:", pacotes);
    // Aqui futuramente você pode enviar os dados atualizados para o backend
    navigate("/inventario");
  };

  const columns = [
    { key: "sequencia", label: "Sequência", type: "string" },
    { key: "ultimaModificacao", label: "Última Modificação", type: "string" },
    { key: "quantidade_anterio", label: "Quantidade Atual" },
    { key: "nova_quantidade", label: "Nova Quantidade", type: "input" },
    { key: "uniMedida", label: "Unidade de Medida", type: "string" },
  ];

  const data = pacotes.map((pacote) => ({
    id: pacote.sequencia,
    sequencia: pacote.sequencia,
    ultimaModificacao: new Date(pacote.ultimaModificacao).toLocaleString(),
    quantidade_anterio: pacote.quantidade,
    nova_quantidade: pacote.nova_quantidade,
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
        <C.Button onClick={handleConfirmarInventario}>
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
*/

const InventarioDetalhes = () => {};

export default InventarioDetalhes;
