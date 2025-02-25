import { createContext, useEffect, useState } from "react";
import { signin as signinService } from "../services/authService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_token");

    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }

    setLoading(false);
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
    localStorage.removeItem("labId");
  };

  return (
    <AuthContext.Provider value={{ usuario, signin, signout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
