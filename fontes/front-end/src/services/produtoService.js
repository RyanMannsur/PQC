import api from './api';
import tratarErroApi from './tratarErroApi';

const produtoService = {
  /**
   * Lista todos os produtos da base de dados.
   * @returns {Promise<Array>} Uma Promise que resolve para uma lista de produtos.
   */
  listar: async () => {
    try {
      const response = await api.get('/produtos');
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'listar produtos');
      throw error;
    }
  },

  /**
   * Cadastra um novo produto.
   * @param {object} dadosCadastro - Objeto contendo os dados do produto a ser cadastrado.
   * @returns {Promise<object>} Uma Promise que resolve para o produto cadastrado.
   */
  cadastrar: async (dadosCadastro) => {
    try {
      const response = await api.post('/produtos', dadosCadastro);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'cadastrar produto');
      throw error;
    }
  },

  /**
   * Atualiza um produto existente.
   * @param {object} produto - Objeto contendo os dados do produto a serem atualizados.
   * @returns {Promise<object>} Uma Promise que resolve para o produto atualizado.
   */
  atualizar: async (produto) => {
    try {
      const payload = {
        nomProduto: produto.nomProduto,
        nomLista: produto.nomLista,
        perPureza: produto.perPureza,
        vlrDensidade: produto.vlrDensidade,
        idtAtivo: produto.idtAtivo,
        orgaosControle: produto.orgaosControle
      };
      
      const response = await api.put(`/produtos/${produto.codProduto}`, payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar produto');
      throw error;
    }
  },

  /**
   * Exclui um produto pelo seu código.
   * @param {number} codProduto - O código do produto a ser excluído.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da exclusão.
   */
  excluir: async (codProduto) => {
    try {
      const response = await api.delete(`/produtos/${codProduto}`);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'excluir produto');
      throw error;
    }
  },

  /**
   * Obtém os produtos de um laboratório específico.
   * @param {string} codCampus - Código do campus.
   * @param {string} codUnidade - Código da unidade.
   * @param {string} codPredio - Código do prédio.
   * @param {string} codLaboratorio - Código do laboratório.
   * @returns {Promise<Array>} Uma Promise que resolve para a lista de produtos do laboratório.
   */
  obterProdutosPorLaboratorio: async (codCampus, codUnidade, codPredio, codLaboratorio) => {
    try {
      const url = `/obterProdutosPorLaboratorio/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`;
      const response = await api.get(url);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'buscar produtos por laboratório');
      throw error;
    }
  },

  /**
   * Obtém o estoque de um local de estocagem em uma data opcional.
   * @param {string} codCampus - Código do campus.
   * @param {string} codUnidade - Código da unidade.
   * @param {string} codPredio - Código do prédio.
   * @param {string} codLaboratorio - Código do laboratório.
   * @param {string} [data=null] - Data opcional para o estoque.
   * @returns {Promise<Array>} Uma Promise que resolve para a lista de itens em estoque.
   */
  obterEstoqueLocalEstocagem: async (codCampus, codUnidade, codPredio, codLaboratorio) => {
    try {
      const response = await api.get(`/obterEstoqueLocalEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`)
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'obter estoque no local de estocagem');
      throw error;
    }
  },

  /**
   * Atualiza entrada em ProdutoItem por Compra ou Doação.
   * @param - data
   * { tipoCadastro, codCampus, codUnidade, codPredio, codLaboratorio,
   *    items: { codProduto,
   *             items: { qtdEstoque, datValidade, codEmbalagem, txtJustificativa}
   *           }
   * }
   * @returns {Promise<object>} Uma Promise que resolve para o objeto do produto.
   */
  atualizarMovtoEstoqueCompraDoacao: async (payload) => {
    try {
      const response = await api.post("/atualizarMovtoEstoqueCompraDoacao", payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'Atualizar entrada no estoque');
      throw error;
    }
  },


  /**
   * Atualiza o INVENTARIOS dos produtos em um laboratório.
   * @param {string} codCampus - Código do campus.
   * @param {string} codUnidade - Código da unidade.
   * @param {string} codPredio - Código do prédio.
   * @param {string} codLaboratorio - Código do laboratório.
   * @param {Array<object>} produtos - Lista de produtos a serem atualizados.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da atualização.
   */
  atualizarInventario: async (payload) => {
    try {
      const response = await api.post("/atualizarInventario", payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }

      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar o inventário de produtos no laboratório');
      throw error;
    }
  },

  
  /**
   * Atualiza o TRANSFERENCIA dos produtos entre laboratórios.
   * @param {string} codCampus - Código do campus.
   * @param {string} codUnidade - Código da unidade.
   * @param {string} codPredio - Código do prédio.
   * @param {string} codLaboratorio - Código do laboratório.
   * @param {Array<object>} produtos - Lista de produtos a serem transferidos.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da atualização.
   */
  atualizarTransferencia: async (payload) => {
    try {
      const response = await api.post("/atualizarTransferencia", payload);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'atualizar a transferência de produtos entre laboratórios');
      throw error;
    }
  },

  /**
   * Implanta itens em um laboratório.
   * @param {object} dadosLaboratorio - Objeto com os dados dos itens a serem implantados.
   * @returns {Promise<object>} Uma Promise que resolve para a resposta da operação.
   */
  implantarItensLaboratorio: async (dadosLaboratorio) => {
    try {
      const response = await api.post("/implantarItensLaboratorio", dadosLaboratorio);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'implantar itens no laboratório');
      throw error;
    }
  },
  
  /**
   * Obtém os produtos não implantados para um local específico.
   * @param {string} codCampus - Código do campus.
   * @param {string} codUnidade - Código da unidade.
   * @param {string} codPredio - Código do prédio.
   * @param {string} codLaboratorio - Código do laboratório.
   * @returns {Promise<Array>} Uma Promise que resolve para a lista de produtos não implantados.
   */
  obterProdutosNaoImplantadosPorLocal: async (codCampus, codUnidade, codPredio, codLaboratorio) => {
    try {
      const url = `/obterProdutosNaoImplantadosPorLocal/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`;
      const response = await api.get(url);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data; 
    } catch (error) {
      tratarErroApi(error, 'obter produtos não implantados por local');
      throw error; 
    }
  },
  
  /**
   * Realiza uma consulta PQC (Produtos Químicos Controlados) por CPF.
   * @param {string} codCPF - O CPF para a consulta.
   * @returns {Promise<object>} Uma Promise que resolve para os dados da consulta.
   */
  consultaPQC: async (codCPF) => {
    try {
      const response = await api.get(`/consultaPQC/${codCPF}`);
      if (response.data && response.data.tipo === 'ERRO') {
        throw { response: { data: response.data } };
      }
      return response.data;
    } catch (error) {
      tratarErroApi(error, 'obter consulta PQC');
      throw error;
    }
  },


  /**
     * Verificar se já houve implantação em um local específico.
     * @param {string} codCampus - Código do campus.
     * @param {string} codUnidade - Código da unidade.
     * @param {string} codPredio - Código do prédio.
     * @param {string} codLaboratorio - Código do laboratório.
     * @returns {Promise<Array>} Uma Promise que resolve a quantidade de itens implantados.
     */
    verificarSeTeveImplantacao: async (codCampus, codUnidade, codPredio, codLaboratorio) => {
      try {
        const url = `/verificarSeTeveImplantacao/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`;
        const response = await api.get(url);
        if (response.data && response.data.tipo === 'ERRO') {
          throw { response: { data: response.data } };
        }
        return response.data; 
      } catch (error) {
        tratarErroApi(error, 'obter quantidade de produtos implantados por local');
        throw error; 
      }
    }
  }

export default produtoService;