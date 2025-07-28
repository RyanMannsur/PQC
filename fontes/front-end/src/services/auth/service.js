// services/auth/service.js
const API_BASE_URL = "http://localhost:8088/api";

export const login = async (cpf, senha) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cpf, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro no login");
    }

    const data = await response.json();
    
    // Salvar apenas o token no localStorage
    localStorage.setItem("userToken", data.token);
    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const validateToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Token inválido");
    }

    const data = await response.json();
    
    // Atualizar apenas o token no localStorage
    localStorage.setItem("userToken", data.token);
    return data;
  } catch (error) {
    console.error("Erro na validação do token:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("labId");
};

export const getCurrentToken = () => {
  return localStorage.getItem("userToken");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    return null;
  }
  return { token };
};

export const isAuthenticated = () => {
  const token = getCurrentToken();
  return token !== null;
};

export const isAdmin = () => {
  // Não é mais possível saber se é admin pelo localStorage, deve ser validado via API/contexto
  return false;
};
