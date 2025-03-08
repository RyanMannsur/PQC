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
  codLaboratorio
) => {
  try {
    const response = await api.get(
      `/obterEstoqueLocalEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao obter estoque no local de estocagem:", error);
    return [];
  }
};
