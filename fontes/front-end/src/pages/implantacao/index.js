import React, { useState, useEffect } from "react";
import ImplantacaoList from "../../features/implantacao";
import { obterProdutos } from "../../services/produto/service";
import * as C from "./styles";

const Implantacao = () => {
const [produtos, setProdutos] = useState([]); // Estado para armazenar os produtos
const [implantacoes, setImplantacoes] = useState({}); // Estado para armazenar os dados de implantação
const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

useEffect(() => {
  const fetchProdutos = async () => {
    try {
      const produtosResponse = await obterProdutos(); // Consulta os produtos
      setProdutos(produtosResponse);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  fetchProdutos();
}, []);

const handleChange = (updatedImplantacoes) => {
  setImplantacoes(updatedImplantacoes); // Atualiza o estado com os dados da lista
};

const handleConfirm = () => {
  console.log("Implantações confirmadas:", implantacoes);
  // Aqui você pode enviar os dados para a API ou realizar outra ação
};

if (loading) {
  return <C.Loading>Carregando produtos...</C.Loading>;
}

return (
  <C.Container>
    <C.Title>Implantação de Produtos</C.Title>
    <ImplantacaoList data={produtos} onChange={handleChange} />
    <C.ConfirmButton onClick={handleConfirm}>Confirmar</C.ConfirmButton>
  </C.Container>
);
};

export default Implantacao;