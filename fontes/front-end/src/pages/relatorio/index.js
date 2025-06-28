import { useState } from "react";
import * as C from "./styles";
import RelatorioProdutos from "../../features/relatorio"; 
import { obterRelatorioProdutos } from "../../services/produto/service"; 

const Relatorio = () => {
 const [dataInicio, setDataInicio] = useState("");
 const [dataFim, setDataFim] = useState("");
 const [produtos, setProdutos] = useState([]);
 const [loading, setLoading] = useState(false);
 const [erro, setErro] = useState("");

 const fetchRelatorio = async () => {
   setLoading(true);
   try {
     const relatorioResponse = await obterRelatorioProdutos(dataInicio, dataFim); 
     const produtosFiltrados = relatorioResponse.map((produto) => ({
        ...produto, movimentacoes: produto.movimentacoes.filter(
            (movto) => movto.idtTipoMovto !== "IN"
          ),
      }));
     setProdutos(produtosFiltrados);
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
       <C.InputGroup>
         <C.Label htmlFor="dataInicio">Data Início</C.Label>
         <C.Input
           id="dataInicio"
           type="date"
           value={dataInicio}
           onChange={(e) => setDataInicio(e.target.value)}
         />
       </C.InputGroup>

       <C.InputGroup>
         <C.Label htmlFor="dataFim">Data Fim</C.Label>
         <C.Input
           id="dataFim"
           type="date"
           value={dataFim}
           onChange={(e) => setDataFim(e.target.value)}
         />
       </C.InputGroup>

       <C.Button onClick={handleBuscarClick}>Buscar</C.Button>
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