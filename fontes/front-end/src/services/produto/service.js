import api from '../api'

export const obterProdutosPorLaboratorio = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio
) => {
  try {
    const response = await api.get(
      `/obterProdutosPorLaboratorio/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos por laboratório:", error);
    return [];
  }
};

export const obterEstoqueLocalEstocagem = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  data = null
) => {
  try {
    let url = `/obterEstoqueLocalEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`;
    if (data) {
      url += `?data=${data}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter estoque no local de estocagem:", error);
    return [];
  }
};

export const obterProduto = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  codProduto,
  seqItem,
  data = null
) => {
  try {
    let url = `/ObterProdutoBYCodigoAndSequencia/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}/${codProduto}/${seqItem}`;
    if (data) {
      url += `?data=${data}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter produto:", error);
    return {};
  }
};

export const atualizarInventario = async (
  codProduto,
  seqItem,
  qtdEstoque,
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  idtTipoMovto,
  seqItemOrigem = undefined
) => {
  try {
    const payload = {
      codProduto,
      seqItem,
      qtdEstoque,
      codCampus,
      codUnidade,
      codPredio,
      codLaboratorio,
      idtTipoMovto,
    };
    if (seqItemOrigem !== undefined) {
      payload.seqItemOrigem = seqItemOrigem;
    }
    const response = await api.post("/atualizarInventarioBySequencia", payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar inventário:", error);
    return { error: "Erro ao atualizar inventário" };
  }
};

export const buscarProdutos = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  nomProduto,
  pureza,
  densidade
) => {
  try {
    const response = await api.get(`/buscarProdutos`, {
      params: {
        codCampus,
        codUnidade,
        codPredio,
        codLaboratorio,
        nomProduto,
        pureza,
        densidade,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
};

export const adicionarProduto = async (codProduto, produto) => {
  try {
    const response = await api.post(`/adicionar_produto/${codProduto}`, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    throw error;
  }
};

export const obterProdutos = async () => {
  try {
    const response = await api.get("/produtos");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    return [];
  }
};

export const obterNomeLocalEstocagem = async (codCampus, codUnidade, codPredio, codLaboratorio) => {
  try {
    const response = await api.get(`/obterNomeLocalEstocagem/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar nome do local de estocagem:", error);
    return [];
  }
};

export const atualizarQuantidadeProdutosLaboratorio = async (
  codCampus,
  codUnidade,
  codPredio,
  codLaboratorio,
  produtos
) => {
  try {
    const response = await api.post("/atualizarQuantidadeProdutosLaboratorio", {
      codCampus,
      codUnidade,
      codPredio,
      codLaboratorio,
      produtos,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar quantidade de produtos no laboratório:",
      error
    );
    return { error: "Erro ao atualizar quantidade de produtos no laboratório" };
  }
};

export const obterProdutoPorId = async (codProduto) => {
  try {
    const response = await api.get(
      `/api/produtos/obterProdutoPorId/${codProduto}`
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao obter produto por ID (${codProduto}):`, error);
    return null;
  }
};

export const obterProdutoPeloCodigo = async (codProduto) => {
  try {
    const response = await api.get(`/obterProdutoPeloCodigo/${codProduto}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao obter produto pelo código (${codProduto}):`, error);
    return null;
  }
};


export const implantarItensLaboratorio = async (dadosLaboratorio) => {
  try {
    console.log(dadosLaboratorio)
    const response = await api.post("/implantarItensLaboratorio", dadosLaboratorio);
    return response.data;
  } catch (error) {
    console.error("Erro ao implantar itens no laboratório:", error);
    return null;
  }
  };

  export const cadastrarProdutos = async (dadosCadastro) => {
    try {
      console.log("Enviando dados para cadastro:", dadosCadastro);
      const response = await api.post("/cadastrarProdutos", dadosCadastro);
      console.log("Resposta recebida:", response);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar produtos:", error);
      console.error("Detalhes do erro:", error.response?.data || error.message);
      throw error;
    }
    };

    export const produto = async (dadosCadastro) => {
    try {
      const response = await api.post("/Produto", dadosCadastro);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar produtos:", error);
      throw error;
    }
    };

    export const obterProdutosNaoImplantadosPorLocal = async (codCampus, codUnidade, codPredio, codLaboratorio) => {
      try {
        const response = await api.get(`/obterProdutosNaoImplantadosPorLocal/${codCampus}/${codUnidade}/${codPredio}/${codLaboratorio}`);
        return response.data; 
      } catch (error) {
        console.error("Erro ao buscar produtos por laboratório:", error);
        throw error; 
      }
      };

export const obterRelatorioProdutos = async (dataInicial, dataFinal) => {
try {
  const params = {};
  if (dataInicial) params.dataInicial = dataInicial;
  if (dataFinal) params.dataFinal = dataFinal;

  
  const response = await api.get("/relatorioProdutos", { params });
  return response.data;
} catch (error) {
  console.error("Erro ao obter relatório de produtos:", error);
  throw error; 
}
}

export const getConsultaPQC = async (codSiape) => {
  try {
    const response = await api.get(`/consultaPQC/${codSiape}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar inventário:", error);
    throw error;
  }
};

const produtoService = {
  listar: async () => {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      throw error;
    }
  },

  cadastrar: async (produto) => {
    try {
      const response = await api.post('/produtos', produto);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      throw error;
    }
  },

  atualizar: async (produto) => {
    try {
      // Monta payload apenas com campos definidos
      const payload = {};
      if (produto.codProduto !== undefined) payload.codProduto = produto.codProduto;
      if (produto.nomProduto !== undefined) payload.nomProduto = produto.nomProduto;
      if (produto.nomLista !== undefined) payload.nomLista = produto.nomLista;
      if (produto.perPureza !== undefined) payload.perPureza = produto.perPureza;
      if (produto.vlrDensidade !== undefined) payload.vlrDensidade = produto.vlrDensidade;
      if (produto.idtAtivo !== undefined) payload.idtAtivo = produto.idtAtivo;
      if (produto.orgaosControle !== undefined) payload.orgaosControle = produto.orgaosControle;
      const response = await api.put(`/produtos/${produto.codProduto}`, payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  excluir: async (codProduto) => {
    try {
      const response = await api.delete(`/produtos/${codProduto}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      throw error;
    }
  }
};

export default produtoService;
