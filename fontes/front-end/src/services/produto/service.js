import axios from "axios";
import { API_URL } from "../../config/config";

const api = axios.create({
  baseURL: API_URL,
});

export default api;

export const obterProdutosPorLaboratorio = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio
) => {
  try {
    const response = await api.get(
      `/obterProdutosPorLaboratorio/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos por laboratório:", error);
    return [];
  }
};

export const obterEstoqueLocalEstocagem = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  data = null
) => {
  try {
    let url = `/obterEstoqueLocalEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`;
    if (data) {
      url += `?data=${data}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter estoque no local de estocagem:", error);
    return [];
  }
};

export const obterProduto = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  codProduto,
  seqItem,
  data = null // Parâmetro de data opcional
) => {
  try {
    let url = `/ObterProdutoBYCodigoAndSequencia/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}/${codProduto}/${seqItem}`;
    if (data) {
      url += `?data=${data}`; // Adiciona a data à URL se fornecida
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter produto:", error);
    return {};
  }
};

export const atualizarInventario = async (
  codProduto,
  seqItem,
  qtdEstoque,
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio
) => {
  try {
    const response = await api.post("/atualizarInventarioBySequencia", {
      codProduto,
      seqItem,
      qtdEstoque,
      codCampus,
      codUnidade,
      codPredio,
      codLaboratorio,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar inventário:", error);
    return { error: "Erro ao atualizar inventário" };
  }
};

// Função para buscar produtos por nome, pureza e densidade
export const buscarProdutos = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  nomeProduto,
  pureza,
  densidade
) => {
  try {
    const response = await api.get(`/buscarProdutos`, {
      params: {
        codCampus,
        codUnidade,
        codPredio,
        codLaboratorio,
        nomeProduto,
        pureza,
        densidade,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};
