import usuarios from "./users.json";

export const signin = (cpf, senha) => {
  const usuariosList = usuarios.filter(
    (user) => user.cpf === cpf && user.senha === senha
  );

  if (usuariosList.length) {
    const { nomUsuario, token } = usuariosList[0];
    localStorage.setItem("user_token", JSON.stringify({ nomUsuario, token }));
    return { nomUsuario, token };
  } else {
    return "Usuário não cadastrado ou senha incorreta";
  }
};

export const getUserDetails = () => {
  const userToken = localStorage.getItem("user_token");
  if (userToken) {
    const { nomUsuario, token } = JSON.parse(userToken);
    return { nomUsuario, token };
  } else {
    return "Usuário não está logado";
  }
};
