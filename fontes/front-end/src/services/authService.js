import api from './api';
import tratarErroApi from './tratarErroApi';

const authService = {

  /**
   * Realiza a autenticação do usuário.
   * @param {string} cpf - O CPF do usuário para login.
   * @returns {Promise<Usuario>} Uma Promise que resolve para o objeto do usuário logado.
   */
  login: async (cpf) => {
    try {
      const response = await api.post('/login', { cpf });
      const usuario = response.data;
      localStorage.setItem("usuario", JSON.stringify(usuario));
      return usuario;
    } catch (error) {
      tratarErroApi(error, "login");
      throw error;
    }
  },

  /**
   * Remove os dados do usuário do localStorage para deslogar.
   */
  logout: () => {
    localStorage.removeItem("usuario");
  },

  /**
   * Obtém os dados do usuário atual armazenados no localStorage.
   * @returns {Usuario|null} O objeto do usuário ou null se não houver usuário logado.
   */
  getCurrentUser: () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  },

  /**
   * seta os dados do usuário atual  no localStorage.
   */
  setCurrentUser: (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },


  /*
   * @typedef {Object} Usuario
   * @property {string} codCPF - O CPF do usuário.
   * @property {string} [codCampus] - Código do último campus acessado.
   * @property {string} [codUnidade] - Código da última unidade acessada.
   * @property {string} [codPredio] - Código do último prédio acessado.
   * @property {string} [codLaboratorio] - Código do último laboratório acessado.
   */
  alterarLaboratorioCorrente: async (usuario) => {
    const lab = usuario.laboratorios[usuario.indCorrente]
    try {
      const payload = {
        'codCPF': usuario.codCPF,
        'codCampus': lab.codCampus,
        'codUnidade': lab.codUnidade,
        'codPredio': lab.codPredio,
        'codLaboratorio': lab.codLaboratorio
      }
      const response = await api.put("/alterarLaboratorioCorrente", payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar laboratório corrente do usuário');
      throw error;
    }
  }
}
export default authService;