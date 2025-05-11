import { useEffect, useState } from "react";
import * as C from "./styles";
import RelatorioProdutos from "../../features/relatorio"; // Importa a feature da tabela
import { obterRelatorioProdutos } from "../../services/produto/service"; // Importa o serviço para obter o relatório

const Relatorio = () => {
const [produtos, setProdutos] = useState([]);
const [erro, setErro] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchRelatorio = async () => {
    try {
      const relatorioResponse = await obterRelatorioProdutos(); // Chama o serviço
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

  fetchRelatorio();
}, []);

return (
  <C.Container>
    <h1>Relatório de Produtos</h1>
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