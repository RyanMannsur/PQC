import { createContext, useEffect, useState } from "react";
import { signin as signinService } from "../services/authService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_token");

    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const signin = (cpf, senha) => {
    const resultado = signinService(cpf, senha);
    if (typeof resultado === "string") {
      return resultado;
    } else {
      const { nomUsuario, token } = resultado;
      setUsuario({ nomUsuario, token });
      localStorage.setItem("user_token", JSON.stringify({ nomUsuario, token }));
      return null;
    }
  };

  const signout = () => {
    setUsuario(null);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider value={{ usuario, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
