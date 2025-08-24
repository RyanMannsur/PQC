// src/services/tratarErroApi.js
export default function tratarErroApi(error, contexto) {
  if (error.response) {
    // Erro com resposta do servidor (status != 2xx)
    const mensagem = error.response.data?.mensagem 
                  || error.response.data?.error 
                  || 'Erro desconhecido no servidor ${contexto}.';
    console.error(`Erro ao ${contexto}:`, mensagem);
    throw new Error(mensagem);
  }

  if (error.request) {
    // Nenhuma resposta do servidor
    console.error(`Erro ao ${contexto}: servidor não respondeu.`);
    throw new Error('Servidor não respondeu. Verifique sua conexão.');
  }

  // Erro na configuração da requisição ou outro problema
  console.error(`Erro ao ${contexto}:`, error.message);
  throw new Error(error.message || 'Erro inesperado ${contexto}.');
}
