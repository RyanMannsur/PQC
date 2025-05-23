import axios from "axios";
import { API_URL } from "../../config/config";

const api = axios.create({
  baseURL: API_URL,
});

export default api;

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
  idtTipoMovto
) => {
  try {
    const response = await api.post("/atualizarInventarioBySequencia", {
      codProduto,
      seqItem,
      qtdEstoque,
      codCampus,
      codUnidade,
      codPredio,
      codLaboratorio,
      idtTipoMovto,
    });
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
  nomeProduto,
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
        nomeProduto,
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
    const response = await api.post("/implantarItensLaboratorio", dadosLaboratorio);
    return response.data;
  } catch (error) {
    console.error("Erro ao implantar itens no laboratório:", error);
    return null;
  }
  };

  export const cadastrarProdutos = async (dadosCadastro) => {
    try {
      const response = await api.post("/cadastrarProdutos", dadosCadastro);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar produtos:", error);
      throw error;
    }
    };

    export const obterProdutosImplantadosPorLaboratorio = async (codCampus, codUnidade, codPredio, codLaboratorio) => {
      try {
        const response = await api.get("/produtosImplantadosPorLaboratorio", {
          params: { codCampus, codUnidade, codPredio, codLaboratorio },
        });
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
};