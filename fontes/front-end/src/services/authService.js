export const signin = async (cpf, senha) => {
try {
  const response = await fetch("http://localhost:8088/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cpf, senha }) 
  });

  if (!response.ok) {
    throw new Error("Usuário não cadastrado ou senha incorreta");
  }

  const data = await response.json(); 
  const { token } = data;

  localStorage.setItem("user_token", token);

  return { token }; 
} catch (error) {
  return error.message; 
}
};

export const getUserDetails = () => {
const userToken = localStorage.getItem("user_token");
if (userToken) {
  return { token: userToken }; 
} else {
  return "Usuário não está logado";
}
};