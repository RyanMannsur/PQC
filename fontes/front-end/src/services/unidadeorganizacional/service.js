import api from '../../services/api';

const unidadeService = {
  listar: async () => {
    const response = await api.get('/unidadeorganizacional');
    return response.data.map(u => ({
      codunidade: u[0],
      nomunidade: u[1],
      codcampus: u[2],
      sglunidade: u[3]
    }));
  },
  cadastrar: async (unidade) => {
    const payload = {
      codcampus: unidade.codcampus,
      codunidade: unidade.codunidade,
      sglunidade: unidade.sglunidade,
      nomunidade: unidade.nomunidade
    };
    const response = await api.post('/unidadeorganizacional', payload);
    return response.data;
  },
  atualizar: async (unidade) => {
    const payload = {
      codcampus: unidade.codcampus,
      sglunidade: unidade.sglunidade,
      nomunidade: unidade.nomunidade
    };
    const response = await api.put(`/unidadeorganizacional/${unidade.codunidade}`, payload);
    return response.data;
  },
  excluir: async (codunidade) => {
    const response = await api.delete(`/unidadeorganizacional/${codunidade}`);
    return response.data;
  },
  listarPorCampus: async (codcampus) => {
    const response = await api.get(`/api/unidadeorganizacional/campus/${codcampus}`);
    return response.data.map(u => ({
      codunidade: u[0],
      nomunidade: u[1],
      codcampus: u[2]
    }));
  }
};

export default unidadeService;
