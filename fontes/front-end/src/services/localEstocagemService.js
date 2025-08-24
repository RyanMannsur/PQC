import api from './api';
import tratarErroApi from './tratarErroApi';

const localEstocagemService = {
  /**
   * Lista todos os locais de estocagem.
   * A API já retorna um array de objetos, então não é necessária conversão.
   */
  listar: async () => {
    try {
      const response = await api.get('/localEstocagem');
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'listar locais de estocagem');
      throw error;
    }
  },

  /**
   * Lista todos os locais de estocagem exceto o corrente.
   * A API já retorna um array de objetos, então não é necessária conversão.
   */
  obterOutrosLocaisEstocagem: async (codCampus, codUnidade, codPredio, codLaboratorio) => {
    try {
      const response = await api.get(`/obterOutrosLocaisEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'listar locais de estocagem');
      throw error;
    }
  },
  /**
   * Cadastra um novo local de estocagem.
   * @param {object} local - Objeto contendo os dados do local.
   */
  cadastrar: async (local) => {

    try {
      const payload = {
        codCampus: local.codCampus,
        codUnidade: local.codUnidade,
        codPredio: local.codPredio,
        codLaboratorio: local.codLaboratorio,
        nomLocal: local.nomLocal,
        codCPFResponsavel: local.codCPFResponsavel
      };
      const response = await api.post('/localEstocagem', payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'cadastrar local de estocagem');
      throw error;
    }
  },

  /**
   * Atualiza um local de estocagem existente.
   * @param {object} local - Objeto contendo os dados atualizados e a chave primária.
   */
  alterar: async (local) => {
    try {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = local;
      const payload = {
        'nomLocal': local.nomLocal,
        'codCPFResponsavel': local.codCPFResponsavel
      };
      const url = `/localEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`;
      const response = await api.put(url, payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar local de estocagem');
      throw error;
    }
  },

  /**
   * Exclui um local de estocagem.
   * @param {object} local - Objeto contendo a chave primária do local a ser excluído.
   */
  excluir: async (local) => {
    try {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = local;
      const url = `/localEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`;
      const response = await api.delete(url);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'excluir local de estocagem');
      throw error;
    }
  }
};

export default localEstocagemService;