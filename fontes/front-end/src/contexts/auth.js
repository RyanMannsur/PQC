import { createContext, useEffect, useState } from "react";
import { signin as signinService } from "../services/authService";
import users from "../services/users.json";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState();

  useEffect(() => {
    const userCpf = localStorage.getItem("user_cpf");

    if (userCpf) {
      const usuarioList = users.filter((user) => user.cpf === userCpf);

      if (usuarioList.length) setUsuario(usuarioList[0]);
    }
  }, []);

  const signin = (cpf) => {
    const resultado = signinService(cpf);
    if (typeof resultado === "string") {
      return resultado;
    } else {
      setUsuario(resultado);
    }
  };

  const signout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ usuario: usuario, logado: !!usuario, signin, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
