import api from '../api';

const campusService = {
  listar: async () => {
    const response = await api.get('/campus');
    // Se vier como array de arrays, converte para objetos
    return response.data.map(c => ({ codcampus: c[0], nomcampus: c[1] }));
  },
  cadastrar: async (campus) => {
    // Envia apenas os campos corretos
    const payload = { codcampus: campus.codcampus, nomcampus: campus.nomcampus };
    const response = await api.post('/campus', payload);
    return response.data;
  },
  atualizar: async (campus) => {
    const payload = { codcampus: campus.codcampus, nomcampus: campus.nomcampus };
    const response = await api.put(`/campus/${campus.codcampus}`, payload);
    return response.data;
  },
  excluir: async (codcampus) => {
    const response = await api.delete(`/campus/${codcampus}`);
    return response.data;
  }
};

export default campusService;
