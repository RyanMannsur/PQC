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
    
    // Salvar token no localStorage
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userCpf", data.cpf);
    localStorage.setItem("userId", data.id);
    localStorage.setItem("userIsADM", data.isADM);
    
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
    
    // Atualizar dados no localStorage
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userCpf", data.cpf);
    localStorage.setItem("userId", data.id);
    localStorage.setItem("userIsADM", data.isADM);
    
    return data;
  } catch (error) {
    console.error("Erro na validação do token:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userCpf");
  localStorage.removeItem("userId");
  localStorage.removeItem("userIsADM");
  localStorage.removeItem("labId");
};

export const getCurrentToken = () => {
  return localStorage.getItem("userToken");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("userToken");
  const cpf = localStorage.getItem("userCpf");
  const id = localStorage.getItem("userId");
  const isADM = localStorage.getItem("userIsADM") === "true";
  
  if (!token || !cpf || !id) {
    return null;
  }
  
  return { token, cpf, id, isADM };
};

export const isAuthenticated = () => {
  const token = getCurrentToken();
  return token !== null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.isADM === true;
};
