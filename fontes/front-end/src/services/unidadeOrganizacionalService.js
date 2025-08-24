import api from './api';
import tratarErroApi from './tratarErroApi';

/**
 * @typedef {Object} UnidadeOrganizacional
 * @property {number} codUnidade - O código da unidade.
 * @property {number} codCampus - O código do campus ao qual a unidade pertence.
 * @property {string} sglUnidade - A sigla da unidade.
 * @property {string} nomUnidade - O nome da unidade.
 */

const unidadeOrganizacionalService = {

  /**
   * Lista todas as unidades organizacionais.
   * @returns {Promise<UnidadeOrganizacional[]>} Uma Promise que resolve para uma lista de objetos UnidadeOrganizacional.
   */
  listar: async () => {
    try {
      const response = await api.get('/unidadeOrganizacional'); 
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'listar unidades organizacionais');
      throw error;
    }
  },

  /**
   * Lista todas as unidades organizacionais de um campus específico.
   * @returns {Promise<UnidadeOrganizacional[]>} Uma Promise que resolve para uma lista de objetos UnidadeOrganizacional.
   */
  obterUnidadePorCampus: async (codCampus) => {
    try {
      const response = await api.get(`/obterUnidadePorCampus/${codCampus}`); 
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'listar unidades organizacionais');
      throw error;
    }
  },


  /**
   * Inclui uma nova unidade organizacional.
   * @param {UnidadeOrganizacional} unidade - Objeto contendo os dados da unidade.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da API após a inclusão.
   */
  cadastrar: async (unidade) => {
    try {
      const payload = {
        codUnidade: unidade.codUnidade,
        codCampus: unidade.codCampus,
        sglUnidade: unidade.sglUnidade,
        nomUnidade: unidade.nomUnidade,
      };
      const response = await api.post('/unidadeOrganizacional', payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'incluir unidade organizacional');
      throw error;
    }
  },

  /**
   * Altera os dados de uma unidade organizacional existente.
   * @param {number} codCampus - O código do campus.
   * @param {number} codUnidade - O código da unidade.
   * @param {object} novosDados - Objeto com os dados a serem atualizados (sglUnidade, nomUnidade).
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da API após a atualização.
   */
  alterar: async (codCampus, codUnidade, novosDados) => {
    try {
      const response = await api.put(
        `/unidadeOrganizacional/${codCampus}/${codUnidade}`, 
        novosDados
      );
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'alterar unidade organizacional');
      throw error;
    }
  },

  /**
   * Exclui uma unidade organizacional pela sua chave composta.
   * @param {number} codCampus - O código do campus.
   * @param {number} codUnidade - O código da unidade.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da API após a exclusão.
   */
  excluir: async (codOrgaoControle) => {
    try {
      const response = await api.delete(`/unidadeOrganizacional/${codOrgaoControle}`);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'excluir unidade organizacional');
      throw error;
    }
  },
};

export default unidadeOrganizacionalService;