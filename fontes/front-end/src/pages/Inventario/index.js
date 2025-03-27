import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { obterEstoqueLocalEstocagem } from "../../services/produto/service";
import InventarioList from "../../features/inventario";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { formatarData } from "../../helpers/dataHelper";
import { atualizarQuantidadeProdutosLaboratorio } from "../../services/produto/service";

const Inventario = () => {
  const { labId } = useLocal();
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  
  const dataInicial = "1900-01-01";
  
  useEffect(() => {
    const fetchProdutos = async () => {
      if (labId) {
        const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
  
        try {
          const produtosResponse = await obterEstoqueLocalEstocagem(
            codCampus,
            codUnidade,
            codPredio,
            codLaboratorio,
            dataInicial
          );
  
          const produtosNegativos = produtosResponse.filter(
            (produto) => produto.qtdEstoque < 0
          );
          if (produtosNegativos.length > 0) {
            setErro("Há produtos com quantidade negativa no estoque!");
            setProdutos([]);
            return;
          }
  
          const produtosAgrupados = agruparProdutos(produtosResponse);
  
          setProdutos(produtosAgrupados);
          setErro("");
        } catch (error) {
          console.error("Erro ao buscar produtos e quantidades:", error);
          setProdutos([]);
          setErro("Erro ao buscar produtos e quantidades");
        }
      }
    };
  
    fetchProdutos();
  }, [labId]);
  
  // Função para agrupar produtos e seus itens
  const agruparProdutos = (produtosResponse) => {
    const agrupados = {};
  
    produtosResponse.forEach((produto) => {
      const {
        codProduto,
        nomProduto,
        perPureza,
        vlrDensidade,
        datValidade,
        seqItem,
        qtdEstoque,
      } = produto;
  
      if (!agrupados[codProduto]) {
        agrupados[codProduto] = {
          codProduto,
          nomProduto,
          perPureza,
          vlrDensidade,
          itens: [],
        };
      }
  
      agrupados[codProduto].itens.push({
        seqItem,
        datValidade: formatarData(datValidade),
        nomEmbalagem: "Padrão", // Valor padrão para embalagem
        qtdAtual: qtdEstoque,
        qtdNova: qtdEstoque, // Inicialmente igual à quantidade atual
      });
    });
  
    return Object.values(agrupados); // Retorna como array
  };
  
  const handleQuantityChange = (codProduto, seqItem, newQuantity) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) =>
        produto.codProduto === codProduto
          ? {
              ...produto,
              itens: produto.itens.map((item) =>
                item.seqItem === seqItem
                  ? { ...item, qtdNova: newQuantity }
                  : item
              ),
            }
          : produto
      )
    );
  };
  
  const enviarAtualizacao = async () => {
    if (!labId) return;
  
    const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
  
    const payload = {
      codCampus,
      codUnidade,
      codPredio,
      codLaboratorio,
      produtos: produtos.flatMap((produto) =>
        produto.itens.map((item) => ({
          codProduto: produto.codProduto,
          seqItem: item.seqItem,
          qtdEstoque: parseFloat(item.qtdNova), // Nova quantidade que o usuário editou
        }))
      ),
    };
  
    try {
      const result = await atualizarQuantidadeProdutosLaboratorio(
        payload.codCampus,
        payload.codUnidade,
        payload.codPredio,
        payload.codLaboratorio,
        payload.produtos
      );
  
      if (result.error) {
        alert(`Erro: ${result.error}`);
      } else {
        alert("Movimentações de estoque criadas com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao enviar atualização:", err);
      alert("Erro ao enviar atualização.");
    }
  };
  
  return (
    <C.Container>
      <h1>Inventário</h1>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {produtos.length > 0 ? (
        <InventarioList data={produtos} onQuantityChange={handleQuantityChange} />
      ) : (
        <p>Nenhum produto encontrado no inventário.</p>
      )}
      <C.ButtonGroup>
        <Button
          Text="Adicionar Produto"
          onClick={() => navigate("/cadastrar-produto")}
        />
        <Button
          Text="Confirmar Atualização"
          onClick={enviarAtualizacao}
        />
      </C.ButtonGroup>
    </C.Container>
  );
  };
  
  export default Inventario;