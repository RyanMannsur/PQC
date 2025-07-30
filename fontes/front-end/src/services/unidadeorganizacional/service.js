import api from '../api';

const unidadeService = {
  listar: async () => {
    const response = await api.get('/unidadeorganizacional');
    return response.data.map(u => ({
      codcampus: u[0],
      codunidade: u[1],
      sglunidade: u[2],
      nomunidade: u[3]
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
  }
};

export default unidadeService;
