import usuarios from "./users.json";

export const signin = (cpf, senha) => {
  const usuarioEncontrado = usuarios.find(
    (user) => user.cpf === cpf && user.senha === senha
  );

  if (usuarioEncontrado) {
    const { nomUsuario, codSiape } = usuarioEncontrado;
    localStorage.setItem("user_data", JSON.stringify({ nomUsuario, codSiape }));
    return { nomUsuario, codSiape };
  } else {
    return "Usuário não cadastrado ou senha incorreta";
  }
};

export const getUserDetails = () => {
  const userData = localStorage.getItem("user_data");
  if (userData) {
    return JSON.parse(userData);
  } else {
    return "Usuário não está logado";
  }
};
