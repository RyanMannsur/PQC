import axios from "axios";
import { API_URL } from "../../config/config";

const api = axios.create({
  baseURL: API_URL,
});

export default api;

export const getLabs = async () => {
  try {
    const userTokenJson = localStorage.getItem("user_token");
    if (!userTokenJson) {
      throw new Error("Usuário não autenticado.");
    }

    const userToken = localStorage.getItem("user_token");

    const response = await api.get(`/obterLocaisEstoque/${userToken}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar locais de estoque:", error);
    return [];
  }
};

export const setLabId = (lab) => {
  const { codCampus, codUnidade, codPredio, codLaboratorio } = lab;
  const labId = { codCampus, codUnidade, codPredio, codLaboratorio };
  localStorage.setItem("labId", JSON.stringify(labId));
};

export const getEstoqueLocalEstocagem = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio
) => {
  try {
    const response = await api.get(
      `/obterLocalEstocagemPorId/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estoque local de estocagem:", error);
    return [];
  }
};

export const obterTodosLaboratorios = async () => {
  try {
    const response = await api.get("/obterTodosLaboratorios");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar laboratórios:", error);
    return [];
  }
};
