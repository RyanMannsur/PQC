import api from './api'; 
import tratarErroApi from './tratarErroApi'; 

const usuarioService = {
  /**
   * Lista todos os usuários.
   * Assume que a API retorna um array de objetos.
   */
  listar: async () => {
    try {
      const response = await api.get('/usuario');
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data; 
    } catch (error) {
      tratarErroApi(error, 'listar usuários');
      throw error;
    }
  },

  /**
   * Lista todos os potenciais usuários responsáveis
   *    * Assume que a API retorna um array de objetos.
   */
  obterResponsaveis: async () => {
    try {
      const response = await api.get('/obterResponsaveis');
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data; 
    } catch (error) {
      tratarErroApi(error, 'listar usuários');
      throw error;
    }
  },

  /**
   * Cadastra um novo usuário.
   * @param {object} usuario - Objeto contendo os dados do usuário.
   * Ex: { codCPF, nomUsuario, idtTipoUsuario }
   */
  cadastrar: async (usuario) => {
    try {
      const payload = {
        codCPF: usuario.codCPF,
        nomUsuario: usuario.nomUsuario,
        idtTipoUsuario: usuario.idtTipoUsuario,
      };
      const response = await api.post('/usuario', payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'cadastrar usuário');
      throw error;
    }
  },

  /**
   * Atualiza um usuário existente.
   * A chave primária é codCPF.
   * @param {object} usuario - Objeto contendo os dados atualizados e o CPF do usuário.
   * Ex: { codCPF, nomUsuario, idtTipoUsuario, codCampus, codUnidade, codPredio, codLaboratorio }
   */
  alterar: async (usuario) => {
    try {
      const { codCPF } = usuario;
      // Envie apenas os campos que podem ser atualizados no payload
      const payload = {
        nomUsuario: usuario.nomUsuario,
        idtTipoUsuario: usuario.idtTipoUsuario,
        codCampus: usuario.codCampus,
        codUnidade: usuario.codUnidade,
        codPredio: usuario.codPredio,
        codLaboratorio: usuario.codLaboratorio,
      };
      const response = await api.put(`/usuario/${codCPF}`, payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar usuário');
      throw error;
    }
  },

  /**
   * Exclui um usuário.
   * @param {string} codCPF - CPF do usuário a ser excluído.
   */
  excluir: async (codCPF) => {
    try {
      const response = await api.delete(`/usuario/${codCPF}`);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'excluir usuário');
      throw error;
    }
  }
}

export default usuarioService;