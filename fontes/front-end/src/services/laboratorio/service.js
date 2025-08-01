import api from '../api'

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
  const { codCampus, codUnidade, codPredio, codLaboratorio } = lab;
  const labId = { codCampus, codUnidade, codPredio, codLaboratorio };
  localStorage.setItem("labId", JSON.stringify(labId));
};

export const getProdutosImplantar = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio
) => {
  try {
    const response = await api.get(
      `/obterProdutosNaoImplantadosNoLocal/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`
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




