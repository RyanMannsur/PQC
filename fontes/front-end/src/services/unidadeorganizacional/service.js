import api from '../../services/api';

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
  atualizar: async (codcampus, codunidade, unidade) => {
    // Apenas trim nos códigos, padding é responsabilidade do backend
    const codUnidadeStr = typeof codunidade === 'string' ? codunidade.trim() : codunidade;
    const codCampusStr = typeof codcampus === 'string' ? codcampus.trim() : codcampus;
    const payload = {
      codcampus: codCampusStr,
      codunidade: codUnidadeStr,
      sglunidade: unidade.sglunidade,
      nomunidade: unidade.nomunidade
    };
    const response = await api.put(`/unidadeorganizacional/${codUnidadeStr}/${codCampusStr}`, payload);
  },
  excluir: async (codcampus, codunidade) => {
    const response = await api.delete(`/unidadeorganizacional/${codcampus.trim()}/${codunidade.trim()}`);
    return response.data;
  },
  listarPorCampus: async (codcampus) => {
    const response = await api.get(`/api/unidadeorganizacional/campus/${codcampus.trim()}`);
    return response.data.map(u => ({
      codunidade: u[0]?.trim(),
      nomunidade: u[1],
      codcampus: u[2]?.trim()
    }));
  }
};

export default unidadeService;
