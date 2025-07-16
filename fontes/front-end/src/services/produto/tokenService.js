// services/produto/tokenService.js
import { getCurrentToken } from '../auth/service';

const API_BASE_URL = "http://localhost:8088/api";

export const obterLocaisEstoque = async () => {
  const token = getCurrentToken();
  
  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/obterLocaisEstoque/token/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao obter locais de estoque");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao obter locais de estoque:", error);
    throw error;
  }
};

export const consultarProdutos = async () => {
  const token = getCurrentToken();
  
  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/consultaPQC/token/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao consultar produtos");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao consultar produtos:", error);
    throw error;
  }
};
