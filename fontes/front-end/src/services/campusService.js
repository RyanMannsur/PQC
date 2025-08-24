import api from './api';
import tratarErroApi from './tratarErroApi';

/**
 * @typedef {Object} Campus
 * @property {string} codCampus - O código do campus.
 * @property {string} nomCampus - O nome do campus.
 */

const campusService = {

  /**
   * Lista todos os campi da base de dados.
   * @returns {Promise<Campus[]>} Uma Promise que resolve para uma lista de objetos Campus.
   */
  listar: async () => {
    try {
      const response = await api.get('/campus');
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data
    } catch (error) {
      tratarErroApi(error, 'listar campus');
      throw error; 
    }
  },

  /**
   * Cadastra um novo campus.
   * @param {Campus} campus - Objeto contendo os dados do campus a ser cadastrado.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da API após o cadastro.
   */
  cadastrar: async (campus) => {
    try {
      const payload = {
        codCampus: campus.codCampus,
        nomCampus: campus.nomCampus
      };
      const response = await api.post('/campus', payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'cadastrar campus');
      throw error;
    }
  },

  /**
   * Atualiza os dados de um campus existente.
   * @param {Campus} campus - Objeto com os dados do campus a serem atualizados. O campo codCampus é usado para identificar o campus.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da API após a atualização.
   */
  alterar: async (campus) => {
    try {
      const payload = {
        codCampus: campus.codCampus,
        nomCampus: campus.nomCampus
      };
      const response = await api.put(`/campus/${campus.codCampus}`, payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar campus');
      throw error;
    }
  },

  /**
   * Exclui um campus pelo seu código.
   * @param {string} codCampus - O código do campus a ser excluído.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da API após a exclusão.
   */
  excluir: async (codCampus) => {
    try {
      const response = await api.delete(`/campus/${codCampus}`);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'excluir campus');
      throw error;
    }
  }
};

export default campusService;