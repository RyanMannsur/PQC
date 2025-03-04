import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

export default api;

export const getLabs = async () => {
  try {
    const userDataJson = localStorage.getItem("user_data");
    if (!userDataJson) {
      throw new Error("Usuário não autenticado.");
    }

    const userData = JSON.parse(userDataJson);
    const codSiape = userData.codSiape;

    const response = await api.get(`/obterLocaisEstoque/${codSiape}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar locais de estoque:", error);
    return [];
  }
};

export const setLabId = (lab) => {
  console.log("Setting lab id1:", lab);
  const { codCampus, codUnidade, codPredio, codLaboratorio } = lab;
  const labId = { codCampus, codUnidade, codPredio, codLaboratorio };
  console.log("Setting lab id2:", labId);
  localStorage.setItem("labId", JSON.stringify(labId));
};
