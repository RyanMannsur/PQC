import usuarios from "./users.json";

export const signin = (cpf) => {
  const usuariosList = usuarios.filter((user) => user.cpf === cpf);

  if (usuariosList.length) {
    localStorage.setItem("user_token", JSON.stringify({ cpf }));
    return { cpf };
  } else {
    return "Usuário não cadastrado";
  }
};
