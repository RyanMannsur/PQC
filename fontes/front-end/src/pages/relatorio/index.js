import { useState } from "react";
import * as C from "./styles";
import RelatorioProdutos from "../../features/relatorio"; 
import { obterRelatorioProdutos } from "../../services/produto/service"; 
import Input from "../../components/Input";
import Button from "../../components/Button";

const Relatorio = () => {
const [produtos, setProdutos] = useState([]);
const [erro, setErro] = useState("");
const [loading, setLoading] = useState(false);
const [dataInicio, setDataInicio] = useState("");
const [dataFim, setDataFim] = useState(""); 

const fetchRelatorio = async () => {
  setLoading(true);
  try {
    const relatorioResponse = await obterRelatorioProdutos(dataInicio, dataFim); 
    setProdutos(relatorioResponse);
    setErro("");
  } catch (error) {
    console.error("Erro ao carregar o relatório:", error);
    setErro("Erro ao carregar o relatório. Tente novamente mais tarde.");
    setProdutos([]);
  } finally {
    setLoading(false);
  }
};

const handleBuscarClick = () => {
  fetchRelatorio(); 
};

return (
  <C.Container>
    <h1>Relatório de Produtos</h1>

    <C.FiltersContainer>
      <Input
        type="date"
        label="Data Início"
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
      />
      <Input
        type="date"
        label="Data Fim"
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
      />
      <Button Text="Buscar" onClick={handleBuscarClick} />
    </C.FiltersContainer>

    {erro && <p style={{ color: "red" }}>{erro}</p>}

    {loading ? (
      <p>Carregando...</p>
    ) : produtos.length > 0 ? (
      <RelatorioProdutos data={produtos} />
    ) : (
      <p>Nenhum dado encontrado para o relatório.</p>
    )}
  </C.Container>
);
};

export default Relatorio;