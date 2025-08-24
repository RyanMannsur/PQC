import api from './api'; 
import tratarErroApi from './tratarErroApi';

const nfeService = {
  /**
   * Importa uma Nota Fiscal Eletrônica (NFe).
   * @param {object} payload - Objeto com os dados da NFe a serem importados.
   */
  importar: async (payload) => {
    try {
      const response = await api.post('/nfe', payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'importar NFe');
      throw error; 
    }
  },
};

export default nfeService;
