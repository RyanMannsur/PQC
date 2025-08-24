import api from './api'; 
import tratarErroApi from './tratarErroApi'; 

const orgaoControleService = {
  /**
   * Lista todos os órgãos de controle.
   * Assume que a API retorna um array de objetos.
   */
  listar: async () => {
    try {
      const response = await api.get('/orgaoControle');
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data; 
    } catch (error) {
      tratarErroApi(error, 'listar órgãos de controle');
      throw error;
    }
  },

  /**
   * Cadastra um novo órgão de controle.
   * @param {object} orgaoControle - Objeto contendo os dados do órgão de controle.
   * Ex: { codOrgaoControle, nomOrgaoControle }
   */
  cadastrar: async (orgaoControle) => {
    try {
      const payload = {
        codOrgaoControle: orgaoControle.codOrgaoControle,
        nomOrgaoControle: orgaoControle.nomOrgaoControle,
      };
      const response = await api.post('/orgaoControle', payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'cadastrar órgão de controle');
      throw error;
    }
  },

  /**
   * Atualiza um órgão de controle existente.
   * A chave primária é codOrgaoControle.
   * @param {object} orgaoControle - Objeto contendo os dados atualizados e o código do órgão.
   * Ex: { codOrgaoControle, nomOrgaoControle }
   */
  alterar: async (orgaoControle) => {
    try {
      const { codOrgaoControle, nomOrgaoControle } = orgaoControle;
      
      const payload = {
        'nomOrgaoControle': nomOrgaoControle, 
      };
      const response = await api.put(`/orgaoControle/${codOrgaoControle}`, payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar órgão de controle');
      throw error;
    }
  },

  /**
   * Exclui um órgão de controle.
   * @param {number} codOrgaoControle - Código do órgão de controle a ser excluído.
   */
  excluir: async (orgaoControle) => {
    try {
      const response = await api.delete(`/orgaoControle/${orgaoControle.codOrgaoControle}`);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'excluir órgão de controle');
      throw error;
    }
  }
};

export default orgaoControleService;