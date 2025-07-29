// services/auth/service.js
const API_BASE_URL = "http://localhost:8088/api";
// Login via API
export const login = async (cpf, senha) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf, senha }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Usuário não cadastrado ou senha incorreta");
  }
  const userData = await response.json();
  localStorage.setItem("userToken", userData.token);
  localStorage.setItem("user_data", JSON.stringify(userData));
  return userData;
};

// Validação de token via API
export const validateToken = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Token inválido");
  }
  return await response.json();
};

export const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user_data");
  localStorage.removeItem("labId");
};

export const getCurrentToken = () => {
  return localStorage.getItem("userToken");
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem("user_data");
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  const token = getCurrentToken();
  return !!token;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && (user.isADM === true || user.isADM === 1);
};
