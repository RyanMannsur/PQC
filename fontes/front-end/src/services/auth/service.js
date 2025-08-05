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


export const listarUsuarios = async () => {
  const res = await fetch("http://localhost:8088/api/usuarios");
  if (!res.ok) throw new Error("Erro ao listar usuários");
  return await res.json();
};

// Transformar usuário em ADM
export const transformarUsuarioAdm = async (id) => {
  const res = await fetch(`http://localhost:8088/api/usuarios/${id}/adm`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro ao transformar usuário em ADM");
  return await res.json();
};

// Adicionar ou remover local de estocagem de um usuário
export const modificarLocalEstocagemUsuario = async (token, codCampus, codUnidade, codPredio, codLaboratorio, action) => {
  const res = await fetch(`http://localhost:8088/usuarios/${token}/localestocagem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codCampus, codUnidade, codPredio, codLaboratorio, action })
  });
  if (!res.ok) throw new Error("Erro ao modificar local de estocagem");
  return await res.json();
};

// Listar todos os locais de estocagem de um usuário
export const listarLocaisEstocagemUsuario = async (token) => {
  const res = await fetch(`http://localhost:8088/usuarios/${token}/localestocagem`);
  if (!res.ok) throw new Error("Erro ao listar locais de estocagem do usuário");
  return await res.json();
};

// Listar locais de estocagem gerenciados por um usuário (por token)
export const listarLocaisUsuarioToken = async (token) => {
  const res = await fetch(`http://localhost:8088/api/usuarios/${token}/localestocagem`);
  if (!res.ok) throw new Error('Erro ao listar locais do usuário');
  return await res.json();
};

// Listar locais disponíveis para o usuário (não gerenciados por ele)
export const listarLocaisDisponiveis = async (token) => {
  const res = await fetch(`http://localhost:8088/api/usuarios/${token}/localestocagem/disponiveis`);
  if (!res.ok) throw new Error('Erro ao listar locais disponíveis');
  return await res.json();
};

// Adicionar local ao usuário
export const adicionarLocalUsuario = async (token, chave) => {
  // chave: string codCampus-codUnidade-codPredio-codLaboratorio
  const [codCampus, codUnidade, codPredio, codLaboratorio] = chave.split('-');
  const res = await fetch(`http://localhost:8088/api/usuarios/${token}/localestocagem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codCampus, codUnidade, codPredio, codLaboratorio, action: 'add' })
  });
  if (!res.ok) throw new Error('Erro ao adicionar local');
  return await res.json();
};

// Remover local do usuário
export const removerLocalUsuario = async (token, local) => {
  const { codCampus, codUnidade, codPredio, codLaboratorio } = local;
  const res = await fetch(`http://localhost:8088/api/usuarios/${token}/localestocagem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codCampus, codUnidade, codPredio, codLaboratorio, action: 'remove' })
  });
  if (!res.ok) throw new Error('Erro ao remover local');
  return await res.json();
};

// Remover status de admin de um usuário
export const removerUsuarioAdm = async (id) => {
  const res = await fetch(`http://localhost:8088/api/usuarios/${id}/remover-adm`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erro ao remover status de admin do usuário");
  return await res.json();
};
