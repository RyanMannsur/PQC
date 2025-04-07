import React, { useState, useEffect } from "react";
import ImplantacaoList from "../../features/implantacao";
import { obterProdutos } from "../../services/produto/service";
import * as C from "./styles";

const Implantacao = () => {
const [produtos, setProdutos] = useState([]); 
const [implantacoes, setImplantacoes] = useState({}); 
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProdutos = async () => {
    try {
      const produtosResponse = await obterProdutos(); 
      setProdutos(produtosResponse);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProdutos();
}, []);

const handleChange = (updatedImplantacoes) => {
  setImplantacoes(updatedImplantacoes); 
};

const handleConfirm = () => {
  console.log("Implantações confirmadas:", implantacoes);
  
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