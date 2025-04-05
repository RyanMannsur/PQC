import React, { useState, useEffect } from "react";
import * as C from "./styles";
import ItemList from "../../../components/ItemList";
import { obterProdutos } from "../../../services/produto/service";
import { useNavigate, useLocation } from "react-router-dom"; // Importa useLocation para capturar o estado

const CreateProdutos = () => {
const [produtos, setProdutos] = useState([]);
const navigate = useNavigate();
const location = useLocation(); // Captura o estado passado pelo navigate
const [isTooltipVisible, setIsTooltipVisible] = useState(false); // Estado para controlar o Tooltip
const [tooltipMessage, setTooltipMessage] = useState(""); // Mensagem do Tooltip

useEffect(() => {
  const fetchProdutos = async () => {
    const produtosResponse = await obterProdutos();
    setProdutos(produtosResponse);
  };

  fetchProdutos();
}, []);

// Exibe o Tooltip se houver uma mensagem de sucesso no estado
useEffect(() => {
  if (location.state?.successMessage) {
    setTooltipMessage(location.state.successMessage);
    setIsTooltipVisible(true);

    // Remove o Tooltip após 3 segundos
    const timer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 3000);

    return () => clearTimeout(timer); // Limpa o timer caso o componente seja desmontado
  }
}, [location.state]);

const handleActionClick = (id, key) => {
  console.log("Ação clicada para o item com ID:", id);
  navigate(`/cadastrar-produto/${id}`);
};

const columns = [
  { key: "nome", label: "Nome", type: "string" },
  { key: "lista", label: "Lista", type: "string" },
  { key: "pureza", label: "Pureza", type: "string" },
  { key: "densidade", label: "Densidade", type: "string" },
  {
    key: "acoes",
    label: "Adicionar",
    type: "button",
  },
];

const data = produtos
  .map((produto) => ({
    id: produto[0],
    nome: produto[1],
    lista: produto[2],
    pureza: produto[3],
    densidade: produto[4],
  }))
  .sort((a, b) => a.nome.localeCompare(b.nome));

return (
  <C.Container>
    <h1>Cadastrar Produtos</h1>

    {/* Tooltip */}
    {isTooltipVisible && (
      <div style={{ position: "fixed", bottom: "20px", right: "20px", backgroundColor: "#333", color: "#fff", padding: "10px 20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        {tooltipMessage}
      </div>
    )}

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

export default CreateProdutos;