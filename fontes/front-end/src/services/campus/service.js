import api from '../api';

const campusService = {
  listar: async () => {
    const response = await api.get('/campus');
    // Se vier como array de arrays, converte para objetos
    return response.data.map(c => ({ codcampus: c[0], nomcampus: c[1] }));
  },
  cadastrar: async (campus) => {
    // Envia apenas os campos corretos
    const payload = { codCampus: campus.codCampus, nomCampus: campus.nomCampus };
    const response = await api.post('/campus', payload);
    return response.data;
  },
  atualizar: async (campus) => {
    const payload = { codCampus: campus.codCampus, nomCampus: campus.nomCampus };
    const response = await api.put(`/campus/${campus.codCampus}`, payload);
    return response.data;
  },
  excluir: async (codCampus) => {
    const response = await api.delete(`/campus/${codCampus}`);
    return response.data;
  }
};

export default campusService;
